/**
 * Japan Auction Listings API
 * GET /api/auctions/japan/listings
 * Real data when JAPAN_AUCTION_API_URL or JAPAN_AUCTION_AVTOJP_CODE is set; else DB or demo.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchRealJapanListings } from "@/lib/japan-auction-api";
import { auctionListingsDemo } from "@/data/live-auction-demo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache" };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));

  const real = await fetchRealJapanListings(limit);
  if (real && real.length > 0) {
    return NextResponse.json(real, { headers: NO_CACHE_HEADERS });
  }

  try {
    const { prisma } = await import("@/lib/db");
    const rows = await prisma.auctionListing.findMany({
      orderBy: { date: "desc" },
      take: limit,
    });

    if (rows.length > 0) {
      const listings = rows.map((r) => ({
        id: r.id,
        lot: r.lot,
        make: r.make,
        model: r.model,
        year: r.year,
        auction: r.auction,
        date: r.date,
        mileage: r.mileage,
        engine: r.engine,
        startPrice: r.startPrice,
        soldPrice: r.soldPrice,
        image: r.image,
        chassis: r.chassis ?? undefined,
        grade: r.grade ?? undefined,
        status: r.status,
        endTime: r.endTime?.toISOString?.(),
      }));
      return NextResponse.json(listings, { headers: NO_CACHE_HEADERS });
    }
  } catch {
    // use demo when DB not available
  }
  return NextResponse.json(auctionListingsDemo, { headers: NO_CACHE_HEADERS });
}
