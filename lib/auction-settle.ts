/**
 * Auction close & winner selection (no payments).
 * Deterministic: highest bid by amount, then earliest createdAt wins.
 * Call when status becomes "ended"; safe to call again if already settled (no-op).
 */

import { prisma } from "@/lib/db";

export interface SettleResult {
  settled: boolean;
  winnerId: string | null;
  winnerName: string | null;
  finalPrice: number | null;
  bidCount: number;
}

/**
 * Settle auction: set winningBidId, winnerUserId, finalPrice.
 * Only runs when listing.status === "ended" and winningBidId is null.
 * Returns public-safe winner info for broadcast/API.
 */
export async function settleAuctionIfNeeded(auctionId: string): Promise<SettleResult | null> {
  const listing = await prisma.auctionListing.findUnique({
    where: { id: auctionId },
    include: { bids: true },
  });
  if (!listing) return null;
  if (listing.status !== "ended") return null;
  const bidCount = listing.bids.length;
  // Already settled: return current result without re-running
  if (listing.winningBidId != null) {
    const winner = listing.winnerUserId
      ? await prisma.user.findUnique({
          where: { id: listing.winnerUserId },
          select: { name: true },
        })
      : null;
    return {
      settled: false,
      winnerId: listing.winnerUserId ?? null,
      winnerName: winner?.name ?? null,
      finalPrice: listing.finalPrice ?? null,
      bidCount,
    };
  }

  // Deterministic winner: highest amount, then first at that amount (earliest createdAt)
  const sortedBids = listing.bids
    .slice()
    .sort((a, b) => {
      if (b.amount !== a.amount) return b.amount - a.amount;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  const winningBid = sortedBids[0] ?? null;

  if (!winningBid) {
    await prisma.auctionListing.update({
      where: { id: auctionId },
      data: { winningBidId: null, winnerUserId: null, finalPrice: null },
    });
    return { settled: true, winnerId: null, winnerName: null, finalPrice: null, bidCount: 0 };
  }

  await prisma.auctionListing.update({
    where: { id: auctionId },
    data: {
      winningBidId: winningBid.id,
      winnerUserId: winningBid.userId,
      finalPrice: winningBid.amount,
    },
  });

  const winnerUser = await prisma.user.findUnique({
    where: { id: winningBid.userId },
    select: { name: true },
  });

  return {
    settled: true,
    winnerId: winningBid.userId,
    winnerName: winnerUser?.name ?? null,
    finalPrice: winningBid.amount,
    bidCount: listing.bids.length,
  };
}
