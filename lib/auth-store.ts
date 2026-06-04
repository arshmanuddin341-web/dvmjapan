/**
 * File-based auth fallback - works when MongoDB is unreachable (e.g. DNS/network issues)
 * Users stored in data/auth-users.json
 */

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const STORE_PATH = path.join(process.cwd(), "data", "auth-users.json");

export type UserStatus = "pending" | "approved";

type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  status?: UserStatus; // only for role 'user'; admin has full access
  phone?: string;
  isEmailVerified: boolean;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
};

async function readStore(): Promise<StoredUser[]> {
  try {
    const data = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeStore(users: StoredUser[]) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(users, null, 2), "utf-8");
}

export async function registerUserFile(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  const users = await readStore();
  const email = data.email.toLowerCase().trim();
  if (users.some((u) => u.email === email)) {
    throw new Error("User with this email already exists");
  }
  const bcrypt = await import("bcryptjs");
  const passwordHash = await bcrypt.hash(data.password, 10);
  // First user = main admin; rest = user with pending approval
  const isFirstUser = users.length === 0;
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: data.name.trim(),
    email,
    passwordHash,
    role: isFirstUser ? "admin" : "user",
    status: isFirstUser ? undefined : "pending",
    phone: data.phone?.trim(),
    isEmailVerified: true,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  await writeStore(users);

  const jwt = await import("jsonwebtoken");
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role, status: user.status ?? "approved" },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: process.env.JWT_EXPIRE || "7d" } as Parameters<typeof jwt.sign>[2]
  );

  return {
    success: true,
    message: isFirstUser
      ? "Registration successful! You are the main admin."
      : "Registration successful! Your account is pending admin approval. You will get access once approved.",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status ?? "approved",
        isEmailVerified: true,
      },
      token,
    },
  };
}

export async function loginUserFile(email: string, password: string) {
  const users = await readStore();
  const user = users.find((u) => u.email === email.toLowerCase());
  if (!user) throw new Error("Invalid email or password");

  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error("Invalid email or password");

  const status = user.role === "admin" ? "approved" : (user.status ?? "approved");
  const jwt = await import("jsonwebtoken");
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role, status },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: process.env.JWT_EXPIRE || "7d" } as Parameters<typeof jwt.sign>[2]
  );

  return {
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status,
      },
      token,
    },
  };
}

/** List users for admin (no password). */
export async function getUsersForAdmin(): Promise<
  { id: string; name: string; email: string; role: string; status?: UserStatus; createdAt: string }[]
> {
  const users = await readStore();
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.role === "user" ? (u.status ?? "approved") : undefined,
    createdAt: u.createdAt,
  }));
}

/** Approve a user (admin only). */
export async function approveUser(userId: string, adminId: string): Promise<boolean> {
  const users = await readStore();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1 || users[idx].role !== "user") return false;
  users[idx].status = "approved";
  users[idx].approvedAt = new Date().toISOString();
  users[idx].approvedBy = adminId;
  await writeStore(users);
  return true;
}

/** Get current status for a user by id (for /me to return latest status after approval). */
export async function getStatusById(userId: string): Promise<UserStatus | undefined> {
  const users = await readStore();
  const u = users.find((x) => x.id === userId);
  if (!u || u.role !== "user") return undefined;
  return u.status ?? "approved"; // backward compat: no status = approved
}
