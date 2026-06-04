"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle2, Award, Shield, Globe, Sparkles } from "lucide-react";
import { sectionRevealPremium, staggerRevealPremium } from "@/lib/animations";
import { trustSectionImage, heroImages } from "@/data/site-media";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const trustPoints = [
  "Member of 120+ Japanese auction houses",
  "Official export documentation provider",
  "Verified by Japan Export Vehicle Inspection Center (JEVIC)",
  "ISO certified quality management",
  "Secure payment processing",
  "Full insurance coverage available",
  "15+ years in business",
  "5,000+ successful exports",
];

const stats = [
  { label: "Auction Houses", value: "120+", icon: Award },
  { label: "Years of Trust", value: "15Y+", icon: Shield },
  { label: "Global Ports", value: "80+", icon: Globe },
  { label: "Happy Clients", value: "10K+", icon: Sparkles },
];

export default function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (cardRef.current) {
        sectionRevealPremium(cardRef.current, { delay: 0 });
      }
      if (listRef.current) {
        staggerRevealPremium(listRef.current, "> *", {
          stagger: 0.06,
          delay: 0.1,
        });
      }
      if (statsGridRef.current) {
        staggerRevealPremium(statsGridRef.current, "> *", {
          stagger: 0.1,
          delay: 0.2,
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const content = (
    <>
      <section ref={sectionRef} className="section bg-transparent" aria-labelledby="trust-heading">
        <div className="container-custom">
          <div
            ref={cardRef}
            className="glass-card p-4 sm:p-5 md:p-8 lg:p-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 2xl:gap-10 items-center">
              <div className="min-w-0 order-2 lg:order-1">
                <span className="eyebrow-mdk mb-2 block">Verified Integrity</span>
                <h2 id="trust-heading" className="heading-section-mdk text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight">
                  Absolute <span className="text-teal-600">Certainty</span>
                </h2>
                <p className="text-slate-600 mb-4 md:mb-6 leading-relaxed text-xs sm:text-sm md:text-base break-words">
                  Every vehicle in our inventory undergoes rigorous multi-point inspection and certification from Japan&apos;s leading inspection authorities including JEVIC (Japan Export Vehicle Inspection Center). Our comprehensive verification process ensures complete transparency and confidence in every purchase. We maintain direct relationships with major Japanese auction houses, ensuring access to the finest vehicles available in the market. Our commitment to quality means we personally inspect each vehicle before purchase, verify all documentation, and provide detailed condition reports. With ISO-certified quality management systems, secure payment processing, and comprehensive insurance options, we provide the peace of mind that comes from working with an established, trusted partner in the Japanese vehicle export industry.
                </p>

                <ul
                  ref={listRef}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2"
                  role="list"
                >
                  {trustPoints.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-600 break-words min-w-0"
                      role="listitem"
                    >
                      <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-teal-600" aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div ref={statsRef} className="order-1 lg:order-2 space-y-4">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={trustSectionImage}
                    alt="Premium vehicles and auction quality"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = heroImages[0]; }}
                  />
                </div>
                <div ref={statsGridRef} className="grid grid-cols-2 gap-2.5 sm:gap-3" role="list">
                  {stats.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={s.label}
                        className="card p-2.5 sm:p-3 md:p-4 min-w-0"
                        role="listitem"
                      >
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 mb-1.5 sm:mb-2 shrink-0" aria-hidden="true" />
                        <div className="text-lg sm:text-xl font-bold text-slate-900 break-words">{s.value}</div>
                        <div className="text-[8px] sm:text-[9px] font-semibold text-teal-600 uppercase tracking-wider break-words">{s.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
  return content;
}
