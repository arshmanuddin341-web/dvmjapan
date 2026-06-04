import { NextResponse } from "next/server";
import { siteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/db";

/** Read site config from DB; fallback to static default. No external backend. */
export async function GET() {
  try {
    const row = await prisma.content.findUnique({
      where: { key: "site_config" },
    });
    if (row?.value && typeof row.value === "object") {
      return NextResponse.json({ data: row.value });
    }
  } catch {
    // DB unavailable or no row
  }
  return NextResponse.json({ data: siteConfig });
}
