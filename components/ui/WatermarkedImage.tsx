"use client";

import Image from "next/image";
import { useState } from "react";

interface WatermarkedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
    priority?: boolean;
    unoptimized?: boolean;
}

export default function WatermarkedImage({
    src,
    alt,
    className = "",
    width,
    height,
    fill,
    style,
    onClick,
    priority,
    unoptimized = true,
}: WatermarkedImageProps) {
    const [error, setError] = useState(false);

    const fallback = "/placeholder.jpg";
    const finalSrc = !src || error ? fallback : src;

    /* When fill=true the wrapper must be stretched to cover the parent.
       We use absolute-inset-0 so the parent's own size drives the layout. */
    const wrapperClass = fill
        ? `absolute inset-0 overflow-hidden group`
        : `relative overflow-hidden group ${className}`;

    return (
        <div className={wrapperClass} style={fill ? undefined : style} onClick={onClick}>
            <Image
                src={finalSrc}
                alt={alt}
                width={fill ? undefined : width}
                height={fill ? undefined : height}
                fill={fill}
                unoptimized={unoptimized}
                priority={priority}
                className={`object-cover transition-transform duration-500 group-hover:scale-105 ${fill ? className : ""}`}
                onError={() => setError(true)}
            />

            {/* DVM Japan branding badge – bottom-right */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded pointer-events-none select-none z-10">
                <img src="/logo.png" alt="DVM" className="h-3 w-auto" />
                <span className="text-[7px] font-bold text-white tracking-widest uppercase">Verified</span>
            </div>
        </div>
    );
}
