import { NextRequest, NextResponse } from "next/server";

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

export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get("auth")?.value;
  const secret = process.env.AUTH_SECRET || "fallback";

  if (!cookie || !(await verifyToken(cookie, secret))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/project/:path*"],
};
