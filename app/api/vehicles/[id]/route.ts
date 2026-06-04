import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { syncToDVM } from "@/lib/sync";

function formatVehicle(v: {
  id: string;
  stockId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  priceCif: number | null;
  currency: string;
  mileage: number | null;
  fuelType: string;
  transmission: string;
  bodyType: string | null;
  color: string;
  driveType: string | null;
  engineSize: number | null;
  engineType: string | null;
  location: string;
  destinationSlug?: string | null;
  condition: string;
  auctionGrade: string | null;
  images: string;
  description: string;
  features: string;
  specifications: string | null;
  status: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  auctionHouse?: string | null;
  lotNumber?: string | null;
  auctionDate?: string | null;
  chassis?: string | null;
  source?: string | null;
}) {
  return {
    id: v.id,
    stockId: v.stockId,
    make: v.make,
    model: v.model,
    year: v.year,
    price: v.price,
    priceCif: v.priceCif,
    currency: v.currency,
    mileage: v.mileage ?? 0,
    fuelType: v.fuelType,
    transmission: v.transmission,
    bodyType: v.bodyType,
    color: v.color,
    driveType: v.driveType,
    engineSize: v.engineSize,
    location: v.location,
    destinationSlug: v.destinationSlug ?? null,
    condition: v.condition,
    auctionGrade: v.auctionGrade,
    images: JSON.parse(v.images || "[]") as string[],
    description: v.description,
    features: JSON.parse(v.features || "[]") as string[],
    specifications: v.specifications ? JSON.parse(v.specifications) : null,
    status: v.status,
    featured: v.featured,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
    auctionHouse: v.auctionHouse ?? null,
    lotNumber: v.lotNumber ?? null,
    auctionDate: v.auctionDate ?? null,
    chassis: v.chassis ?? null,
    source: v.source ?? null,
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicle = await prisma.vehicle.findFirst({
      where: {
        OR: [{ id }, { stockId: id }],
      },
    });
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    return NextResponse.json(formatVehicle(vehicle));
  } catch (e) {
    console.error("Vehicle get error:", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAuthFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    const isSuperAdmin = payload?.sub === "super-admin";

    if (!payload || (payload.role !== "admin" && !isSuperAdmin)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        ...(body.stockId && { stockId: body.stockId }),
        ...(body.make && { make: body.make }),
        ...(body.model && { model: body.model }),
        ...(body.year != null && { year: body.year }),
        ...(body.price != null && { price: body.price }),
        ...(body.priceCif != null && { priceCif: body.priceCif }),
        ...(body.currency && { currency: body.currency }),
        ...(body.mileage != null && { mileage: body.mileage }),
        ...(body.fuelType && { fuelType: body.fuelType }),
        ...(body.transmission && { transmission: body.transmission }),
        ...(body.bodyType != null && { bodyType: body.bodyType }),
        ...(body.color && { color: body.color }),
        ...(body.driveType != null && { driveType: body.driveType }),
        ...(body.engineSize != null && { engineSize: body.engineSize }),
        ...(body.location && { location: body.location }),
        ...(body.destinationSlug !== undefined && { destinationSlug: body.destinationSlug ? String(body.destinationSlug).trim() : null }),
        ...(body.condition && { condition: body.condition }),
        ...(body.auctionGrade != null && { auctionGrade: body.auctionGrade }),
        ...(body.images && { images: JSON.stringify(body.images) }),
        ...(body.description != null && { description: body.description }),
        ...(body.features && { features: JSON.stringify(body.features) }),
        ...(body.specifications && { specifications: JSON.stringify(body.specifications) }),
        ...(body.status && { status: body.status }),
        ...(body.featured != null && { featured: body.featured }),
        ...(body.auctionHouse != null && { auctionHouse: body.auctionHouse }),
        ...(body.lotNumber != null && { lotNumber: body.lotNumber }),
        ...(body.auctionDate != null && { auctionDate: body.auctionDate }),
        ...(body.chassis != null && { chassis: body.chassis }),
        ...(body.source != null && { source: body.source }),
      },
    });

    // Sync update to DVM Website
    try {
      await syncToDVM(vehicle, "PUT");
    } catch (syncError) {
      console.error("DVM Sync background update error:", syncError);
    }

    return NextResponse.json(formatVehicle(vehicle));
  } catch (e) {
    console.error("Vehicle update error:", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getAuthFromRequest(_req);
    const payload = token ? verifyToken(token) : null;
    const isSuperAdmin = payload?.sub === "super-admin";

    if (!payload || (payload.role !== "admin" && !isSuperAdmin)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.vehicle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Vehicle delete error:", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
