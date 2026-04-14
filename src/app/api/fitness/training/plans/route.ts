import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plans = await prisma.trainingPlan.findMany({
    where: { userId: user.id },
    include: {
      routines: {
        include: { exercises: true },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(plans);
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, description, routines } = await req.json();

  const plan = await prisma.trainingPlan.create({
    data: {
      userId: user.id,
      name,
      description,
      routines: routines ? {
        create: routines.map((r: { name: string; dayOfWeek?: number; sortOrder: number; exercises: { exerciseName: string; sets: number; repsMin: number; repsMax?: number; weightKg?: number; restSec?: number; notes?: string; sortOrder: number }[] }) => ({
          name: r.name,
          dayOfWeek: r.dayOfWeek,
          sortOrder: r.sortOrder,
          exercises: {
            create: r.exercises.map((e) => ({
              exerciseName: e.exerciseName,
              sets: e.sets,
              repsMin: e.repsMin,
              repsMax: e.repsMax,
              weightKg: e.weightKg,
              restSec: e.restSec,
              notes: e.notes,
              sortOrder: e.sortOrder,
            })),
          },
        })),
      } : undefined,
    },
    include: { routines: { include: { exercises: true } } },
  });

  return NextResponse.json(plan);
}
