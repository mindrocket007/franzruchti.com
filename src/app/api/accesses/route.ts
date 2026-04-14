import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";

export async function GET() {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const raw = process.env.ACCESSES_JSON;
  if (!raw) return NextResponse.json({ data: {} });

  try {
    return NextResponse.json({ data: JSON.parse(raw) });
  } catch {
    return NextResponse.json({ error: "Invalid ACCESSES_JSON" }, { status: 500 });
  }
}
