"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { routes } from "@/config/routes";

const slides = [
  {
    tag: "Direct from Japan, no drama",
    title: "The right car, shipped from Japan to your port",
    subtitle: "We shortlist, inspect, and ship — you choose and drive.",
    cta: "Explore Stock",
    image: "/images/hero/luxury_car.png",
    imageAlt: "Premium Japanese vehicles for export",
  },
  {
    tag: "Access to 120+ auctions",
    title: "One team, the entire Japanese auction network",
    subtitle: "USS, TAA, CAA and 50,000+ weekly listings, filtered for your budget.",
    cta: "View Inventory",
    image: "/images/hero/auction.png",
    imageAlt: "Japanese vehicle auction network",
  },
  {
    tag: "Based in Yokohama, serving 50+ countries",
    title: "Local Japanese team, global delivery",
    subtitle: "We handle the language, paperwork, and shipping so you don’t have to.",
    cta: "About DVM JAPAN",
    href: routes.about,
    image: "/images/hero/shipping.png",
    imageAlt: "International vehicle shipping",
  },
  {
    tag: "Sedans, SUVs, vans & hybrids",
    title: "Hand‑picked stock for families, dealers, and fleets",
    subtitle: "Tell us how you’ll use the car — we suggest real options, not just links.",
    cta: "Browse Stock",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=90",
    imageAlt: "Luxury and everyday Japanese cars",
  },
  {
    tag: "Since 2010",
    title: "DVM JAPAN customers come back for their second and third car",
    subtitle: "Clear pricing in your currency, proper documents, and people who answer your messages.",
    cta: "Explore Stock",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=90",
    imageAlt: "Trusted vehicle export partner",
  },
];

const AUTOPLAY_MS = 6000;

export default function ModernHero() {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    const t = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [goNext]);

  const slide = slides[index];

  return (
    <section className="relative min-h-[70vh] sm:min-h-[75vh] flex flex-col justify-center overflow-hidden bg-white pt-14 md:pt-16" aria-labelledby="hero-heading">
      {/* Red & blue wavy shapes at bottom - DVM JAPAN Group style */}
      <div className="absolute bottom-0 left-0 right-0 h-[45%] min-h-[280px] pointer-events-none z-0" aria-hidden>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-teal-500/15 via-teal-500/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[60%] h-full bg-gradient-to-t from-slate-200/30 via-transparent to-transparent" />
        <svg className="absolute bottom-0 left-0 w-full h-32 text-teal-500/20" viewBox="0 0 1440 120" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 120L48 110C96 100 192 80 288 70C384 60 480 60 576 65C672 70 768 80 864 85C960 90 1056 90 1152 85C1248 80 1344 70 1392 65L1440 60V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0Z" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-full h-24 text-teal-600/10" viewBox="0 0 1440 80" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 80L60 75C120 70 240 60 360 55C480 50 600 50 720 55C840 60 960 70 1080 72C1200 75 1320 70 1380 67L1440 65V80H0Z" />
        </svg>
      </div>

      <div className="container-custom relative z-10 w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[60vh]">
          {/* Left: Slider content */}
          <div className="max-w-xl relative min-h-[280px] sm:min-h-[320px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <div className="inline-block rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white mb-4 uppercase tracking-wide">
                  {slide.tag}
                </div>
                <h1
                  id="hero-heading"
                  className="heading-section-mdk text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-4"
                >
                  {slide.title}
                </h1>
                <p className="text-slate-800 text-base md:text-lg mb-6">
                  {slide.subtitle}
                </p>
                <Link
                  href={slide.href ?? routes.inventory}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {slide.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Slider image */}
          <div className="relative hidden lg:block h-[320px] xl:h-[380px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xl"
              >
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 0vw, 50vw"
                  priority={index === 0}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-teal-500/20 rounded-2xl transform rotate-12 pointer-events-none" aria-hidden />
            <div className="absolute bottom-8 right-8 w-16 h-16 bg-teal-600/30 rounded-xl transform -rotate-6 pointer-events-none" aria-hidden />
          </div>
        </div>

        {/* Slider controls: arrows + dots */}
        <div className="flex items-center justify-between gap-4 mt-6 lg:mt-8">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all duration-mdk cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="w-10 h-10 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-all duration-mdk cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center gap-2" role="tablist" aria-label="Slider dots">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${i === index ? "bg-teal-600 w-8" : "bg-slate-300 hover:bg-slate-400"
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
