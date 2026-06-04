"use client";

import { useEffect, useRef, ReactNode } from "react";
import { imageParallax } from "@/lib/animations";

export interface GSAPParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export default function GSAPParallax({
  children,
  className = "",
  speed = 0.5,
}: GSAPParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const tween = imageParallax(ref.current, speed);
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
  }, [speed]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
