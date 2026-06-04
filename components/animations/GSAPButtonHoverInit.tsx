"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { attachButtonHoverMicro } from "@/lib/animations";

/**
 * Attaches GSAP button hover micro-animations to .btn-primary, .btn-secondary,
 * and key CTA buttons. Re-runs on route change. Respects prefers-reduced-motion.
 */
export default function GSAPButtonHoverInit() {
  const pathname = usePathname();
  useEffect(() => {
    const cleanup = attachButtonHoverMicro(
      ".btn-primary, .btn-secondary, [data-gsap-button]"
    );
    return cleanup;
  }, [pathname]);
  return null;
}
