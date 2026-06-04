"use client";

import { useEffect, useRef, ReactNode } from "react";
import { scrollReveal, slideUp } from "@/lib/animations";

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      scrollReveal(ref.current, slideUp, {
        delay,
        once: true,
      });
    }
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
