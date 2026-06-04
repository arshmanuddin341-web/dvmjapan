"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { journeySteps } from "@/data/journeySteps";
import { sectionBackgroundImages } from "@/data/site-media";
import { sectionHeaderReveal, staggerRevealDramatic } from "@/lib/animations";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export default function JourneyOverviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return;
    const ctx = gsap.context(() => {
      sectionHeaderReveal(headerRef.current, { y: 32 });
      staggerRevealDramatic(gridRef.current, "> *", { stagger: 0.1, y: 44 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-transparent relative overflow-hidden" aria-labelledby="journey-heading">
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.2] pointer-events-none z-0" style={{ backgroundImage: `url(${sectionBackgroundImages[2]})` }} aria-hidden />
      <div className="absolute inset-0 bg-cinematic-base/55 pointer-events-none z-0" aria-hidden />
      <div className="container-custom relative z-10">
        <div ref={headerRef} className="max-w-4xl mx-auto text-center mb-6 md:mb-8 px-1">
          <h2 id="journey-heading" className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
            From First Message to Vehicle Arrival
          </h2>
          <p className="text-zinc-500 text-sm leading-relaxed">
            The full buyer journey, end to end—so nothing feels hidden.
          </p>
        </div>
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-6 gap-3 md:gap-4 max-w-5xl mx-auto">
          {journeySteps.map(({ step, label }) => (
            <div
              key={step}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col items-center text-center min-w-0 card-animate-hover"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 text-cyan-400 text-sm font-bold mb-3 shrink-0 animate-float-slow icon-glow-hover icon-pulse-hover">
                {step}
              </span>
              <p className="text-zinc-300 text-xs sm:text-[13px] leading-snug font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
