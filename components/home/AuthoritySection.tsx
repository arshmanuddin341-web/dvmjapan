"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FileCheck, Shield, Ship, Building2, ArrowRight } from "lucide-react";
import { routes } from "@/config/routes";
import { sectionRevealPremium, staggerRevealPremium, sectionHeaderReveal, staggerRevealDramatic } from "@/lib/animations";
import { sectionBackgroundImages } from "@/data/site-media";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const blocks = [
  {
    icon: FileCheck,
    title: "How Japanese Auctions Really Work",
    content:
      "Japan's vehicle auctions (USS, TAA, CAA, and 120+ houses) run on a strict system. Each car gets an auction sheet (genjo) with a condition grade—e.g. 4.5B or 5—and a detailed report. Only licensed dealers and registered export agents can bid. We have direct access: our team in Yokohama attends and bids on your behalf. You see the same auction sheets we do, translated and explained, so you know exactly what you're buying before a single yen is committed.",
  },
  {
    icon: Shield,
    title: "Why Buying Through Us Is Safer Than Going Direct",
    content:
      "Direct bidding in Japan requires a local entity, language fluency, and familiarity with auction rules and export paperwork. One mistake on the auction sheet or export certificate can cost you. We act as your licensed buffer: we translate grades and damage codes, inspect vehicles when needed, and handle JEVIC (Japan Export Vehicle Inspection Center) certification and export documentation. You get a single point of contact, clear pricing in your currency, and no surprise fees—because we've done this for 15+ years and 10,000+ vehicles.",
  },
  {
    icon: Ship,
    title: "Inspection, Grading, Shipping & Export in Practice",
    content:
      "After a winning bid, we coordinate mechanical and document checks, then prepare the vehicle for export. JEVIC inspection (where required) is arranged by us. We secure the export certificate, commercial invoice, and Bill of Lading, and ship from Japanese ports (Yokohama, Kobe, Osaka) through established carriers. You receive full paperwork and tracking. Grading (e.g. 5, 4.5, 4) reflects the auction house's assessment; we explain every grade and any repair history so you can buy with confidence.",
  },
  {
    icon: Building2,
    title: "Why DVM JAPAN Is Trustworthy",
    content:
      "We are not a broker layer: we have a physical presence in Japan and direct contracts with auction houses. Every vehicle we offer has been sourced through official channels, with auction sheets and condition reports we stand behind. Our processes are ISO-aligned; payments are secure and traceable. We don't sell promises—we sell verified vehicles and complete export support. That's why dealers and private buyers in 50+ countries have used us for over a decade.",
  },
];

export default function AuthoritySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (headerRef.current) {
        sectionHeaderReveal(headerRef.current, { delay: 0, y: 40 });
      }
      if (gridRef.current) {
        staggerRevealDramatic(gridRef.current, "> *", {
          stagger: 0.15,
          delay: 0.12,
          y: 50,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-transparent relative overflow-hidden" aria-labelledby="authority-heading">
      <div className="absolute inset-0 bg-cover bg-center opacity-[0.2] pointer-events-none z-0" style={{ backgroundImage: `url(${sectionBackgroundImages[0]})` }} aria-hidden />
      <div className="absolute inset-0 bg-cinematic-base/60 pointer-events-none z-0" aria-hidden />
      <div className="container-custom relative z-10">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-6 md:mb-8 px-1">
          <span className="eyebrow mb-2 block">Japan Auction & Export Expertise</span>
          <h2 id="authority-heading" className="heading-section-mdk text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
            Why We Are Your <span className="gradient-text">Authority</span> on Japanese Auctions
          </h2>
          <p className="text-zinc-400 leading-relaxed text-xs sm:text-sm md:text-base break-words">
            Real access to Japanese auctions, real inspection and export handling—and a single team that makes it safe and transparent for you.
          </p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5" role="list">
          {blocks.map((block) => {
            const Icon = block.icon;
            return (
              <article
                key={block.title}
                className="card card-cinematic group p-4 sm:p-5 md:p-6 min-w-0 transition-all duration-500"
                role="listitem"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl border border-cyan-500/20 bg-cyan-500/5 flex items-center justify-center icon-glow-hover icon-pulse-hover animate-float-slow" aria-hidden="true">
                    <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-2 break-words">{block.title}</h3>
                    <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed break-words">{block.content}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 md:mt-10 pt-6 border-t border-white/[0.08] text-center">
          <p className="text-red-400/90 text-xs sm:text-sm font-medium mb-1">Real-time bidding via licensed Japan auction access.</p>
          <p className="text-zinc-500 text-[11px] sm:text-xs mb-3">Verification required · Export-only · Deposit to bid</p>
          <Link href={routes.contact} className="btn-primary btn-glow-pulse shadow-cyan-glow inline-flex items-center gap-1.5 cursor-pointer shrink-0" aria-label="Talk to a Japan auction expert" data-gsap-button>
            Talk to a Japan Auction Expert <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
          <p className="text-zinc-500 text-[11px] sm:text-xs mt-2.5 max-w-md mx-auto">
            For auction access or inspection reports. Export-only; deposit required to secure.
          </p>
        </div>
      </div>
    </section>
  );
}
