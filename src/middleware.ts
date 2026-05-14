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
  const path = req.nextUrl.pathname;

  if (path.startsWith("/share/")) {
    const sharePassword = process.env.SHARE_PASSWORD;
    if (!sharePassword) {
      return new NextResponse("Share not configured", { status: 503 });
    }

    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Basic ")) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="SIZ-AG Share"',
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const encoded = auth.slice(6);
    let decoded = "";
    try {
      decoded = atob(encoded);
    } catch {
      return new NextResponse("Invalid credentials", { status: 401 });
    }
    const idx = decoded.indexOf(":");
    const password = idx >= 0 ? decoded.slice(idx + 1) : decoded;

    if (password !== sharePassword) {
      return new NextResponse("Invalid credentials", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="SIZ-AG Share"' },
      });
    }

    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "private, no-store");
    return response;
  }

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
  matcher: [
    "/dashboard/:path*",
    "/project/:path*",
    "/projects/:path*",
    "/fitness/:path*",
    "/share/:path*",
  ],
};
