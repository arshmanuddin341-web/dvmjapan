"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, FileCheck } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { sectionBackgroundImages } from "@/data/site-media";
import { staggerRevealDramatic } from "@/lib/animations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const whyTrustBullets = [
  "Direct auction access",
  "Translated sheets/grades",
  "No surprise fees",
  "Export-only/as-is",
];

const processTransparencyBullets = [
  "Verification before deposit",
  "You control budget/limit",
  "We handle monitoring/translation/export",
  "Documented steps",
];

export default function HighTicketReassuranceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;
    const ctx = gsap.context(() => {
      staggerRevealDramatic(gridRef.current, "> *", { stagger: 0.2, y: 50 });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section section-elevated py-12 md:py-14 relative overflow-hidden" aria-labelledby="high-ticket-heading">
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.18] pointer-events-none z-0" style={{ backgroundImage: `url(${sectionBackgroundImages[4]})` }} aria-hidden />
      <div className="absolute inset-0 bg-cinematic-base/55 pointer-events-none z-0" aria-hidden />
      <div className="container-custom relative z-10">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Why Serious Buyers Trust Us */}
          <div className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 md:p-6 min-w-0 card-animate-hover">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-10 h-10 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center icon-glow-hover icon-pulse-hover animate-float-slow">
                <Shield className="h-5 w-5 text-red-400" />
              </div>
              <h2 id="high-ticket-heading" className="text-lg md:text-xl font-bold text-white tracking-tight pt-1.5">
                Why Serious Buyers Trust Us
              </h2>
            </div>
            <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed list-none mb-4">
              {whyTrustBullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-teal-500/80 mt-0.5 shrink-0" aria-hidden="true">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Talk to a Japan auction expert when you&apos;re ready—verification and next steps explained before any commitment.
            </p>
          </div>

          {/* Process Transparency for Importers */}
          <div className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 md:p-6 min-w-0 transition-all duration-500 hover:border-cyan-500/25 hover:shadow-cyan-glow hover:-translate-y-1">
            <div className="flex items-start gap-3 mb-4">
              <div className="shrink-0 w-10 h-10 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center icon-glow-hover icon-pulse-hover transition-shadow duration-300">
                <FileCheck className="h-5 w-5 text-red-400" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-white tracking-tight pt-1.5">
                Process Transparency for Importers
              </h2>
            </div>
            <ul className="space-y-2 text-zinc-400 text-sm leading-relaxed list-none mb-4">
              {processTransparencyBullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-teal-500/80 mt-0.5 shrink-0" aria-hidden="true">·</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-zinc-500 text-xs leading-relaxed">
              <Link href={routes.contact} className="text-red-400/90 hover:text-red-400 font-medium underline underline-offset-2">
                Request auction access
              </Link>
              {"—we confirm eligibility and outline the full process before deposit."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
