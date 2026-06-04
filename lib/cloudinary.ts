/**
 * Cloudinary helpers for DVM JAPAN.
 * Use for building image URLs and (on server) signing uploads.
 * Set in .env: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_SECRET (and API key if needed).
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

export function getCloudinaryCloudName(): string | undefined {
  return CLOUD_NAME || undefined;
}

/** Check if Cloudinary is configured (for conditional UI). */
export function isCloudinaryConfigured(): boolean {
  return Boolean(CLOUD_NAME);
}

/**
 * Build a Cloudinary image URL (no upload, just display).
 * Use when you already have public_id or full URL from Cloudinary.
 */
export function cloudinaryUrl(publicId: string, options?: { width?: number; height?: number; crop?: string }): string {
  if (!CLOUD_NAME) return "";
  const opts = options || {};
  const w = opts.width ? `w_${opts.width}` : "";
  const h = opts.height ? `h_${opts.height}` : "";
  const crop = opts.crop || "fill";
  const transforms = [w, h, crop].filter(Boolean).join(",");
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  if (publicId.startsWith("http")) return publicId;
  if (transforms) return `${base}/${transforms}/${publicId}`;
  return `${base}/${publicId}`;
}

/**
 * Server-only: generate upload signature and timestamp for unsigned/signed widget.
 * Use from API route GET /api/upload/sign (or similar).
 */
export function getUploadSignature(params: Record<string, unknown>): { signature: string; timestamp: number } | null {
  if (typeof API_SECRET !== "string" || !API_SECRET) return null;
  const timestamp = Math.round(Date.now() / 1000);
  const crypto = require("crypto");
  const sorted = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  const signature = crypto.createHmac("sha1", API_SECRET).update(sorted).digest("hex");
  return { signature, timestamp };
}
