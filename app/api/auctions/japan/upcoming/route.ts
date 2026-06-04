/**
 * Japan Upcoming Auctions API
 * GET /api/auctions/japan/upcoming
 */

import { NextResponse } from "next/server";
import { fetchRealJapanUpcoming } from "@/lib/japan-auction-api";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache" };

const DEMO_UPCOMING = [
  { id: "1", name: "USS Tokyo Weekly Auction", date: "2026-02-05", time: "10:00 JST", location: "Tokyo, Japan", vehicles: 1250, status: "upcoming" },
  { id: "2", name: "Aucnet Monthly Special", date: "2026-02-10", time: "14:00 JST", location: "Yokohama, Japan", vehicles: 850, status: "upcoming" },
  { id: "3", name: "USS Osaka Premium Sale", date: "2026-02-15", time: "11:00 JST", location: "Osaka, Japan", vehicles: 920, status: "upcoming" },
  { id: "4", name: "CAA Nagoya Regular", date: "2026-02-08", time: "09:00 JST", location: "Nagoya, Japan", vehicles: 680, status: "upcoming" },
  { id: "5", name: "TAA Yokohama Weekly", date: "2026-02-12", time: "13:00 JST", location: "Yokohama, Japan", vehicles: 720, status: "upcoming" },
  { id: "6", name: "USS Tokyo Premium", date: "2026-02-18", time: "10:00 JST", location: "Tokyo, Japan", vehicles: 1100, status: "upcoming" },
];

export async function GET() {
  const real = await fetchRealJapanUpcoming();
  if (real && real.length > 0) {
    return NextResponse.json(real, { headers: NO_CACHE_HEADERS });
  }

  try {
    const res = await fetch(
      `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auctions/upcoming`,
      { cache: "no-store" }
    );
    if (res.ok) {
      const json = await res.json();
      if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
        const mapped = json.data.map((a: { _id?: string; title?: string; startTime?: string }, i: number) => ({
          id: a._id ?? String(i + 1),
          name: a.title ?? "Upcoming Auction " + (i + 1),
          date: a.startTime ? new Date(a.startTime).toISOString().slice(0, 10) : "",
          time: a.startTime ? new Date(a.startTime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) + " JST" : "-",
          location: "Japan",
          vehicles: 1,
          status: "upcoming",
        }));
        return NextResponse.json(mapped, { headers: NO_CACHE_HEADERS });
      }
    }
  } catch {
    // use demo when backend unreachable
  }
  return NextResponse.json(DEMO_UPCOMING, { headers: NO_CACHE_HEADERS });
}
