/**
 * One-time script: add default admin (admin@gmail.com / Admin@321) to data/auth-users.json
 * Run: node scripts/seed-admin.mjs
 */
import { readFile, writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const STORE_PATH = join(process.cwd(), "data", "auth-users.json");

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin@321";
const ADMIN_NAME = "Admin";

async function main() {
  let users = [];
  try {
    const data = await readFile(STORE_PATH, "utf-8");
    users = JSON.parse(data);
  } catch {
    users = [];
  }

  const existing = users.find((u) => u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase());
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  if (existing) {
    existing.passwordHash = passwordHash;
    existing.role = "admin";
    existing.name = ADMIN_NAME;
    console.log("Updated existing user to admin:", ADMIN_EMAIL);
  } else {
    users.push({
      id: crypto.randomUUID(),
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      role: "admin",
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
    });
    console.log("Created admin user:", ADMIN_EMAIL);
  }

  await mkdir(dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(users, null, 2), "utf-8");
  console.log("Done. You can login with:", ADMIN_EMAIL, "/", ADMIN_PASSWORD);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
