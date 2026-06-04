import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";

const STATUSES = ["new", "contacted", "resolved"] as const;

/** PATCH: admin only – update inquiry status */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = getAuthFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = typeof body?.status === "string" ? body.status.trim().toLowerCase() : "";
  if (!status || !STATUSES.includes(status as (typeof STATUSES)[number])) {
    return NextResponse.json(
      { error: "Invalid status. Use: new, contacted, resolved" },
      { status: 400 }
    );
  }

  try {
    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(inquiry);
  } catch (e) {
    if ((e as { code?: string })?.code === "P2025") {
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    }
    console.error("Inquiry update error:", e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
