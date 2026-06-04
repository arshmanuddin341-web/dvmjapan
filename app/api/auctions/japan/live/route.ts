import { NextResponse } from "next/server";
import { fetchRealJapanLive } from "@/lib/japan-auction-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEMO_NAMES = [
  { id: "live-1", name: "USS Nagoya Live", vehicles: 450 },
  { id: "live-2", name: "USS Tokyo Live", vehicles: 820 },
  { id: "live-3", name: "Aucnet Live", vehicles: 390 },
];
// Offsets so each auction has a different countdown (updates every request = live feel)
const DEMO_OFFSETS_MS = [2 * 60 * 60 * 1000 + 15 * 60 * 1000, 4 * 60 * 60 * 1000 + 30 * 60 * 1000, 1 * 60 * 60 * 1000 + 45 * 60 * 1000];
const NO_CACHE_HEADERS = { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache" };

function formatTimeRemaining(endTime: string): string {
  try {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const ms = Math.max(0, end - now);
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  } catch {
    return "-";
  }
}

function getDemoLive() {
  const now = Date.now();
  return DEMO_NAMES.map((d, i) => ({
    ...d,
    timeRemaining: formatTimeRemaining(new Date(now + DEMO_OFFSETS_MS[i]).toISOString()),
    status: "live",
  }));
}

export async function GET() {
  const real = await fetchRealJapanLive();
  if (real && real.length > 0) {
    return NextResponse.json(real, { headers: NO_CACHE_HEADERS });
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auctions/live`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const json = await res.json();
      if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
        const mapped = json.data.map((a: { _id?: string; title?: string; endTime?: string }, i: number) => ({
          id: a._id ?? "live-" + (i + 1),
          name: a.title ?? "Live Auction " + (i + 1),
          timeRemaining: a.endTime ? formatTimeRemaining(a.endTime) : "-",
          vehicles: 1,
          status: "live",
        }));
        return NextResponse.json(mapped, { headers: NO_CACHE_HEADERS });
      }
    }
  } catch {
    // use demo when backend unreachable
  }
  return NextResponse.json(getDemoLive(), { headers: NO_CACHE_HEADERS });
}
