/**
 * Single auction: GET (public), POST bid (auth), PATCH status (admin).
 * Bids stored in Prisma. Real-time broadcast via backend Socket.io.
 * On status=ended, settle runs (winner selection) and auction:ended is broadcast.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { settleAuctionIfNeeded } from "@/lib/auction-settle";

const BROADCAST_SECRET = process.env.REALTIME_BROADCAST_SECRET || process.env.JWT_SECRET || "";
const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function broadcast(auctionId: string, event: string, payload: object) {
  if (!BROADCAST_SECRET) return;
  try {
    await fetch(`${BACKEND_URL}/api/realtime/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Broadcast-Secret": BROADCAST_SECRET,
      },
      body: JSON.stringify({ auctionId, event, payload }),
    });
  } catch {
    // Socket down; app continues
  }
}

/** GET /api/auctions/[id] - Public: single auction with latest bids */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await prisma.auctionListing.findUnique({
      where: { id },
      include: {
        bids: {
          orderBy: { createdAt: "desc" },
          take: 50,
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        winningBid: {
          include: { user: { select: { id: true, name: true } } },
        },
        _count: { select: { bids: true } },
      },
    });
    if (!listing) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }
    const highestBid = listing.bids[0]?.amount ?? listing.startPrice;
    const response: Record<string, unknown> = {
      id: listing.id,
      lot: listing.lot,
      make: listing.make,
      model: listing.model,
      year: listing.year,
      mileage: listing.mileage,
      engine: listing.engine,
      image: listing.image,
      chassis: listing.chassis,
      grade: listing.grade,
      startPrice: listing.startPrice,
      soldPrice: listing.soldPrice,
      status: listing.status ?? "draft",
      startTime: listing.startTime?.toISOString() ?? null,
      endTime: listing.endTime?.toISOString() ?? null,
      currentBid: highestBid,
      bids: listing.bids.map((b) => ({
        id: b.id,
        amount: b.amount,
        userId: b.userId,
        bidderName: b.user?.name ?? "Bidder",
        createdAt: b.createdAt.toISOString(),
      })),
    };
    // Post-auction result (public-safe: no email)
    if (listing.status === "ended") {
      response.result = {
        finalPrice: listing.finalPrice ?? null,
        winner: listing.winningBid
          ? { id: listing.winningBid.userId, name: listing.winningBid.user?.name ?? "Winner" }
          : null,
        bidCount: listing._count.bids,
      };
    }
    return NextResponse.json(response);
  } catch (e) {
    console.error("Auction get error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

/** POST /api/auctions/[id]/bid - Place bid (logged-in). No payments. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAuthFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload?.sub) {
      return NextResponse.json({ error: "Please log in to place a bid" }, { status: 401 });
    }

    const { id: auctionId } = await params;
    const body = await req.json().catch(() => ({}));
    const amount = typeof body.amount === "number" ? body.amount : parseFloat(String(body.amount ?? ""));

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid bid amount" }, { status: 400 });
    }

    const listing = await prisma.auctionListing.findUnique({
      where: { id: auctionId },
      include: { bids: { orderBy: { createdAt: "desc" }, take: 1 } },
    });
    if (!listing) {
      return NextResponse.json({ error: "Auction not found" }, { status: 404 });
    }

    const status = listing.status ?? "draft";
    if (status !== "active") {
      return NextResponse.json(
        { error: status === "ended" ? "Auction has ended" : "Auction is not active" },
        { status: 400 }
      );
    }

    const endTime = listing.endTime ? new Date(listing.endTime) : null;
    if (endTime && new Date() > endTime) {
      return NextResponse.json({ error: "Auction has ended" }, { status: 400 });
    }

    const currentMax = listing.bids[0]?.amount ?? listing.startPrice;
    if (amount <= currentMax) {
      return NextResponse.json(
        { error: `Bid must be higher than $${currentMax.toLocaleString()}` },
        { status: 400 }
      );
    }

    // Ensure user exists in Prisma (Bid has FK to User)
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 403 });
    }

    const bid = await prisma.bid.create({
      data: { auctionId, userId: user.id, amount },
      include: { user: { select: { id: true, name: true } } },
    });

    const payloadOut = {
      id: bid.id,
      amount: bid.amount,
      bidderId: bid.userId,
      bidderName: bid.user?.name ?? "Bidder",
      createdAt: bid.createdAt.toISOString(),
      auctionId,
      currentBid: bid.amount,
    };
    await broadcast(auctionId, "bid:new", payloadOut);

    return NextResponse.json({ success: true, bid: payloadOut });
  } catch (e) {
    console.error("Place bid error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

/** PATCH /api/auctions/[id]/status - Admin: start, pause, end */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAuthFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: auctionId } = await params;
    const body = await req.json().catch(() => ({}));
    const status = String(body.status ?? "").toLowerCase();
    if (!["active", "paused", "ended", "draft"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const data: { status: string; startTime?: Date; endTime?: Date } = { status };
    if (status === "active") {
      const now = new Date();
      data.startTime = now;
      const minutes = Number(body.endMinutes) || 60;
      data.endTime = new Date(now.getTime() + minutes * 60 * 1000);
    }
    if (status === "ended") {
      data.endTime = new Date();
    }

    const listing = await prisma.auctionListing.update({
      where: { id: auctionId },
      data,
    });

    await broadcast(auctionId, "auction:status", {
      status: listing.status,
      endTime: listing.endTime?.toISOString() ?? null,
      startTime: listing.startTime?.toISOString() ?? null,
    });

    // When ending: lock bidding (already enforced), settle winner, broadcast ended
    if (status === "ended") {
      const result = await settleAuctionIfNeeded(auctionId);
      if (result) {
        await broadcast(auctionId, "auction:ended", {
          status: "ended",
          finalPrice: result.finalPrice,
          winner: result.winnerId
            ? { id: result.winnerId, name: result.winnerName ?? "Winner" }
            : null,
          noWinner: result.winnerId == null,
          bidCount: result.bidCount,
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: listing.status,
      endTime: listing.endTime?.toISOString() ?? null,
    });
  } catch (e) {
    console.error("Auction status update error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
