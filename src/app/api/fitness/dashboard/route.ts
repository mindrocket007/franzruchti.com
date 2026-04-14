import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const today = new Date().toISOString().split("T")[0];

  const [nutrition, weight, lastWorkout, garminDaily, sleep, todayActivities] = await Promise.all([
    prisma.nutritionDay.findUnique({
      where: { userId_date: { userId: user.id, date: today } },
      select: { calories: true, fat: true, carbs: true, protein: true },
    }),
    prisma.weightEntry.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      select: { weightKg: true, date: true },
    }),
    prisma.garminActivity.findFirst({
      where: { userId: user.id },
      orderBy: { startTime: "desc" },
      select: { activityName: true, durationSec: true, startTime: true },
    }),
    prisma.garminDaily.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      select: { bodyBatteryHigh: true, bodyBatteryLow: true, steps: true, avgStress: true },
    }),
    prisma.sleepEntry.findFirst({
      where: { userId: user.id },
      orderBy: { date: "desc" },
      select: { sleepScore: true, durationMin: true },
    }),
    prisma.garminActivity.findMany({
      where: { userId: user.id, startTime: { startsWith: today } },
      select: { caloriesBurned: true },
    }),
  ]);

  const burnedCalories = todayActivities.reduce((sum, a) => sum + (a.caloriesBurned || 0), 0);

  return NextResponse.json({ nutrition, weight, lastWorkout, garminDaily, sleep, burnedCalories });
}
