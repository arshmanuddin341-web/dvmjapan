import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthFromRequest, verifyToken } from "@/lib/auth";
import { siteConfig } from "@/lib/site-config";

const PRISMA_KEYS = ["site_config", "hero", "faq", "testimonials", "seo", "pricing", "blog"];

const defaultHero = {
  eyebrow: "Premium Japanese Imports",
  title: "Drive Your Dream Car Home",
  subtitle: "From Japan's finest auctions to your driveway. Quality-checked, hassle-free.",
  ctaPrimary: "Browse Inventory",
  ctaSecondary: "How It Works",
};

const defaultFaq: { question: string; answer: string }[] = [];
const defaultTestimonials: { name: string; role: string; text: string; rating: number }[] = [];
const defaultSeo = {
  pages: [
    { path: "/", title: "Home", metaTitle: "DVM JAPAN - Premium Japanese Car Import Marketplace", metaDesc: "Import high-quality used Japanese vehicles." },
    { path: "/inventory", title: "Inventory", metaTitle: "Vehicle Inventory - Browse Japanese Cars", metaDesc: "Browse our extensive inventory." },
    { path: "/about", title: "About", metaTitle: "About Us - DVM JAPAN", metaDesc: "Your trusted partner for Japanese vehicle imports." },
  ],
};
const defaultPricing = {
  rules: [
    { id: "1", name: "Base Shipping Cost - Africa", amount: "$2,700", type: "Shipping" },
    { id: "2", name: "Base Shipping Cost - Middle East", amount: "$2,200", type: "Shipping" },
    { id: "3", name: "Insurance Rate", amount: "2%", type: "Insurance" },
    { id: "4", name: "Documentation Fee", amount: "$300", type: "Service" },
  ],
  notes: "Vehicle prices are set individually based on auction purchase price, market value, and condition. Shipping costs vary by destination and vehicle size.",
};
const defaultBlog: { id: string; title: string; slug: string; excerpt: string; content: string; author: string; publishedAt: string; image: string; category: string; tags: string[] }[] = [];

function getDefaultForKey(key: string): unknown {
  if (key === "site_config") return siteConfig;
  if (key === "hero") return defaultHero;
  if (key === "faq") return defaultFaq;
  if (key === "testimonials") return defaultTestimonials;
  if (key === "seo") return defaultSeo;
  if (key === "pricing") return defaultPricing;
  if (key === "blog") return defaultBlog;
  return null;
}

/** GET: from Prisma for site_config/hero; else 404 (no proxy). */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  if (!PRISMA_KEYS.includes(key)) {
    return NextResponse.json({ error: "Unknown content key" }, { status: 404 });
  }

  try {
    const row = await prisma.content.findUnique({
      where: { key },
    });
    if (row?.value != null) {
      try {
        return NextResponse.json({ data: JSON.parse(row.value) });
      } catch {
        return NextResponse.json({ data: row.value });
      }
    }
  } catch {
    // DB error
  }
  const fallback = getDefaultForKey(key);
  return NextResponse.json(fallback != null ? { data: fallback } : {});
}

/** PUT: admin only; save to Prisma for site_config/hero. */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  if (!PRISMA_KEYS.includes(key)) {
    return NextResponse.json({ error: "Unknown content key" }, { status: 404 });
  }

  const token = getAuthFromRequest(req);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const value = (body as { value?: unknown })?.value ?? body;
  if (value === undefined || value === null) {
    return NextResponse.json({ error: "Missing value" }, { status: 400 });
  }

  try {
    await prisma.content.upsert({
      where: { key },
      create: { key, value: JSON.stringify(value) },
      update: { value: JSON.stringify(value) },
    });
    return NextResponse.json({ success: true, data: value });
  } catch (e) {
    console.error("Content save error:", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
