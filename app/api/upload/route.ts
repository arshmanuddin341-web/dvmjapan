import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { v4 as uuidv4 } from "uuid";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const token = getAuthFromRequest(req);
        const payload = token ? verifyToken(token) : null;
        if (!payload || payload.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized. Admin only." }, { status: 401 });
        }

        const formData = await req.formData();
        const files = formData.getAll("file") as File[];
        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
        }

        const { uploadToCloudinary } = await import("@/lib/cloudinary-server");
        const urls: string[] = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `${uuidv4()}`; // Don't need extension for Cloudinary public_id usually

            const url = await uploadToCloudinary(buffer, filename);
            urls.push(url);
        }

        return NextResponse.json({ urls });
    } catch (error: any) {
        console.error("Cloudinary upload error:", error);
        return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
    }
}
