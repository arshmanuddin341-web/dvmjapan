import { NextResponse } from "next/server";
import { registerUserFile } from "@/lib/auth-store";
import { registerUser as registerUserMongo } from "@/lib/mongo-auth";
import { registerUserPrisma } from "@/lib/prisma-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Register: MongoDB if MONGODB_URI set (Vercel), else file-based (local) */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");
  const phone = body?.phone ? String(body.phone).trim() : undefined;

  if (!name || !email || !password) {
    return NextResponse.json(
      { success: false, message: "Name, email and password are required" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { success: false, message: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  const usePrisma = !!process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres");

  try {
    if (usePrisma) {
      try {
        const result = await registerUserPrisma({ name, email, password, phone });
        return NextResponse.json(result, { status: 201 });
      } catch (e) {
        if (String(e).includes("already exists")) throw e;
        // Fall through to Mongo/file on other errors
      }
    }
    const useMongo = !!process.env.MONGODB_URI;
    const result = useMongo
      ? await registerUserMongo({ name, email, password, phone })
      : await registerUserFile({ name, email, password, phone });
    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Registration failed";
    const dup = msg.includes("already exists");
    return NextResponse.json(
      { success: false, message: msg },
      { status: dup ? 400 : 500 }
    );
  }
}
