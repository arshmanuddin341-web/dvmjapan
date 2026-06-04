import { NextResponse } from "next/server";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { getUsersForAdmin } from "@/lib/auth-store";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/admin/users - list users (admin only) */
export async function GET(req: Request) {
  const token = getAuthFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const usePrisma = !!process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres");

  try {
    if (usePrisma) {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, status: true, canTrackVehicle: true, createdAt: true },
      });
      const data = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.role === "user" ? (u.status === "active" ? "approved" : "pending") : undefined,
        canTrackVehicle: u.canTrackVehicle ?? false,
        createdAt: u.createdAt.toISOString(),
      }));
      return NextResponse.json({ success: true, data });
    }
    const users = await getUsersForAdmin();
    return NextResponse.json({ success: true, data: users });
  } catch (e) {
    console.error("Admin users list error:", e);
    // Graceful: return empty list so admin UI doesn't break (e.g. DB tables not migrated yet)
    return NextResponse.json({ success: true, data: [] });
  }
}
