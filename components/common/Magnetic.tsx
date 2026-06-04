"use client";

import React, { useEffect, useRef } from "react";
import { magneticButton } from "@/lib/animations";

interface MagneticProps {
    children: React.ReactNode;
    strength?: number;
    className?: string;
}

export default function Magnetic({
    children,
    strength = 0.35,
    className = "",
}: MagneticProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const cleanup = magneticButton(ref.current, strength);
        return () => cleanup?.();
    }, [strength]);

    return (
        <div ref={ref} className={`inline-block ${className}`}>
            {children}
        </div>
    );
}
