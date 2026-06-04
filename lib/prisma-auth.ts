/**
 * Prisma-based auth when DATABASE_URL is set.
 * Login/register use User table; admin approve sets status to "active".
 */

import { prisma } from "@/lib/db";
import type { User } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";

function toClientUser(u: User) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.role === "admin" ? "active" : u.status,
  };
}

export async function loginUserPrisma(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user) throw new Error("Invalid email or password");

  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password");

  if (user.role !== "admin" && user.status !== "active") {
    throw new Error("Your account is pending approval. Please wait for admin to approve.");
  }

  const jwt = await import("jsonwebtoken");
  const token = jwt.sign(
    {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE } as import("jsonwebtoken").SignOptions
  );

  return {
    success: true,
    data: {
      user: toClientUser(user),
      token,
    },
  };
}

export async function registerUserPrisma(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const email = data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User with this email already exists");

  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(data.password, 10);

  const isFirst = (await prisma.user.count()) === 0;
  const user = await prisma.user.create({
    data: {
      name: data.name.trim(),
      email,
      passwordHash,
      phone: data.phone?.trim() || null,
      role: isFirst ? "admin" : "user",
      status: isFirst ? "active" : "inactive",
    },
  });

  const jwt = await import("jsonwebtoken");
  const token = jwt.sign(
    {
      sub: user.id,
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE } as import("jsonwebtoken").SignOptions
  );

  return {
    success: true,
    message:
      isFirst
        ? "Registration successful! You are the main admin."
        : "Registration successful! Your account is pending admin approval.",
    data: {
      user: toClientUser(user),
      token,
    },
  };
}
