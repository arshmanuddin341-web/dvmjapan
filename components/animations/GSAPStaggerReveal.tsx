"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { staggerReveal } from "@/lib/animations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface GSAPStaggerRevealProps {
  children: ReactNode;
  className?: string;
  selector?: string;
  delay?: number;
  stagger?: number;
}

export default function GSAPStaggerReveal({
  children,
  className = "",
  selector = "> *",
  delay = 0,
  stagger,
}: GSAPStaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const timeline = staggerReveal(ref.current, selector, { delay, stagger });
      return () => {
        if (timeline && timeline.kill) {
          timeline.kill();
        }
        // Also kill any ScrollTriggers associated with this element
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.trigger === ref.current) {
            trigger.kill();
          }
        });
      };
    }
  }, [selector, delay, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
