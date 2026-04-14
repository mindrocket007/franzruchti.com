import { cookies } from "next/headers";
import { prisma } from "./prisma";

// Verify HMAC token (same logic as middleware.ts)
async function verifyToken(cookieValue: string, secret: string): Promise<boolean> {
  try {
    const parts = cookieValue.split(".");
    if (parts.length !== 2) return false;
    const [token, hmac] = parts;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(token));
    const expected = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return hmac === expected;
  } catch {
    return false;
  }
}

export async function getUser() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("auth")?.value;
  const secret = process.env.AUTH_SECRET || "fallback";

  if (!cookie || !(await verifyToken(cookie, secret))) return null;

  // Single-user: return first user from DB
  const user = await prisma.user.findFirst({
    select: { id: true, email: true, name: true },
  });

  return user;
}
