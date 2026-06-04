import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Must match auth-store/mongo-auth so tokens from login verify here
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function createToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(
    { sub: payload.id, email: payload.email, role: payload.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/** Verifies JWT; normalizes payload so sub is set (auth-store uses "id", we use "sub"). */
export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, unknown>;
    const sub = (decoded.sub ?? decoded.id) as string | undefined;
    if (!sub || !decoded.email || !decoded.role) return null;
    return {
      sub,
      email: String(decoded.email),
      role: String(decoded.role),
      iat: decoded.iat as number | undefined,
      exp: decoded.exp as number | undefined,
    };
  } catch {
    return null;
  }
}

export function getAuthFromRequest(req: Request): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}
