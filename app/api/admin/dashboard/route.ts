import { NextResponse } from "next/server";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/admin/dashboard – overview stats (admin only). */
export async function GET(req: Request) {
  try {
    const token = getAuthFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [userCount, vehicleCount, auctionCount, inquiryCount] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.vehicle.count().catch(() => 0),
      prisma.auctionListing.count().catch(() => 0),
      prisma.inquiry.count().catch(() => 0),
    ]);

    const [recentUsers, recentVehicles, recentInquiries] = await Promise.all([
      prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { name: true, email: true } }).catch(() => []),
      prisma.vehicle.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { stockId: true, make: true, model: true, price: true, status: true } }).catch(() => []),
      prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }).catch(() => []),
    ]);

    const overview = {
      users: { total: userCount, active: userCount },
      cars: { total: vehicleCount, available: await prisma.vehicle.count({ where: { status: "available" } }).catch(() => vehicleCount) },
      auctions: { total: auctionCount, live: 0 },
      inquiries: { total: inquiryCount, pending: await prisma.inquiry.count({ where: { status: "new" } }).catch(() => 0) },
      revenue: { total: 0 },
    };

    const recentActivity = {
      users: recentUsers.map((u) => ({ name: u.name, email: u.email })),
      auctions: recentVehicles.map((v) => ({ title: `${v.make} ${v.model}`, status: v.status, currentBid: v.price })),
      inquiries: recentInquiries.map((i) => ({ name: i.name, subject: i.subject, status: i.status, date: i.createdAt })),
    };

    return NextResponse.json({
      success: true,
      data: { overview, recentActivity },
    });
  } catch (e) {
    console.error("Dashboard error:", e);
    const empty = {
      overview: { users: { total: 0, active: 0 }, cars: { total: 0, available: 0 }, auctions: { total: 0, live: 0 }, bids: { total: 0 }, revenue: { total: 0 } },
      recentActivity: { users: [] as { name: string; email: string }[], auctions: [] as { title: string; status: string; currentBid: number }[] },
    };
    return NextResponse.json({ success: true, data: empty });
  }
}
