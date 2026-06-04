/**
 * GET /api/upload/sign
 * Returns Cloudinary upload signature + timestamp for signed uploads (widget / client).
 * Requires CLOUDINARY_API_SECRET in .env.
 */

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const secret = process.env.CLOUDINARY_API_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Cloudinary not configured" },
        { status: 503 }
      );
    }
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      secret
    );
    return NextResponse.json({ signature, timestamp });
  } catch (e) {
    console.error("Upload sign error:", e);
    return NextResponse.json(
      { error: "Upload sign failed" },
      { status: 503 }
    );
  }
}
