import { NextResponse } from "next/server";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { approveUser } from "@/lib/auth-store";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** PATCH /api/admin/users/[id]/approve - approve user (admin only) */
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

  try {
    if (usePrisma) {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user || user.role !== "user") {
        return NextResponse.json({ success: false, message: "User not found or already approved" }, { status: 404 });
      }
      if (user.status === "active") {
        return NextResponse.json({ success: true, message: "User already approved" });
      }
      await prisma.user.update({
        where: { id },
        data: { status: "active" },
      });
      return NextResponse.json({ success: true, message: "User approved" });
    }
    const ok = await approveUser(id, payload.sub);
    if (!ok) {
      return NextResponse.json({ success: false, message: "User not found or already approved" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "User approved" });
  } catch (e) {
    console.error("Approve error:", e);
    return NextResponse.json({ success: false, message: "Failed to approve" }, { status: 500 });
  }
}
