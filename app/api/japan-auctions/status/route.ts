/**
 * GET /api/japan-auctions/status
 * Returns last sync time, source name, and imported count. Admin only.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = getAuthFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const log = await prisma.japanSyncLog.findFirst({
      orderBy: { lastSyncAt: "desc" },
    });

    return NextResponse.json({
      lastSyncAt: log?.lastSyncAt?.toISOString() ?? null,
      sourceName: log?.sourceName ?? null,
      importedCount: log?.importedCount ?? 0,
      error: log?.error ?? null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Japan auctions status error:", e);
    // If sync log table/client not ready, return empty status so admin page still loads
    if (
      msg.includes("japanSyncLog") ||
      msg.includes("JapanSyncLog") ||
      msg.includes("does not exist") ||
      msg.includes("Unknown arg")
    ) {
      return NextResponse.json({
        lastSyncAt: null,
        sourceName: null,
        importedCount: 0,
        error: null,
      });
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
