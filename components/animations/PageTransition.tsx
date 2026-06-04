"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/animations";

/**
 * Simple wrapper for page content. No visibility toggle – content is always
 * visible and clickable. Kept for layout structure only.
 * Includes a very subtle global micro-vibration (1px, ~16s cycle) for premium feel.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || prefersReducedMotion()) return;
    const el = wrapperRef.current;
    if (!el) return;

    // Subtle motion – barely perceptible, respects reduced motion
    gsap.to(el, { x: 0.6, duration: 9, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(el, { y: 0.5, duration: 11, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });

    return () => gsap.killTweensOf(el);
  }, []);

  return (
    <div ref={wrapperRef} className="min-h-screen w-full min-w-0 overflow-x-hidden will-change-transform">
      {children}
    </div>
  );
}
