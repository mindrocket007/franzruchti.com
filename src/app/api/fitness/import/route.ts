import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as string;

  if (!file) return NextResponse.json({ error: "Keine Datei" }, { status: 400 });

  const text = await file.text();
  let imported = 0;

  try {
    if (file.name.endsWith(".json")) {
      const data = JSON.parse(text);
      imported = await importJson(user.id, type, data);
    } else if (file.name.endsWith(".csv")) {
      imported = await importCsv(user.id, type, text);
    } else {
      return NextResponse.json({ error: "Nur JSON und CSV werden unterstuetzt" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }

  return NextResponse.json({ success: true, imported });
}

async function importJson(userId: string, type: string, data: unknown) {
  let count = 0;
  const items = Array.isArray(data) ? data : [data];

  if (type === "garmin-activities") {
    for (const item of items) {
      const actId = item.activityId?.toString() || item.garminActivityId?.toString();
      if (!actId) continue;
      try {
        await prisma.garminActivity.upsert({
          where: { garminActivityId: actId },
          update: {},
          create: {
            userId,
            garminActivityId: actId,
            activityType: item.activityType || item.sportType || "unknown",
            activityName: item.activityName || item.name,
            startTime: item.startTimeLocal || item.startTime || new Date().toISOString(),
            durationSec: Math.round(item.duration || item.durationSec || 0),
            distanceM: item.distance || item.distanceM,
            avgHr: item.averageHR || item.avgHr,
            maxHr: item.maxHR || item.maxHr,
            caloriesBurned: item.calories || item.caloriesBurned,
            trainingEffect: item.aerobicTrainingEffect || item.trainingEffect,
            vo2max: item.vO2MaxValue || item.vo2max,
            rawJson: JSON.stringify(item),
          },
        });
        count++;
      } catch { /* duplicate, skip */ }
    }
  } else if (type === "garmin-daily") {
    for (const item of items) {
      const date = (item.calendarDate || item.date)?.split("T")[0];
      if (!date) continue;

      // Daily summary
      await prisma.garminDaily.upsert({
        where: { date },
        update: {
          steps: item.totalSteps || item.steps,
          bodyBatteryHigh: item.bodyBatteryChargedValue || item.bodyBatteryHigh,
          bodyBatteryLow: item.bodyBatteryDrainedValue || item.bodyBatteryLow,
          avgStress: item.averageStressLevel || item.avgStress,
          restingHr: item.currentDayRestingHeartRate || item.restingHr,
        },
        create: {
          userId,
          date,
          steps: item.totalSteps || item.steps,
          bodyBatteryHigh: item.bodyBatteryChargedValue || item.bodyBatteryHigh,
          bodyBatteryLow: item.bodyBatteryDrainedValue || item.bodyBatteryLow,
          avgStress: item.averageStressLevel || item.avgStress,
          restingHr: item.currentDayRestingHeartRate || item.restingHr,
        },
      });
      count++;

      // Sleep data if present
      if (item.sleepTimeSeconds || item.durationMin) {
        await prisma.sleepEntry.upsert({
          where: { userId_date: { userId, date } },
          update: {
            sleepScore: item.overallScore || item.sleepScore,
            durationMin: item.durationMin || Math.round((item.sleepTimeSeconds || 0) / 60),
            deepMin: item.deepMin || Math.round((item.deepSleepSeconds || 0) / 60),
            lightMin: item.lightMin || Math.round((item.lightSleepSeconds || 0) / 60),
            remMin: item.remMin || Math.round((item.remSleepSeconds || 0) / 60),
            awakeMin: item.awakeMin || Math.round((item.awakeSleepSeconds || 0) / 60),
          },
          create: {
            userId,
            date,
            sleepScore: item.overallScore || item.sleepScore,
            durationMin: item.durationMin || Math.round((item.sleepTimeSeconds || 0) / 60),
            deepMin: item.deepMin || Math.round((item.deepSleepSeconds || 0) / 60),
            lightMin: item.lightMin || Math.round((item.lightSleepSeconds || 0) / 60),
            remMin: item.remMin || Math.round((item.remSleepSeconds || 0) / 60),
            awakeMin: item.awakeMin || Math.round((item.awakeSleepSeconds || 0) / 60),
          },
        });
      }
    }
  } else if (type === "weight") {
    for (const item of items) {
      const date = (item.date || item.calendarDate)?.split("T")[0];
      const weightKg = item.weightKg || item.weight;
      if (!date || !weightKg) continue;
      await prisma.weightEntry.upsert({
        where: { userId_date_source: { userId, date, source: "import" } },
        update: { weightKg: parseFloat(weightKg) },
        create: { userId, date, weightKg: parseFloat(weightKg), source: "import", fatPct: item.fatPct || item.bodyFat },
      });
      count++;
    }
  }

  return count;
}

async function importCsv(userId: string, type: string, text: string) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return 0;

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  let count = 0;

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx]; });

    if (type === "weight") {
      const date = row.date || row.datum;
      const weightKg = row.weightkg || row.gewicht || row.weight;
      if (!date || !weightKg) continue;
      await prisma.weightEntry.upsert({
        where: { userId_date_source: { userId, date, source: "import" } },
        update: { weightKg: parseFloat(weightKg) },
        create: { userId, date, weightKg: parseFloat(weightKg), source: "import" },
      });
      count++;
    }
  }

  return count;
}
