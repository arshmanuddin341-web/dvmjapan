import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Slugs used in Explore Global Stock (CountryCardsSection) */
const GLOBAL_STOCK_SLUGS = [
  "uk",
  "zambia",
  "zimbabwe",
  "tanzania",
  "kenya",
  "ireland",
  "jamaica",
] as const;

export async function GET() {
  try {
    const counts = await prisma.vehicle.groupBy({
      by: ["destinationSlug"],
      where: {
        destinationSlug: { not: null },
        status: "available",
      },
      _count: { id: true },
    });

    const map: Record<string, number> = {};
    for (const slug of GLOBAL_STOCK_SLUGS) {
      map[slug] = 0;
    }
    for (const row of counts) {
      const slug = row.destinationSlug?.toLowerCase();
      if (slug && slug in map) {
        map[slug] = row._count.id;
      }
    }

    return NextResponse.json(map);
  } catch (e) {
    console.error("Destinations counts error:", e);
    // Fail-soft: return empty map so frontend can fall back to static counts
    const empty: Record<string, number> = {};
    for (const slug of GLOBAL_STOCK_SLUGS) {
      empty[slug] = 0;
    }
    return NextResponse.json(empty);
  }
}
