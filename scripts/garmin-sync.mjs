/**
 * Garmin Sync Script
 * Liest Daten aus garmin-givemydata SQLite-DB und pusht sie zu Turso.
 *
 * Ausfuehrung: node --env-file=.env.local scripts/garmin-sync.mjs
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
import { existsSync } from 'fs';
import { resolve } from 'path';
import { randomBytes } from 'crypto';

const GARMIN_DB_PATH = process.env.GARMIN_DB_PATH || resolve(process.env.USERPROFILE || '', '.garmin-givemydata', 'garmin.db');
const TURSO_URL = process.env.TURSO_DATABASE_URL?.replace('libsql://', 'https://');
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const USER_ID = 'franz';

if (!TURSO_URL || !TURSO_TOKEN) {
  console.error('TURSO_DATABASE_URL und TURSO_AUTH_TOKEN muessen gesetzt sein');
  process.exit(1);
}

if (!existsSync(GARMIN_DB_PATH)) {
  console.error(`Garmin DB nicht gefunden: ${GARMIN_DB_PATH}`);
  process.exit(1);
}

const db = new Database(GARMIN_DB_PATH, { readonly: true });
const id = () => randomBytes(12).toString('hex');

async function tursoExecute(statements) {
  // Batch in chunks of 20 to avoid payload limits
  for (let i = 0; i < statements.length; i += 20) {
    const batch = statements.slice(i, i + 20);
    const requests = batch.map(({ sql, args }) => ({
      type: 'execute',
      stmt: { sql, args },
    }));
    requests.push({ type: 'close' });

    const res = await fetch(`${TURSO_URL}/v3/pipeline`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${TURSO_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Turso Fehler (batch ${i}):`, text.substring(0, 200));
    }
  }
}

function t(v) { return v == null ? { type: 'null' } : { type: 'text', value: String(v) }; }
function i(v) { return v == null ? { type: 'null' } : { type: 'integer', value: String(Math.round(v)) }; }
function f(v) { return v == null ? { type: 'null' } : { type: 'float', value: v }; }

// ─── Sync Daily Summaries ───────────────────────────────
async function syncDailies() {
  const rows = db.prepare(`
    SELECT calendar_date, total_steps, body_battery_highest, body_battery_lowest,
           average_stress_level, resting_heart_rate, active_kilocalories, total_kilocalories
    FROM daily_summary ORDER BY calendar_date DESC LIMIT 30
  `).all();

  const stmts = rows.map(row => ({
    sql: `INSERT OR REPLACE INTO "GarminDaily" ("id","userId","date","steps","bodyBatteryHigh","bodyBatteryLow","avgStress","restingHr","activeCalories","totalCalories","createdAt")
          VALUES (COALESCE((SELECT "id" FROM "GarminDaily" WHERE "date"=?1),?2),?3,?1,?4,?5,?6,?7,?8,?9,?10,CURRENT_TIMESTAMP)`,
    args: [
      t(row.calendar_date), t(id()), t(USER_ID),
      i(row.total_steps), i(row.body_battery_highest), i(row.body_battery_lowest),
      i(row.average_stress_level), i(row.resting_heart_rate),
      f(row.active_kilocalories), f(row.total_kilocalories),
    ],
  }));

  await tursoExecute(stmts);
  console.log(`Tageswerte: ${rows.length} synchronisiert`);
}

// ─── Sync Sleep ─────────────────────────────────────────
async function syncSleep() {
  const rows = db.prepare(`
    SELECT calendar_date, sleep_time_seconds, deep_sleep_seconds,
           light_sleep_seconds, rem_sleep_seconds, awake_sleep_seconds
    FROM sleep ORDER BY calendar_date DESC LIMIT 30
  `).all();

  const stmts = rows.map(row => ({
    sql: `INSERT OR REPLACE INTO "SleepEntry" ("id","userId","date","durationMin","deepMin","lightMin","remMin","awakeMin","createdAt")
          VALUES (COALESCE((SELECT "id" FROM "SleepEntry" WHERE "userId"=?1 AND "date"=?2),?3),?1,?2,?4,?5,?6,?7,?8,CURRENT_TIMESTAMP)`,
    args: [
      t(USER_ID), t(row.calendar_date), t(id()),
      i((row.sleep_time_seconds || 0) / 60),
      i((row.deep_sleep_seconds || 0) / 60),
      i((row.light_sleep_seconds || 0) / 60),
      i((row.rem_sleep_seconds || 0) / 60),
      i((row.awake_sleep_seconds || 0) / 60),
    ],
  }));

  await tursoExecute(stmts);
  console.log(`Schlaf: ${rows.length} synchronisiert`);
}

// ─── Sync HRV ───────────────────────────────────────────
async function syncHrv() {
  const rows = db.prepare(`
    SELECT calendar_date, weekly_avg, last_night, baseline_low, baseline_upper, status
    FROM hrv ORDER BY calendar_date DESC LIMIT 30
  `).all();

  // HRV goes into GarminDaily as hrvStatus and hrvBaseline
  const stmts = rows.filter(r => r.last_night != null).map(row => ({
    sql: `UPDATE "GarminDaily" SET "hrvStatus"=?1, "hrvBaseline"=?2 WHERE "date"=?3`,
    args: [f(row.last_night), f(row.baseline_upper), t(row.calendar_date)],
  }));

  await tursoExecute(stmts);
  console.log(`HRV: ${rows.length} synchronisiert`);
}

// ─── Sync Activities ────────────────────────────────────
async function syncActivities() {
  const rows = db.prepare(`
    SELECT activity_id, activity_name, activity_type, start_time_local,
           duration_seconds, distance_meters, average_hr, max_hr,
           calories, aerobic_training_effect, vo2max_value, raw_json
    FROM activity WHERE activity_id IS NOT NULL AND start_time_local IS NOT NULL
    ORDER BY start_time_local DESC LIMIT 50
  `).all();

  const stmts = rows.map(row => ({
    sql: `INSERT OR IGNORE INTO "GarminActivity" ("id","userId","garminActivityId","activityType","activityName","startTime","durationSec","distanceM","avgHr","maxHr","caloriesBurned","trainingEffect","vo2max","rawJson","createdAt")
          VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,CURRENT_TIMESTAMP)`,
    args: [
      t(id()), t(USER_ID), t(String(row.activity_id)),
      t(row.activity_type || 'unknown'), t(row.activity_name),
      t(row.start_time_local), i(row.duration_seconds || 0),
      f(row.distance_meters), i(row.average_hr), i(row.max_hr),
      f(row.calories), f(row.aerobic_training_effect), f(row.vo2max_value),
      t(row.raw_json),
    ],
  }));

  await tursoExecute(stmts);
  console.log(`Aktivitaeten: ${rows.length} synchronisiert`);
}

// ─── Main ───────────────────────────────────────────────
console.log(`Garmin Sync: ${new Date().toISOString()}`);
console.log(`DB: ${GARMIN_DB_PATH}`);

try {
  await syncDailies();
  await syncSleep();
  await syncHrv();
  await syncActivities();
  console.log('Sync abgeschlossen!');
} catch (e) {
  console.error('Fehler:', e);
  process.exit(1);
} finally {
  db.close();
}
