import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import type { Prisma } from "@prisma/client";
import { syncToDVM } from "@/lib/sync";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function buildWhere(searchParams: URLSearchParams): Prisma.VehicleWhereInput {
  const where: Prisma.VehicleWhereInput = {};
  // Optional: const status = searchParams.get("status") || "available";
  // where.status = { in: ["available", "Available", "Sold", "sold"] }; 
  // For now, let's just show all to fix the empty display issue.
  const status = searchParams.get("status");
  if (status) where.status = status;

  const q = searchParams.get("q");
  if (q) {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length > 0) {
      where.AND = terms.map(term => ({
        OR: [
          { make: { contains: term, mode: "insensitive" } },
          { model: { contains: term, mode: "insensitive" } },
          { stockId: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
          ...(isNaN(parseInt(term, 10)) ? [] : [{ year: parseInt(term, 10) }]),
        ]
      }));
    }
  }
  const make = searchParams.get("make");
  if (make) where.make = { contains: make, mode: "insensitive" };
  const model = searchParams.get("model");
  if (model) where.model = { contains: model, mode: "insensitive" };
  const fuelType = searchParams.get("fuelType") || searchParams.get("fuel");
  if (fuelType) where.fuelType = fuelType;
  const transmission = searchParams.get("transmission");
  if (transmission) where.transmission = transmission;
  const bodyType = searchParams.get("bodyType") || searchParams.get("type");
  if (bodyType) where.bodyType = { contains: bodyType, mode: "insensitive" };
  const location = searchParams.get("location");
  if (location) where.location = location;
  const destination = searchParams.get("destination") || searchParams.get("destinationSlug");
  if (destination) where.destinationSlug = destination;
  const stockId = searchParams.get("stockId");
  if (stockId) where.stockId = { contains: stockId };
  const minYear = searchParams.get("minYear") || searchParams.get("yearFrom");
  const maxYear = searchParams.get("maxYear") || searchParams.get("yearTo");
  if (minYear || maxYear) {
    where.year = {};
    if (minYear) (where.year as { gte?: number }).gte = parseInt(minYear, 10);
    if (maxYear) (where.year as { lte?: number }).lte = parseInt(maxYear, 10);
  }
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as { gte?: number }).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as { lte?: number }).lte = parseFloat(maxPrice);
  }
  const minMileage = searchParams.get("minMileage");
  const maxMileage = searchParams.get("maxMileage");
  if (minMileage || maxMileage) {
    where.mileage = {};
    if (minMileage) (where.mileage as { gte?: number }).gte = parseInt(minMileage, 10);
    if (maxMileage) (where.mileage as { lte?: number }).lte = parseInt(maxMileage, 10);
  }
  return where;
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const pageRaw = parseInt(searchParams.get("page") || "1", 10);
    const limitRaw = parseInt(searchParams.get("limit") || "12", 10);
    const page = Number.isFinite(pageRaw) && pageRaw >= 1 ? pageRaw : 1;
    const limit = Number.isFinite(limitRaw) ? Math.min(50, Math.max(1, limitRaw)) : 12;
    const skip = (page - 1) * limit;

    const where = buildWhere(searchParams);
    const sort = searchParams.get("sort") || "createdAt";
    const order = searchParams.get("order") || "desc";

    const [vehicles, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
      prisma.vehicle.count({ where }),
    ]);

    const formatted = vehicles.map((v) => ({
      id: v.id,
      stockId: v.stockId,
      make: v.make,
      model: v.model,
      year: v.year,
      price: v.price,
      priceCif: v.priceCif,
      currency: v.currency,
      mileage: v.mileage,
      fuelType: v.fuelType,
      transmission: v.transmission,
      bodyType: v.bodyType,
      color: v.color,
      driveType: v.driveType,
      engineSize: v.engineSize,
      location: v.location,
      destinationSlug: (v as { destinationSlug?: string | null }).destinationSlug ?? null,
      condition: v.condition,
      auctionGrade: v.auctionGrade,
      images: JSON.parse(v.images || "[]"),
      description: v.description,
      features: JSON.parse(v.features || "[]"),
      specifications: v.specifications ? JSON.parse(v.specifications) : null,
      status: v.status,
      featured: v.featured,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
      auctionHouse: (v as { auctionHouse?: string | null }).auctionHouse ?? null,
      lotNumber: (v as { lotNumber?: string | null }).lotNumber ?? null,
      auctionDate: (v as { auctionDate?: string | null }).auctionDate ?? null,
      chassis: (v as { chassis?: string | null }).chassis ?? null,
      source: (v as { source?: string | null }).source ?? null,
    }));

    return NextResponse.json({
      vehicles: formatted,
      total,
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error("Vehicles list error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getAuthFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    const isSuperAdmin = payload?.sub === "super-admin";

    if (!payload || (payload.role !== "admin" && !isSuperAdmin)) {
      return NextResponse.json({ error: "Unauthorized. Admin only." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const stockId = String(body.stockId ?? body.stock_id ?? "").trim();
    const make = String(body.make ?? "").trim();
    const model = String(body.model ?? "").trim();
    const year = body.year != null ? parseInt(String(body.year), 10) : 0;
    const price = body.price != null ? parseFloat(String(body.price)) : 0;
    const mileage = body.mileage != null ? parseInt(String(body.mileage), 10) : 0;
    const fuelType = String(body.fuelType ?? body.fuel ?? "Petrol").trim();
    const transmission = String(body.transmission ?? "Automatic").trim();
    const color = String(body.color ?? "").trim();
    const location = String(body.location ?? "").trim();
    const destinationSlug = body.destinationSlug != null ? (String(body.destinationSlug).trim() || null) : null;
    const condition = String(body.condition ?? "Good").trim();
    const auctionGrade = body.auctionGrade ?? body.grade ?? null;
    const description = String(body.description ?? "").trim();
    const images = Array.isArray(body.images) ? body.images : (typeof body.images === "string" ? JSON.parse(body.images || "[]") : []);
    const features = Array.isArray(body.features) ? body.features : [];

    if (!stockId || !make || !model || year < 1900 || price < 0) {
      return NextResponse.json(
        { error: "Missing required fields: stockId, make, model, year, price" },
        { status: 400 }
      );
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        stockId,
        make,
        model,
        year,
        price,
        priceCif: body.priceCif != null ? parseFloat(String(body.priceCif)) : null,
        currency: String(body.currency ?? "USD"),
        mileage,
        fuelType,
        transmission,
        bodyType: body.bodyType ?? null,
        color: color || "—",
        driveType: body.driveType ?? null,
        engineSize: body.engineSize != null ? parseFloat(String(body.engineSize)) : null,
        engineType: body.engineType ?? null,
        location: location || "Yokohama Port",
        destinationSlug: destinationSlug || null,
        condition,
        auctionGrade: auctionGrade != null ? String(auctionGrade) : null,
        images: JSON.stringify(images),
        description: description || "—",
        features: JSON.stringify(features),
        specifications: body.specifications ? JSON.stringify(body.specifications) : null,
        status: "available",
        featured: Boolean(body.featured),
        auctionHouse: body.auctionHouse != null ? String(body.auctionHouse).trim() : null,
        lotNumber: body.lotNumber != null ? String(body.lotNumber).trim() : null,
        auctionDate: body.auctionDate != null ? String(body.auctionDate).trim() : null,
        chassis: body.chassis != null ? String(body.chassis).trim() : null,
        source: body.source != null ? String(body.source).trim() : null,
      },
    });

    // Sync to DVM Website
    try {
      await syncToDVM(vehicle);
    } catch (syncError) {
      console.error("DVM Sync background error:", syncError);
      // We don't block the response even if sync fails
    }

    return NextResponse.json({
      success: true,
      id: vehicle.id,
      vehicle: {
        id: vehicle.id,
        stockId: vehicle.stockId,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        price: vehicle.price,
        mileage: vehicle.mileage,
        fuelType: vehicle.fuelType,
        transmission: vehicle.transmission,
        location: vehicle.location,
      },
    });
  } catch (e) {
    console.error("Vehicle create error:", e);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
