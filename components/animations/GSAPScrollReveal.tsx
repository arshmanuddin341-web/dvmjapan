"use client";

import { useEffect, useRef, ReactNode } from "react";
import { sectionReveal } from "@/lib/animations";

export interface GSAPScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
}

export default function GSAPScrollReveal({
  children,
  className = "",
  delay = 0,
  duration,
  y,
}: GSAPScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const tween = sectionReveal(ref.current, { delay, duration, y });
      return () => {
        if (tween && tween.kill) {
          tween.kill();
        }
        // Also kill any ScrollTriggers associated with this element
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === ref.current) {
            trigger.kill();
          }
        });
      };
    }
  }, [delay, duration, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
