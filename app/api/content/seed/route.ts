import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";

const defaultHero = {
  eyebrow: "Premium Japanese Imports",
  title: "Drive Your Dream Car Home",
  subtitle: "From Japan's finest auctions to your driveway. Quality-checked, hassle-free.",
  ctaPrimary: "Browse Inventory",
  ctaSecondary: "How It Works",
};

/** POST /api/content/seed – admin only. Seed default site_config + hero (and optionally others) into Prisma when using PostgreSQL. */
export async function POST(req: NextRequest) {
  const token = getAuthFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const usePrisma =
    typeof process.env.DATABASE_URL === "string" &&
    (process.env.DATABASE_URL.startsWith("postgresql://") || process.env.DATABASE_URL.startsWith("postgres://"));

  if (!usePrisma) {
    return NextResponse.json(
      { success: false, message: "Seed requires PostgreSQL (DATABASE_URL). Use Site Settings to edit." },
      { status: 400 }
    );
  }

  try {
    await prisma.content.upsert({
      where: { key: "site_config" },
      create: { key: "site_config", value: JSON.stringify(siteConfig) },
      update: { value: JSON.stringify(siteConfig) },
    });
    await prisma.content.upsert({
      where: { key: "hero" },
      create: { key: "hero", value: JSON.stringify(defaultHero) },
      update: { value: JSON.stringify(defaultHero) },
    });
    return NextResponse.json({ success: true, message: "Defaults seeded. Reload Site Settings / Page Content." });
  } catch (e) {
    console.error("Content seed error:", e);
    return NextResponse.json({ success: false, message: "Failed to seed" }, { status: 500 });
  }
}
