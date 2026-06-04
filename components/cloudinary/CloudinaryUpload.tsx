"use client";

import { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import { Upload, ImageIcon } from "lucide-react";

const WIDGET_SCRIPT = "https://widget.cloudinary.com/v2.0/global/all.js";

declare global {
  interface Window {
    cloudinary?: {
      openUploadWidget: (
        options: Record<string, unknown>,
        callback: (error: unknown, result: { event: string; info?: { files?: Array<{ uploadInfo?: { secure_url?: string } }> } }) => void
      ) => { open: () => void; close: () => void };
    };
  }
}

export interface CloudinaryUploadProps {
  /** Called with array of secure_url strings after each successful upload batch */
  onUpload: (urls: string[]) => void;
  /** Already uploaded URLs to show as thumbnails */
  value?: string[];
  /** Optional folder in Cloudinary */
  folder?: string;
  /** Max files per open (default many) */
  maxFiles?: number;
  /** Button/label text */
  buttonLabel?: string;
  /** Optional class for the container */
  className?: string;
}

export default function CloudinaryUpload({
  onUpload,
  value = [],
  folder = "DVM JAPAN/vehicles",
  maxFiles = 20,
  buttonLabel = "Upload images",
  className = "",
}: CloudinaryUploadProps) {
  const [widgetReady, setWidgetReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

  const getSignature = useCallback(async () => {
    const res = await fetch("/api/upload/sign", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to get upload signature");
    return res.json() as Promise<{ signature: string; timestamp: number }>;
  }, []);

  const openWidget = useCallback(async () => {
    if (!cloudName || !apiKey) {
      alert("Cloudinary is not configured. In Vercel: add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, NEXT_PUBLIC_CLOUDINARY_API_KEY (and CLOUDINARY_API_SECRET for uploads).");
      return;
    }
    if (!widgetReady || !window.cloudinary?.openUploadWidget) {
      return;
    }

    try {
      await getSignature();
    } catch {
      alert("Upload signature failed. Add CLOUDINARY_API_SECRET in Vercel Environment Variables (Production) and redeploy.");
      return;
    }

    const options: Record<string, unknown> = {
      cloudName,
      apiKey,
      uploadSignature: getSignature,
      folder,
      maxFiles,
      multiple: true,
      resourceType: "image",
      clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "gif"],
    };

    const widget = window.cloudinary.openUploadWidget(options, (err: unknown, result: { event?: string; info?: { files?: Array<{ uploadInfo?: { secure_url?: string } }> } }) => {
      if (err) return;
      if (result?.event === "success" && result.info?.files?.length) {
        const urls = result.info.files
          .map((f) => f.uploadInfo?.secure_url)
          .filter((u): u is string => Boolean(u));
        if (urls.length) onUpload([...value, ...urls]);
      }
    });
    if (widget?.open) widget.open();
  }, [widgetReady, cloudName, apiKey, getSignature, folder, maxFiles, onUpload, value]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => {
      if (window.cloudinary?.openUploadWidget) {
        setWidgetReady(true);
        return true;
      }
      return false;
    };
    if (check()) return;
    const t = setInterval(() => {
      if (check()) clearInterval(t);
    }, 200);
    return () => clearInterval(t);
  }, []);

  const onScriptLoad = useCallback(() => {
    setTimeout(() => {
      if (typeof window !== "undefined" && window.cloudinary?.openUploadWidget) {
        setWidgetReady(true);
      }
    }, 150);
  }, []);

  return (
    <>
      <Script
        src={WIDGET_SCRIPT}
        strategy="afterInteractive"
        onLoad={onScriptLoad}
      />
      <div className={className}>
        {value.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {value.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className="relative h-16 w-16 rounded-lg border border-gray-300 bg-gray-100 overflow-hidden"
              >
                <img
                  src={url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center">
          <Upload className="h-10 w-10 md:h-12 md:w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 mb-1 font-semibold">Upload to Cloudinary</p>
          <p className="text-sm text-gray-500 mb-3">PNG, JPG, WebP up to 10MB each</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-left">
            <p className="text-xs font-semibold text-amber-800 mb-1">Popup open hone ke baad ye karo:</p>
            <ol className="text-xs text-amber-900 list-decimal list-inside space-y-0.5">
              <li>Popup ke andar <strong>khali white area</strong> pe click karo, ya &quot;Upload more&quot; pe click karo</li>
              <li>Apne PC se images <strong>select</strong> karo (multiple select ho sakti hain)</li>
              <li>Jab list mein images aa jayein, upload start hoga — &quot;0 assets&quot; se 1, 2, 3… ho jayega</li>
              <li>Upload khatam hone ke baad &quot;Done&quot; dabao</li>
            </ol>
          </div>
          <button
            type="button"
            onClick={openWidget}
            disabled={!widgetReady}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            <ImageIcon className="h-4 w-4" />
            {widgetReady ? buttonLabel : "Loading widget…"}
          </button>
          {!widgetReady && !loadFailed && (
            <p className="text-xs text-gray-500 mt-2">One moment, Cloudinary widget is loading…</p>
          )}
          {loadFailed && (
            <p className="text-xs text-amber-700 mt-2">Widget did not load. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_API_KEY in Vercel, or disable ad blockers and refresh.</p>
          )}
        </div>
      </div>
    </>
  );
}
