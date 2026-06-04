/**
 * GET /api/auctions/[id]/result
 * Public: auction result (status, finalPrice, winner public fields, bidCount).
 * No payments; winner is display-only.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await prisma.auctionListing.findUnique({
      where: { id },
      select: {
        status: true,
        finalPrice: true,
        winningBidId: true,
        winnerUserId: true,
        winningBid: {
          include: { user: { select: { id: true, name: true } } },
        },
        _count: { select: { bids: true } },
      },
    });
    if (!listing) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }
    const winner =
      listing.winningBid?.user != null
        ? { id: listing.winningBid.user.id, name: listing.winningBid.user.name ?? "Winner" }
        : null;
    return NextResponse.json({
      status: listing.status ?? "draft",
      finalPrice: listing.finalPrice ?? null,
      winner,
      bidCount: listing._count.bids,
    });
  } catch (e) {
    console.error("Auction result error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
