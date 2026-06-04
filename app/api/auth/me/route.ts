import { NextResponse } from "next/server";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { getMeFromToken } from "@/lib/mongo-auth";
import { getStatusById } from "@/lib/auth-store";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** /me: decode JWT and return user (with latest status from DB when using Prisma) */
export async function GET(req: Request) {
  const token = getAuthFromRequest(req);
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }

  const usePrisma = !!process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres");

  if (usePrisma) {
    try {
      // Handle Super Admin fail-safe bypass
      if (payload.sub === "super-admin") {
        return NextResponse.json({
          success: true,
          data: {
            id: "super-admin",
            name: "Super Admin",
            email: process.env.SUPER_ADMIN_EMAIL || "admin@dvmjapan.com",
            role: "admin",
            status: "approved",
            canTrackVehicle: true,
          },
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, name: true, email: true, role: true, status: true, canTrackVehicle: true },
      });
      if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 401 });
      }
      const status = user.role === "user" ? (user.status === "active" ? "approved" : "pending") : "approved";
      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status,
          canTrackVehicle: user.canTrackVehicle ?? false,
        },
      });
    } catch {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }
  }

  try {
    const result = await getMeFromToken(token);
    if (result.data?.role === "user" && result.data?.id) {
      const latestStatus = await getStatusById(result.data.id);
      if (latestStatus) result.data.status = latestStatus;
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
  }
}
