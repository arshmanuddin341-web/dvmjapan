import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";

const createSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  vehicleId: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const token = getAuthFromRequest(req);
    let userId: string | undefined;
    if (token) {
      const payload = verifyToken(token);
      if (payload) userId = payload.sub;
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        vehicleId: parsed.data.vehicleId,
        subject: parsed.data.subject,
        message: parsed.data.message,
        userId,
      },
    });

    // Send emails asynchronously
    const { sendInquiryConfirmation, sendInquiryToAdmin } = await import("@/lib/email");
    sendInquiryConfirmation(parsed.data.email, parsed.data.name, parsed.data.vehicleId).catch(console.error);
    sendInquiryToAdmin(parsed.data).catch(console.error);

    return NextResponse.json({
      id: inquiry.id,
      message: "Inquiry submitted successfully",
    });
  } catch (e) {
    console.error("Inquiry create error:", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = getAuthFromRequest(req);
    const payload = token ? verifyToken(token) : null;
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const inquiries = await prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(inquiries);
  } catch (e) {
    console.error("Inquiries list error:", e);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
