/**
 * POST /api/auctions/[id]/settle
 * Admin-only: run winner selection if auction is ended and not yet settled.
 * Use when auto-settle (on PATCH status=ended) did not run or failed.
 */

import { NextRequest, NextResponse } from "next/server";
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

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAuthFromRequest(_req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: auctionId } = await params;
    const result = await settleAuctionIfNeeded(auctionId);
    if (result == null) {
      return NextResponse.json(
        { error: "Auction not found or not ended" },
        { status: 400 }
      );
    }

    // Broadcast so clients in room update immediately
    await broadcast(auctionId, "auction:ended", {
      status: "ended",
      finalPrice: result.finalPrice,
      winner: result.winnerId
        ? { id: result.winnerId, name: result.winnerName ?? "Winner" }
        : null,
      noWinner: result.winnerId == null,
      bidCount: result.bidCount,
    });

    return NextResponse.json({
      success: true,
      settled: result.settled,
      finalPrice: result.finalPrice,
      winner: result.winnerId
        ? { id: result.winnerId, name: result.winnerName }
        : null,
      bidCount: result.bidCount,
    });
  } catch (e) {
    console.error("Settle error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
