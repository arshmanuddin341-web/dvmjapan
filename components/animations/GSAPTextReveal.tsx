"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { textRevealSplit } from "@/lib/animations";

if (typeof window !== "undefined") {
  gsap.registerPlugin();
}

export interface GSAPTextRevealProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function GSAPTextReveal({
  children,
  className = "",
  as: Component = "h1",
}: GSAPTextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      textRevealSplit(ref.current);
    }
  }, [children]);

  const ComponentTag = Component as any;

  return (
    <ComponentTag ref={ref} className={className}>
      {children}
    </ComponentTag>
  );
}
