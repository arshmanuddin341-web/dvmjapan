/**
 * Direct MongoDB auth - used when Express backend is unreachable
 * Register & login work without needing backend server on port 5000
 */

import mongoose from "mongoose";

let connected = false;

async function getConnection() {
  if (connected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set in .env");
  try {
    await mongoose.connect(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 10000 });
    connected = true;
    return mongoose.connection;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Connection failed";
    throw new Error(`Database connection failed: ${msg}. Check MONGODB_URI in .env`);
  }
}

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String, trim: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const bcrypt = await import("bcryptjs");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}) {
  await getConnection();
  const existing = await User.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw new Error("User with this email already exists");
  }
  const crypto = await import("crypto");
  const plainToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(plainToken).digest("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({
    name: data.name.trim(),
    email: data.email.toLowerCase().trim(),
    password: data.password,
    phone: data.phone?.trim(),
    isEmailVerified: true, // Allow immediate login when backend/email unavailable
    emailVerificationToken: hashedToken,
    emailVerificationExpires: expiresAt,
  });

  const jwt = await import("jsonwebtoken");
  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: process.env.JWT_EXPIRE || "7d" } as unknown as import("jsonwebtoken").SignOptions
  );

  return {
    success: true,
    message: "Registration successful! You are now signed in.",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    },
  };
}

export async function getMeFromToken(token: string) {
  const jwt = await import("jsonwebtoken");
  const secret = process.env.JWT_SECRET || "fallback-secret";
  const decoded = jwt.verify(token, secret) as {
    id: string;
    email: string;
    name?: string;
    role: string;
    status?: "pending" | "approved";
  };
  return {
    success: true,
    data: {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name || decoded.email?.split("@")[0] || "User",
      role: decoded.role || "user",
      status: decoded.status ?? "approved",
    },
  };
}

export async function loginUser(email: string, password: string) {
  await getConnection();
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) throw new Error("Invalid email or password");

  const bcrypt = await import("bcryptjs");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid email or password");

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
  }

  const jwt = await import("jsonwebtoken");
  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET || "fallback-secret",
    { expiresIn: process.env.JWT_EXPIRE || "7d" } as unknown as import("jsonwebtoken").SignOptions
  );

  return {
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    },
  };
}
