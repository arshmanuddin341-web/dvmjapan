"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, Globe, Clock, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { sectionRevealPremium, staggerRevealPremium, imageParallax } from "@/lib/animations";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const highlights = [
  {
    icon: Shield,
    title: "Comprehensive Vehicle Verification",
    desc: "Every vehicle undergoes rigorous multi-point inspection including mechanical assessment, body condition analysis, interior evaluation, and documentation verification. Our team in Yokohama personally inspects each vehicle before purchase, ensuring you receive accurate auction sheets, condition reports, and detailed photographs from multiple angles."
  },
  {
    icon: Globe,
    title: "Global Shipping Network",
    desc: "Established partnerships with major shipping lines enable seamless logistics to over 50 countries worldwide. We handle all export documentation, customs clearance preparation, and coordinate with port authorities in Japan and destination countries. Our optimized shipping routes ensure faster transit times and competitive freight rates."
  },
  {
    icon: Clock,
    title: "Expedited Processing",
    desc: "Streamlined operations and direct relationships with auction houses allow for rapid vehicle procurement and processing. Average time from purchase to shipment is 7-14 business days. Our dedicated logistics team monitors every shipment with real-time tracking updates until delivery at your destination port."
  },
  {
    icon: Award,
    title: "15 Years Industry Leadership",
    desc: "Since 2010, we've built an unparalleled reputation for transparency, reliability, and customer satisfaction. Our extensive experience navigating Japanese auction systems, international trade regulations, and customs procedures ensures smooth transactions. Over 10,000 successful vehicle exports demonstrate our commitment to excellence."
  },
];

export default function WhyChooseUs() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Left content reveal
      if (leftRef.current) {
        sectionRevealPremium(leftRef.current, { delay: 0 });
      }

      // Right image reveal
      if (rightRef.current) {
        sectionRevealPremium(rightRef.current, { delay: 0.15 });
      }

      // Highlights stagger reveal
      if (highlightsRef.current) {
        staggerRevealPremium(highlightsRef.current, "> *", {
          stagger: 0.1,
          delay: 0.2,
        });
      }

      // Image parallax (only on desktop and if motion is not reduced)
      if (imageRef.current && window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        imageParallax(imageRef.current, 0.3);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section bg-transparent" aria-labelledby="why-choose-us-heading">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 xl:gap-12 2xl:gap-12 items-center">
          <div ref={leftRef} className="min-w-0">
            <span className="eyebrow-mdk mb-2 block">Why Choose DVM JAPAN</span>
            <h2 id="why-choose-us-heading" className="heading-section-mdk text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight leading-tight">
              Your Trusted Partner for <span className="text-teal-600">Japanese Vehicle Imports</span>
            </h2>
            <p className="text-slate-800 mb-4 md:mb-6 max-w-lg leading-relaxed text-xs sm:text-sm md:text-base break-words">
              With over 15 years of expertise in the Japanese automotive export industry, DVM JAPAN has established itself as a premier vehicle import specialist. We combine deep market knowledge, extensive auction house relationships, and comprehensive logistics capabilities to deliver exceptional value. Our commitment to transparency means you receive detailed vehicle information, accurate pricing breakdowns, and complete documentation. From initial vehicle selection through final delivery, our dedicated team provides personalized support, ensuring a smooth and stress-free import experience. We've successfully facilitated over 10,000 vehicle exports to more than 50 countries, building trust through consistent delivery of quality vehicles and professional service.
            </p>

            <div ref={highlightsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 md:mb-6" role="list">
              {highlights.map((h) => {
                const Icon = h.icon;
                return (
                  <div
                    key={h.title}
                    className="group flex gap-2.5 sm:gap-3 min-w-0 p-2.5 rounded-xl border border-slate-200 hover:border-teal-500/30 transition-all duration-300 card-animate-hover bg-white"
                    role="listitem"
                  >
                    <div className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg border border-slate-200 bg-teal-500/10 flex items-center justify-center icon-glow-hover icon-pulse-hover animate-float-subtle" aria-hidden="true">
                      <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-teal-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 mb-0.5 break-words">{h.title}</h4>
                      <p className="text-[11px] sm:text-xs text-slate-800 break-words">{h.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href={routes.about} className="btn-primary inline-flex items-center gap-1.5 cursor-pointer" aria-label="Learn more about our heritage and company">
              Our Heritage <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div ref={rightRef} className="relative min-w-0">
            <div className="aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.03)] card-cinematic card-animate-hover">
              <img
                ref={imageRef}
                src="https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&q=92&w=1200"
                alt="Premium Japanese vehicles at auction warehouse in Yokohama, Japan"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 md:-right-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl max-w-[160px]">
              <div className="text-xl font-bold text-teal-600">99.8%</div>
              <div className="text-[9px] font-semibold text-slate-700 uppercase tracking-wider">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
