"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2 } from "lucide-react";
import { sectionHeaderReveal, staggerRevealDramatic } from "@/lib/animations";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

const operationalItems = [
  "Licensed access to Japanese auction houses",
  "Local team in Japan handling bidding & documentation",
  "Standardized process for sheets, grading, and export",
  "Secure payments & export documentation handling",
];

export default function OperationalProofSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (headerRef.current) sectionHeaderReveal(headerRef.current, { y: 28 });
      if (gridRef.current) staggerRevealDramatic(gridRef.current, "> *", { stagger: 0.15, y: 40 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-transparent" aria-labelledby="operational-heading">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div ref={headerRef} className="text-center mb-6 md:mb-8">
            <h2 id="operational-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
              How We Actually <span className="gradient-text">Operate</span>
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed">
              A real operation with systems, not just advisors.
            </p>
          </div>
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {operationalItems.map((item) => (
              <div
                key={item}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-4 min-w-0 card-cinematic card-animate-hover flex items-start gap-3"
              >
                <span className="shrink-0 w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center icon-glow-hover">
                  <CheckCircle2 className="h-4 w-4 text-teal-500" />
                </span>
                <p className="text-zinc-300 text-sm leading-relaxed font-medium pt-0.5">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
