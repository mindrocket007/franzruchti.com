import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(req: Request) {
  const { password } = await req.json();
  const hash = process.env.PASSWORD_HASH;

  if (!hash || !password) {
    return NextResponse.json({ error: "Fehler" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const secret = process.env.AUTH_SECRET || "fallback";
  const hmac = crypto.createHmac("sha256", secret).update(token).digest("hex");
  const cookieValue = `${token}.${hmac}`;

  const cookieStore = await cookies();
  cookieStore.set("auth", cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage
  });

  return NextResponse.json({ ok: true });
}
