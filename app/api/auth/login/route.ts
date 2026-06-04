import { NextResponse } from "next/server";
import { loginUserFile } from "@/lib/auth-store";
import { loginUser as loginUserMongo } from "@/lib/mongo-auth";
import { loginUserPrisma } from "@/lib/prisma-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Super admin from env (production) – set SUPER_ADMIN_EMAIL + SUPER_ADMIN_PASSWORD in Vercel */
async function trySuperAdminLogin(email: string, password: string) {
  const envEmail = process.env.SUPER_ADMIN_EMAIL?.trim();
  const envPassword = process.env.SUPER_ADMIN_PASSWORD?.trim();
  if (!envEmail || !envPassword) return null;
  if (email.toLowerCase() !== envEmail.toLowerCase() || password.trim() !== envPassword) return null;
  const jwt = await import("jsonwebtoken");
  const secret = process.env.JWT_SECRET || "fallback-secret";
  const token = jwt.sign(
    { id: "super-admin", email: envEmail, name: "Super Admin", role: "admin" },
    secret,
    { expiresIn: process.env.JWT_EXPIRE || "7d" } as unknown as import("jsonwebtoken").SignOptions
  );
  return {
    success: true,
    data: {
      user: { id: "super-admin", name: "Super Admin", email: envEmail, role: "admin" },
      token,
    },
  };
}

/** Login: env super admin → MongoDB if MONGODB_URI set → else file-based */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "");

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required" },
      { status: 400 }
    );
  }

  const superResult = await trySuperAdminLogin(email, password);
  if (superResult) return NextResponse.json(superResult);

  const usePrisma = !!process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres");

  try {
    if (usePrisma) {
      try {
        const result = await loginUserPrisma(email, password);
        return NextResponse.json(result);
      } catch {
        // Fall through to Mongo/file if Prisma user not found
      }
    }
    const useMongo = !!process.env.MONGODB_URI;
    const result = useMongo
      ? await loginUserMongo(email, password)
      : await loginUserFile(email, password);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Login failed";
    const status = msg.includes("Invalid") ? 401 : 500;
    return NextResponse.json({ success: false, message: msg }, { status });
  }
}
