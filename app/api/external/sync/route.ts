import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/external/sync
 * Returns all available stock in a simplified format for DVM Website to pull.
 */
export async function GET() {
    try {
        const vehicles = await prisma.vehicle.findMany({
            where: { status: "available" },
            orderBy: { createdAt: "desc" },
        });

        const formatted = vehicles.map((v) => ({
            id: v.id,
            stockId: v.stockId,
            make: v.make,
            model: v.model,
            year: v.year,
            price: v.price,
            engineSize: v.engineSize?.toString() || "",
            mileage: v.mileage,
            transmission: v.transmission,
            fuelType: v.fuelType,
            drive: v.driveType || "",
            color: v.color,
            chassisNo: v.chassis || "",
            images: JSON.parse(v.images || "[]"),
            status: "AVAILABLE",
            specs: v.description || "",
        }));

        return NextResponse.json({
            success: true,
            count: formatted.length,
            vehicles: formatted,
        });
    } catch (error: any) {
        console.error("External Sync API Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
