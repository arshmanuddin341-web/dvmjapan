import { NextResponse } from "next/server";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** PATCH /api/admin/users/[id]/tracking - set canTrackVehicle (admin only) */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getAuthFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });
  }

  const usePrisma = !!process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres");
  if (!usePrisma) {
    return NextResponse.json({ success: false, message: "Tracking permission requires database" }, { status: 501 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const canTrackVehicle = Boolean(body.canTrackVehicle);

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    await prisma.user.update({
      where: { id },
      data: { canTrackVehicle },
    });
    return NextResponse.json({ success: true, canTrackVehicle });
  } catch (e) {
    console.error("Tracking permission update error:", e);
    return NextResponse.json({ success: false, message: "Update failed" }, { status: 500 });
  }
}
