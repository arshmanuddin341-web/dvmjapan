/**
 * POST /api/japan-auctions/sync
 * Fetches from configured Japan auction source, normalizes, upserts vehicles to Prisma.
 * Admin only. Logs errors; does not crash.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fetchListingsFromSource } from "@/lib/japanAuctions/fetchFromSource";
import { normalizeAuctionVehicle, type NormalizedVehicle } from "@/lib/japanAuctions/normalize";

export const dynamic = "force-dynamic";

function toPrismaVehicle(v: NormalizedVehicle) {
  return {
    stockId: v.stockId,
    make: v.make,
    model: v.model,
    year: v.year,
    price: v.price,
    mileage: v.mileage,
    fuelType: v.fuelType,
    transmission: v.transmission,
    bodyType: v.bodyType,
    color: v.color,
    location: v.location,
    condition: v.condition,
    auctionGrade: v.auctionGrade,
    description: v.description,
    images: JSON.stringify(v.images),
    features: JSON.stringify([]),
    auctionHouse: v.auctionHouse,
    lotNumber: v.lotNumber,
    auctionDate: v.auctionDate,
    chassis: v.chassis,
    source: v.source,
  };
}

export async function POST(req: NextRequest) {
  try {
    const token = getAuthFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, sourceName, error: fetchError } = await fetchListingsFromSource();

    if (fetchError) {
      await prisma.japanSyncLog.create({
        data: {
          sourceName: sourceName || "Japan Auction",
          importedCount: 0,
          error: fetchError,
        },
      }).catch(() => {});
      return NextResponse.json({
        success: false,
        sourceName: sourceName || "Japan Auction",
        imported: 0,
        error: fetchError,
      });
    }

    const sourceId = process.env.JAPAN_AUCTION_SOURCE || "japan_sync";
    const normalized = items
      .map((raw) => normalizeAuctionVehicle(raw, sourceId))
      .filter((v): v is NormalizedVehicle => v != null);

    let imported = 0;
    for (const v of normalized) {
      try {
        const data = toPrismaVehicle(v);
        await prisma.vehicle.upsert({
          where: { stockId: v.stockId },
          create: {
            ...data,
            specifications: null,
            status: "available",
            featured: false,
          },
          update: {
            make: data.make,
            model: data.model,
            year: data.year,
            price: data.price,
            mileage: data.mileage,
            fuelType: data.fuelType,
            transmission: data.transmission,
            bodyType: data.bodyType,
            color: data.color,
            location: data.location,
            condition: data.condition,
            auctionGrade: data.auctionGrade,
            description: data.description,
            images: data.images,
            auctionHouse: data.auctionHouse,
            lotNumber: data.lotNumber,
            auctionDate: data.auctionDate,
            chassis: data.chassis,
            source: data.source,
          },
        });
        imported += 1;
      } catch (e) {
        console.error("Japan sync upsert error for", v.stockId, e);
      }
    }

    await prisma.japanSyncLog.create({
      data: {
        sourceName: sourceName || "Japan Auction",
        importedCount: imported,
      },
    }).catch(() => {});

    return NextResponse.json({
      success: true,
      sourceName: sourceName || "Japan Auction",
      imported,
      totalFetched: normalized.length,
    });
  } catch (e) {
    console.error("Japan auctions sync error:", e);
    return NextResponse.json(
      { success: false, error: "Sync failed" },
      { status: 500 }
    );
  }
}
