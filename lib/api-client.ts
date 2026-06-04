/** Same-origin - Next.js proxies auth to backend */
const SAME_ORIGIN = "";

/** Express backend API URL - for direct calls (admin, content, etc.) */
const BACKEND_BASE =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || ""
    : process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "";

/** Paths that use same-origin (Next.js API routes; auth/content proxy to backend) */
const PROXY_PATHS = ["/api/auth/", "/api/content/", "/api/admin/", "/api/inquiries"];

/**
 * Base URL for API calls.
 * Auth uses same-origin (Next.js proxy -> MongoDB backend).
 * Other APIs use backend URL when set.
 */
export function getApiBase(path: string = ""): string {
  if (PROXY_PATHS.some((p) => path.startsWith(p))) {
    return SAME_ORIGIN;
  }
  return BACKEND_BASE || SAME_ORIGIN;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("DVM JAPAN_token");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("DVM JAPAN_token", token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("DVM JAPAN_token");
}

/**
 * Call API. Points to Express backend when NEXT_PUBLIC_API_URL is set.
 * Backend returns { success, message, data }; errors have { success: false, message }.
 */
export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const base = getApiBase(path);
  const url = `${base}${path}`.replace(/([^:]\/)\/+/g, "$1");
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data?.message ||
      data?.error ||
      (Array.isArray(data?.errors) ? data.errors[0]?.message : null) ||
      "Request failed";
    throw new Error(typeof message === "string" ? message : "Request failed");
  }
  return data as T;
}
