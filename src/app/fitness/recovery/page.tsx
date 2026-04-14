"use client";

import { useEffect, useState } from "react";
import SleepChart from "@/components/charts/SleepChart";
import BodyBatteryChart from "@/components/charts/BodyBatteryChart";
import HrvChart from "@/components/charts/HrvChart";

interface SleepEntry {
  date: string;
  sleepScore: number | null;
  durationMin: number;
  deepMin: number | null;
  lightMin: number | null;
  remMin: number | null;
  awakeMin: number | null;
}

interface GarminDaily {
  date: string;
  bodyBatteryHigh: number | null;
  bodyBatteryLow: number | null;
  avgStress: number | null;
  hrvStatus: number | null;
  restingHr: number | null;
  steps: number | null;
}

// ─── Coach-Feedback Logik ───────────────────────────────

function coachSleep(s: SleepEntry | undefined) {
  if (!s) return { rating: "–", color: "text-neutral-500", tips: ["Keine Schlafdaten vorhanden."] };
  const hours = s.durationMin / 60;
  const deep = s.deepMin || 0;
  const rem = s.remMin || 0;
  const awake = s.awakeMin || 0;
  const deepPct = s.durationMin > 0 ? (deep / s.durationMin) * 100 : 0;
  const remPct = s.durationMin > 0 ? (rem / s.durationMin) * 100 : 0;

  const tips: string[] = [];

  // Dauer
  if (hours >= 7 && hours <= 9) tips.push(`Schlafdauer ${hours.toFixed(1)}h – im optimalen Bereich (7-9h).`);
  else if (hours < 7) tips.push(`Nur ${hours.toFixed(1)}h Schlaf – zu wenig. Ziel: 7-9h. Schlafenszeit vorverlegen.`);
  else tips.push(`${hours.toFixed(1)}h Schlaf – etwas lang. Kann auf schlechte Schlafqualitaet hindeuten.`);

  // Tiefschlaf (ideal: 15-25% = 1-2h)
  if (deepPct >= 15 && deepPct <= 25) tips.push(`Tiefschlaf ${deep}min (${deepPct.toFixed(0)}%) – sehr gut. Koerperliche Erholung laeuft optimal.`);
  else if (deepPct < 15) tips.push(`Tiefschlaf nur ${deep}min (${deepPct.toFixed(0)}%) – zu wenig (Ziel: 15-25%). Tipp: Alkohol meiden, Raum kuehler halten.`);
  else tips.push(`Tiefschlaf ${deep}min (${deepPct.toFixed(0)}%) – ueberdurchschnittlich hoch, evtl. Erholungsbedarf nach Belastung.`);

  // REM (ideal: 20-25%)
  if (remPct >= 20 && remPct <= 25) tips.push(`REM-Schlaf ${rem}min (${remPct.toFixed(0)}%) – optimal. Gut fuer Gedaechtnis und emotionale Verarbeitung.`);
  else if (remPct < 20) tips.push(`REM-Schlaf nur ${rem}min (${remPct.toFixed(0)}%) – unter Ziel (20-25%). Tipp: Regelmaessige Schlafenszeiten, weniger Bildschirm vor dem Schlaf.`);
  else tips.push(`REM-Schlaf ${rem}min (${remPct.toFixed(0)}%) – ueberdurchschnittlich.`);

  // Wachzeit
  if (awake > 30) tips.push(`${awake}min wach – erhoehte Wachphasen. Moegliche Ursachen: Stress, Laerm, zu warm.`);

  const rating = hours >= 7 && deepPct >= 15 && remPct >= 18 ? "Gut" : hours >= 6 && deepPct >= 10 ? "OK" : "Verbesserungswuerdig";
  const color = rating === "Gut" ? "text-green-400" : rating === "OK" ? "text-yellow-400" : "text-red-400";

  return { rating, color, tips };
}

function coachBodyBattery(d: GarminDaily | undefined) {
  if (!d?.bodyBatteryHigh) return { rating: "–", color: "text-neutral-500", tips: ["Keine Body-Battery-Daten."] };
  const high = d.bodyBatteryHigh;
  const low = d.bodyBatteryLow || 0;
  const range = high - low;
  const tips: string[] = [];

  if (high >= 75) tips.push(`Body Battery Hoch ${high} – gut erholt. Du hast genuegend Reserven fuer intensive Aktivitaet.`);
  else if (high >= 50) tips.push(`Body Battery Hoch ${high} – maessig. Moderate Belastung moeglich, aber kein Maximaleinsatz.`);
  else tips.push(`Body Battery Hoch nur ${high} – niedrig. Erholung priorisieren, leichte Aktivitaet bevorzugen.`);

  if (low <= 10) tips.push(`Body Battery Tief ${low} – stark entladen. Das deutet auf hohe Belastung oder schlechten Schlaf hin.`);
  else if (low <= 25) tips.push(`Body Battery Tief ${low} – normal. Gute Balance zwischen Belastung und Erholung.`);
  else tips.push(`Body Battery Tief ${low} – kaum entladen. Du warst heute wenig aktiv.`);

  if (range < 30) tips.push(`Geringe Schwankung (${range} Punkte) – wenig Belastung oder wenig Erholung.`);

  const rating = high >= 75 ? "Gut" : high >= 50 ? "OK" : "Niedrig";
  const color = rating === "Gut" ? "text-green-400" : rating === "OK" ? "text-yellow-400" : "text-red-400";
  return { rating, color, tips };
}

function coachHrv(d: GarminDaily | undefined, dailyHistory: GarminDaily[]) {
  if (!d?.hrvStatus) return { rating: "–", color: "text-neutral-500", tips: ["Keine HRV-Daten."] };
  const hrv = d.hrvStatus;
  const rhr = d.restingHr;
  const tips: string[] = [];

  // HRV Interpretation (altersabhaengig, aber grobe Richtwerte)
  if (hrv >= 50) tips.push(`HRV ${Math.round(hrv)}ms – ueberdurchschnittlich. Dein autonomes Nervensystem ist gut erholt.`);
  else if (hrv >= 30) tips.push(`HRV ${Math.round(hrv)}ms – normaler Bereich. Solide Erholung.`);
  else tips.push(`HRV ${Math.round(hrv)}ms – unterdurchschnittlich. Moegliche Ursachen: Stress, Alkohol, schlechter Schlaf, Uebertraining.`);

  // HRV Trend (vergleiche mit letzter Woche)
  const recent = dailyHistory.filter(d => d.hrvStatus).slice(0, 7);
  if (recent.length >= 3) {
    const avg = recent.reduce((sum, d) => sum + (d.hrvStatus || 0), 0) / recent.length;
    const diff = hrv - avg;
    if (diff > 5) tips.push(`HRV liegt ${Math.round(diff)}ms ueber deinem 7-Tage-Schnitt (${Math.round(avg)}ms) – positiver Trend.`);
    else if (diff < -5) tips.push(`HRV liegt ${Math.round(Math.abs(diff))}ms unter deinem 7-Tage-Schnitt (${Math.round(avg)}ms) – Erholung beobachten.`);
    else tips.push(`HRV stabil im Bereich deines 7-Tage-Schnitts (${Math.round(avg)}ms).`);
  }

  // Ruhe-HF
  if (rhr) {
    if (rhr <= 55) tips.push(`Ruhe-HF ${rhr} bpm – sehr gut. Zeichen fuer gute kardiovaskulaere Fitness.`);
    else if (rhr <= 65) tips.push(`Ruhe-HF ${rhr} bpm – normal bis gut.`);
    else tips.push(`Ruhe-HF ${rhr} bpm – leicht erhoeht. Kann durch Stress, Koffein oder mangelnde Erholung bedingt sein.`);
  }

  const rating = hrv >= 50 ? "Gut" : hrv >= 30 ? "OK" : "Niedrig";
  const color = rating === "Gut" ? "text-green-400" : rating === "OK" ? "text-yellow-400" : "text-red-400";
  return { rating, color, tips };
}

function coachStress(d: GarminDaily | undefined) {
  if (!d?.avgStress) return null;
  const stress = d.avgStress;
  if (stress <= 25) return { text: `Stress ${stress} – sehr niedrig. Top Erholung.`, color: "text-green-400" };
  if (stress <= 40) return { text: `Stress ${stress} – normal. Gute Balance.`, color: "text-yellow-400" };
  if (stress <= 55) return { text: `Stress ${stress} – maessig erhoeht. Entspannungsphasen einplanen.`, color: "text-orange-400" };
  return { text: `Stress ${stress} – hoch. Aktive Erholung wichtig (Spaziergang, Meditation, frueher schlafen).`, color: "text-red-400" };
}

// ─── Komponente ─────────────────────────────────────────

function CoachCard({ title, rating, color, tips }: { title: string; rating: string; color: string; tips: string[] }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">{title}</h3>
        <span className={`text-sm font-bold ${color}`}>{rating}</span>
      </div>
      <ul className="space-y-2">
        {tips.map((tip, i) => (
          <li key={i} className="text-sm text-neutral-300 leading-relaxed">{tip}</li>
        ))}
      </ul>
    </div>
  );
}

export default function RecoveryPage() {
  const [sleep, setSleep] = useState<SleepEntry[]>([]);
  const [daily, setDaily] = useState<GarminDaily[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/fitness/garmin/sleep?days=14").then((r) => r.json()),
      fetch("/api/fitness/garmin/daily?days=14").then((r) => r.json()),
    ])
      .then(([s, d]) => { setSleep(s); setDaily(d); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-neutral-500">Laden...</p></div>;

  const latestSleep = sleep[0];
  const latestDaily = daily[0];

  const sleepCoach = coachSleep(latestSleep);
  const batteryCoach = coachBodyBattery(latestDaily);
  const hrvCoach = coachHrv(latestDaily, daily);
  const stressCoach = coachStress(latestDaily);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Recovery</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
          <p className="text-xs text-neutral-400">Body Battery</p>
          <p className="text-2xl font-bold text-green-500">{latestDaily?.bodyBatteryHigh ?? "–"}</p>
          <p className="text-xs text-neutral-500">Tief: {latestDaily?.bodyBatteryLow ?? "–"}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
          <p className="text-xs text-neutral-400">Schlaf</p>
          <p className="text-2xl font-bold">{latestSleep ? `${Math.floor(latestSleep.durationMin / 60)}h${latestSleep.durationMin % 60}m` : "–"}</p>
          <p className="text-xs text-neutral-500">Tief: {latestSleep?.deepMin ?? "–"}m | REM: {latestSleep?.remMin ?? "–"}m</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
          <p className="text-xs text-neutral-400">HRV</p>
          <p className="text-2xl font-bold">{latestDaily?.hrvStatus ? Math.round(latestDaily.hrvStatus) : "–"}<span className="text-sm font-normal text-neutral-500"> ms</span></p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
          <p className="text-xs text-neutral-400">Ruhe-HF</p>
          <p className="text-2xl font-bold">{latestDaily?.restingHr ?? "–"}<span className="text-sm font-normal text-neutral-500"> bpm</span></p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-center">
          <p className="text-xs text-neutral-400">Stress</p>
          <p className="text-2xl font-bold">{latestDaily?.avgStress ?? "–"}</p>
          <p className="text-xs text-neutral-500">Schritte: {latestDaily?.steps?.toLocaleString("de-CH") ?? "–"}</p>
        </div>
      </div>

      {/* Coach Feedback */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Coach-Analyse</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <CoachCard title="Schlaf" rating={sleepCoach.rating} color={sleepCoach.color} tips={sleepCoach.tips} />
          <CoachCard title="Body Battery" rating={batteryCoach.rating} color={batteryCoach.color} tips={batteryCoach.tips} />
          <CoachCard title="HRV & Herzfrequenz" rating={hrvCoach.rating} color={hrvCoach.color} tips={hrvCoach.tips} />
        </div>
        {stressCoach && (
          <div className="mt-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <span className={`text-sm ${stressCoach.color}`}>{stressCoach.text}</span>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Schlafphasen (14 Tage)</h2>
          <SleepChart data={sleep} />
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Body Battery (14 Tage)</h2>
          <BodyBatteryChart data={daily} />
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">HRV & Ruhe-Herzfrequenz (14 Tage)</h2>
        <HrvChart data={daily} />
      </div>
    </div>
  );
}
