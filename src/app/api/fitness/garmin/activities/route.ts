import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");

  const activities = await prisma.garminActivity.findMany({
    where: { userId: user.id },
    orderBy: { startTime: "desc" },
    take: limit,
    select: {
      id: true, activityType: true, activityName: true, startTime: true,
      durationSec: true, distanceM: true, avgHr: true, maxHr: true,
      caloriesBurned: true, trainingEffect: true,
    },
  });

  return NextResponse.json(activities);
}

export async function DELETE(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID fehlt" }, { status: 400 });

  await prisma.garminActivity.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ success: true });
}
