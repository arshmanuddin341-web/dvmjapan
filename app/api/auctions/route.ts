import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "36")));

    const listings = await prisma.auctionListing.findMany({
      orderBy: { date: "desc" },
      take: limit,
    });

    return NextResponse.json(listings);
  } catch (e) {
    console.error("Auctions list error:", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/** Create auction listing from a vehicle (MVP: uses our Vehicle + Prisma AuctionListing) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const vehicleId = body.vehicleId ?? body.car ?? "";
    const title = String(body.title ?? "").trim();
    const startTime = body.startTime ?? body.start_time ?? "";
    const startingBid = body.startingBid ?? body.starting_bid;
    const startPrice = startingBid != null ? parseFloat(String(startingBid)) : 0;

    if (!title || startPrice < 0) {
      return NextResponse.json(
        { error: "Title and starting bid (≥ 0) are required" },
        { status: 400 }
      );
    }

    let make = String(body.make ?? "").trim();
    let model = String(body.model ?? "").trim();
    let year = body.year != null ? parseInt(String(body.year), 10) : 0;
    let mileage = body.mileage != null ? parseInt(String(body.mileage), 10) : 0;
    let engine = String(body.engine ?? "").trim();
    let image = Array.isArray(body.images) ? (body.images[0] ?? "") : String(body.image ?? "");

    if (vehicleId) {
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: String(vehicleId) },
      });
      if (vehicle) {
        make = vehicle.make;
        model = vehicle.model;
        year = vehicle.year;
        mileage = vehicle.mileage ?? 0;
        engine = vehicle.engineType ?? vehicle.engineSize ? `${vehicle.engineSize}` : "";
        const imgs = JSON.parse(vehicle.images || "[]");
        image = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : "";
      }
    }

    if (!make || !model || year < 1900) {
      return NextResponse.json(
        { error: "Provide vehicleId (existing vehicle) or make, model, year" },
        { status: 400 }
      );
    }

    const dateStr = startTime ? new Date(startTime).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
    const lot = body.lot ?? `LOT-${Date.now()}-${make}-${model}`.replace(/\s+/g, "-");

    const listing = await prisma.auctionListing.create({
      data: {
        lot,
        make,
        model,
        year,
        auction: String(body.auction ?? "Japan"),
        date: dateStr,
        mileage: mileage || 0,
        engine: engine || "—",
        startPrice,
        soldPrice: 0,
        image: image || "",
        chassis: body.chassis ?? null,
        grade: body.grade ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      id: listing.id,
      lot: listing.lot,
    });
  } catch (e) {
    console.error("Auction create error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
