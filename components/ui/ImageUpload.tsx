"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, ImageIcon, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";
import { getToken } from "@/lib/api-client";

export interface ImageUploadProps {
    /** Called with array of relative paths (e.g. /uploads/vehicles/xyz.jpg) after each successful upload batch */
    onUpload: (urls: string[]) => void;
    /** Already uploaded URLs to show as thumbnails */
    value?: string[];
    /** Button/label text */
    buttonLabel?: string;
    /** Optional class for the container */
    className?: string;
}

export default function ImageUpload({
    onUpload,
    value = [],
    buttonLabel = "Upload images",
    className = "",
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setError(null);
        setUploading(true);

        const newUrls: string[] = [];
        const token = getToken();

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    headers: {
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    },
                    body: formData,
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || `Failed to upload image ${i + 1}`);
                }

                const { urls } = await res.json();
                if (urls && urls.length > 0) {
                    newUrls.push(urls[0]);
                }
            }
            onUpload([...value, ...newUrls]);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Failed to upload images. Please try again.");
            // If some images were uploaded before error, we still add them
            if (newUrls.length > 0) {
                onUpload([...value, ...newUrls]);
            }
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [onUpload, value]);

    const removeImage = (urlToRemove: string) => {
        onUpload(value.filter((url) => url !== urlToRemove));
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept="image/*"
                multiple
                className="hidden"
            />

            {/* Upload Dropzone / Button */}
            <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${uploading
                    ? "border-slate-200 bg-slate-50 cursor-not-allowed"
                    : "border-slate-200 hover:border-teal-600/50 hover:bg-teal-50/30 bg-white"
                    }`}
            >
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className={`p-4 rounded-full transition-colors ${uploading ? "bg-slate-100 text-slate-400" : "bg-teal-50 text-teal-600 group-hover:bg-red-100"
                        }`}>
                        {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin" />
                        ) : (
                            <Upload className="h-8 w-8" />
                        )}
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                            {uploading ? "Uploading images..." : "Upload Vehicle Images"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                            JPG, PNG, WebP — Up to 5MB per file
                        </p>
                    </div>
                </div>

                {uploading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 flex items-center gap-3">
                            <Loader2 className="h-4 w-4 text-teal-600 animate-spin" />
                            <span className="text-xs font-bold text-slate-700 tracking-wide uppercase">Processing...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-50 border border-red-100 text-teal-700 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </div>
            )}

            {/* Image Preview Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                    {value.map((url, i) => (
                        <div
                            key={`${url}-${i}`}
                            className="group relative aspect-square rounded-xl border border-slate-200 bg-slate-50 overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                            <Image
                                src={url}
                                alt=""
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeImage(url);
                                    }}
                                    className="p-2 rounded-full bg-white text-slate-900 hover:bg-teal-600 hover:text-white transition-all shadow-lg transform hover:scale-110"
                                    title="Remove image"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                            {/* Index Badge */}
                            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-white/90 backdrop-blur-sm border border-slate-100 text-[10px] font-black text-slate-900">
                                #{i + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Success Tip */}
            {value.length > 0 && !uploading && (
                <div className="flex items-center gap-2 text-[10px] text-green-600 font-black uppercase tracking-widest pt-2 px-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {value.length} images added successfully
                </div>
            )}
        </div>
    );
}
