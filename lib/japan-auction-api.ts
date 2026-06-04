/**
 * Real Japan auction data – fetch from external API when configured.
 * Set JAPAN_AUCTION_API_URL (and optional JAPAN_AUCTION_API_KEY) for live data.
 * No cache – every request returns fresh data for live updates.
 */

const BASE = process.env.JAPAN_AUCTION_API_URL?.trim();
const API_KEY = process.env.JAPAN_AUCTION_API_KEY?.trim();
const AVTOJP_CODE = process.env.JAPAN_AUCTION_AVTOJP_CODE?.trim();
const AVTOJP_BASE = "http://78.46.90.228/api";

export type LiveAuctionItem = { id: string; name: string; timeRemaining: string; vehicles: number; status: string };
export type UpcomingAuctionItem = { id: string; name: string; date: string; time: string; location: string; vehicles: number; status: string };
export type ListingItem = { lot: string; make: string; model: string; year: number; auction: string; date: string; mileage: number; engine: string; startPrice: number; soldPrice: number; image: string; chassis?: string; grade?: string };

function headers(): HeadersInit {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  if (API_KEY) h["Authorization"] = `Bearer ${API_KEY}`;
  if (API_KEY && !h["Authorization"]?.startsWith("Bearer")) h["X-API-Key"] = API_KEY;
  return h;
}

async function getJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store", headers: headers() });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Fetch live auctions from custom API. Returns null if not configured or request fails. */
export async function fetchRealJapanLive(): Promise<LiveAuctionItem[] | null> {
  if (!BASE) return null;
  const url = BASE.endsWith("/") ? `${BASE}live` : `${BASE}/live`;
  const data = await getJson<LiveAuctionItem[] | { data?: LiveAuctionItem[] }>(url);
  if (!data) return null;
  const arr = Array.isArray(data) ? data : (data as { data?: LiveAuctionItem[] }).data;
  return Array.isArray(arr) && arr.length > 0 ? arr : null;
}

/** Fetch upcoming auctions from custom API. */
export async function fetchRealJapanUpcoming(): Promise<UpcomingAuctionItem[] | null> {
  if (!BASE) return null;
  const url = BASE.endsWith("/") ? `${BASE}upcoming` : `${BASE}/upcoming`;
  const data = await getJson<UpcomingAuctionItem[] | { data?: UpcomingAuctionItem[] }>(url);
  if (!data) return null;
  const arr = Array.isArray(data) ? data : (data as { data?: UpcomingAuctionItem[] }).data;
  return Array.isArray(arr) && arr.length > 0 ? arr : null;
}

/** Map raw row from Avto.jp (main table) to our listing shape. */
function mapAvtoJpRow(row: Record<string, unknown>, index: number): ListingItem {
  const num = (v: unknown) => (typeof v === "number" && !Number.isNaN(v)) ? v : typeof v === "string" ? parseInt(v, 10) || 0 : 0;
  const str = (v: unknown) => (v != null ? String(v) : "") || "";
  const lot = str(row.id ?? row.lot ?? row.serial ?? row.lot_id) || `lot-${index + 1}`;
  const make = str(row.manufacturer ?? row.make ?? row.maker ?? row.manuf).trim() || "—";
  const model = str(row.model_name ?? row.model).trim() || "—";
  const year = num(row.year ?? row.model_year);
  const auction = str(row.auction_name ?? row.auction ?? row.vendor);
  const date = str(row.sale_date ?? row.date ?? row.auction_date);
  const mileage = num(row.mileage ?? row.km);
  const engine = str(row.engine ?? row.engine_type);
  const startPrice = num(row.start_price ?? row.startPrice ?? row.min_price);
  const soldPrice = num(row.sold_price ?? row.soldPrice ?? row.price ?? row.final_price) || startPrice;
  let image = str(row.image ?? row.image_url ?? row.img ?? row.photo);
  if (!image && row.imgs && Array.isArray(row.imgs) && row.imgs[0]) image = String(row.imgs[0]);
  if (!image && row.images && typeof row.images === "string") image = row.images.split(",")[0]?.trim() || "";
  if (!image) image = `https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400`;
  return { lot, make, model, year, auction, date, mileage, engine, startPrice, soldPrice, image, chassis: str(row.chassis).trim() || undefined, grade: str(row.grade).trim() || undefined };
}

/** Fetch listings from Avto.jp SQL API (when JAPAN_AUCTION_AVTOJP_CODE is set). */
export async function fetchRealJapanListingsAvtoJp(limit: number): Promise<ListingItem[] | null> {
  if (!AVTOJP_CODE) return null;
  const sql = `select * from main order by sale_date desc limit ${Math.min(100, Math.max(1, limit))}`;
  const url = `${AVTOJP_BASE}/?json&code=${encodeURIComponent(AVTOJP_CODE)}&sql=${encodeURIComponent(sql)}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const raw = await res.json();
    const rows = Array.isArray(raw) ? raw : raw?.data ?? raw?.rows ?? (raw?.result && Array.isArray(raw.result) ? raw.result : []);
    if (!rows.length) return null;
    return rows.map((r: Record<string, unknown>, i: number) => mapAvtoJpRow(r, i));
  } catch {
    return null;
  }
}

/** Fetch listings from custom API. */
export async function fetchRealJapanListings(limit: number): Promise<ListingItem[] | null> {
  if (BASE) {
    const url = BASE.endsWith("/") ? `${BASE}listings?limit=${limit}` : `${BASE}/listings?limit=${limit}`;
    const data = await getJson<ListingItem[] | { data?: ListingItem[] }>(url);
    if (data) {
      const arr = Array.isArray(data) ? data : (data as { data?: ListingItem[] }).data;
      if (Array.isArray(arr) && arr.length > 0) return arr;
    }
  }
  return fetchRealJapanListingsAvtoJp(limit);
}
