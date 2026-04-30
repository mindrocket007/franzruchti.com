import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";

interface Params {
  params: { slug: string };
}

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = params;
  const row = await prisma.projectData.findUnique({
    where: { userId_slug: { userId: user.id, slug } },
  });

  if (!row) {
    return NextResponse.json({ exists: false, notes: "", goals: [], tasks: [], accesses: [] });
  }

  return NextResponse.json({
    exists: true,
    notes: row.notes,
    goals: JSON.parse(row.goals || "[]"),
    tasks: JSON.parse(row.tasks || "[]"),
    accesses: JSON.parse(row.accesses || "[]"),
    updatedAt: row.updatedAt,
  });
}

export async function PUT(req: NextRequest, { params }: Params) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = params;
  const body = await req.json();

  const notes = typeof body.notes === "string" ? body.notes : "";
  const goals = JSON.stringify(Array.isArray(body.goals) ? body.goals : []);
  const tasks = JSON.stringify(Array.isArray(body.tasks) ? body.tasks : []);
  const accesses = JSON.stringify(Array.isArray(body.accesses) ? body.accesses : []);

  const row = await prisma.projectData.upsert({
    where: { userId_slug: { userId: user.id, slug } },
    update: { notes, goals, tasks, accesses },
    create: { userId: user.id, slug, notes, goals, tasks, accesses },
  });

  return NextResponse.json({ ok: true, updatedAt: row.updatedAt });
}
