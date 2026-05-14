import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "projects",
    "siz-ag",
    "digitalswitzerland_Partnerschaft.html"
  );

  try {
    const html = await fs.readFile(filePath, "utf-8");
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse("File not found", { status: 404 });
  }
}
