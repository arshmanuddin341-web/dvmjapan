/**
 * Fetch raw listings from configured Japan auction source (env-based).
 * No fake data: when URL is not set or request fails, returns empty array and error message.
 */

const BASE_URL = process.env.JAPAN_AUCTION_API_URL || process.env.JAPAN_AUCTION_API_BASE_URL || "";
const API_KEY = process.env.JAPAN_AUCTION_API_KEY || "";

export interface FetchResult {
  items: Record<string, unknown>[];
  sourceName: string;
  error?: string;
}

export async function fetchListingsFromSource(): Promise<FetchResult> {
  const sourceName = "Japan Auction (config)";

  if (!BASE_URL || !BASE_URL.startsWith("http")) {
    return { items: [], sourceName, error: "JAPAN_AUCTION_API_URL not set or invalid" };
  }

  const url = `${BASE_URL.replace(/\/$/, "")}/listings`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    const res = await fetch(url, {
      method: "GET",
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        items: [],
        sourceName,
        error: (data as { message?: string }).message ?? (data as { error?: string }).error ?? `HTTP ${res.status}`,
      };
    }

    const items = Array.isArray(data)
      ? data
      : (data as { listings?: unknown[] }).listings ??
        (data as { data?: unknown[] }).data ??
        (data as { items?: unknown[] }).items ??
        [];
    const list = Array.isArray(items) ? items : [];

    return { items: list as Record<string, unknown>[], sourceName };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Request failed";
    return { items: [], sourceName, error: message };
  }
}
