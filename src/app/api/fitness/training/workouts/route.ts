import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");

  const workouts = await prisma.workoutLog.findMany({
    where: { userId: user.id },
    include: {
      routine: { select: { name: true } },
      sets: { orderBy: [{ exerciseName: "asc" }, { setNumber: "asc" }] },
    },
    orderBy: { date: "desc" },
    take: limit,
  });

  return NextResponse.json(workouts);
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { routineId, date, durationMin, notes, sets } = await req.json();

  const workout = await prisma.workoutLog.create({
    data: {
      userId: user.id,
      routineId,
      date,
      durationMin,
      notes,
      sets: sets ? {
        create: sets.map((s: { exerciseName: string; setNumber: number; reps: number; weightKg?: number; rpe?: number }) => ({
          exerciseName: s.exerciseName,
          setNumber: s.setNumber,
          reps: s.reps,
          weightKg: s.weightKg,
          rpe: s.rpe,
        })),
      } : undefined,
    },
    include: { sets: true, routine: { select: { name: true } } },
  });

  return NextResponse.json(workout);
}
