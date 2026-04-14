import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const days = parseInt(req.nextUrl.searchParams.get("days") || "90");
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  const startStr = startDate.toISOString().split("T")[0];

  const entries = await prisma.weightEntry.findMany({
    where: { userId: user.id, date: { gte: startStr } },
    orderBy: { date: "desc" },
    select: { date: true, weightKg: true, source: true },
  });

  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, weightKg, source } = await req.json();

  const entry = await prisma.weightEntry.upsert({
    where: { userId_date_source: { userId: user.id, date, source: source || "manual" } },
    update: { weightKg },
    create: { userId: user.id, date, weightKg, source: source || "manual" },
  });

  return NextResponse.json(entry);
}
