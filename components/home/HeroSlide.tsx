"use client";

import { useState, useEffect, useMemo } from "react";
import WatermarkedImage from "@/components/ui/WatermarkedImage";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { routes } from "@/config/routes";

import { useCurrency } from "@/context/CurrencyContext";
import Magnetic from "@/components/common/Magnetic";

interface HeroSlideItem {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  paragraph: string;
  ctaPrimary: string;
  ctaSecondary: string;
  ctaPrimaryHref: string;
  ctaSecondaryHref: string;
}

const HERO_SLIDES: HeroSlideItem[] = [
  {
    src: "/images/hero/luxury_car.png",
    alt: "Luxury Japanese car for export - DVM JAPAN",
    title: "Cars Delivered",
    subtitle: "Safely from Japan",
    paragraph: "Fully inspected. Auction-direct. Shipped worldwide.",
    ctaPrimary: "Browse Cars",
    ctaSecondary: "How It Works",
    ctaPrimaryHref: routes.inventory,
    ctaSecondaryHref: routes.about,
  },
  {
    src: "/images/hero/auction.png",
    alt: "Premium Japanese Auctions - DVM JAPAN",
    title: "Global Car Inventory",
    subtitle: "Direct From Auction",
    paragraph: "Access 150+ auction houses. We bid, we ship, you drive.",
    ctaPrimary: "Explore Auctions",
    ctaSecondary: "Auction Guide",
    ctaPrimaryHref: routes.auction,
    ctaSecondaryHref: routes.about,
  },
  {
    src: "/images/hero/shipping.png",
    alt: "Worldwide shipping of Japanese cars - DVM JAPAN",
    title: "Global Delivery",
    subtitle: "To Your Doorstep",
    paragraph: "50+ countries. Same quality, same trust, everywhere.",
    ctaPrimary: "Browse Cars",
    ctaSecondary: "Destinations",
    ctaPrimaryHref: routes.inventory,
    ctaSecondaryHref: routes.destinations,
  },
  {
    src: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=80",
    alt: "Certified used cars from Japan - High quality inspection",
    title: "Quality You Can Trust",
    subtitle: "Inspected & Ready",
    paragraph: "Every vehicle graded, documented, and cleared for export.",
    ctaPrimary: "View Inventory",
    ctaSecondary: "Contact Us",
    ctaPrimaryHref: routes.inventory,
    ctaSecondaryHref: routes.contact,
  },
  {
    src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=80",
    alt: "Import used cars from Japan seamlessly with DVM JAPAN",
    title: "Your Next Vehicle",
    subtitle: "Starts Here",
    paragraph: "Live inventory. Clear pricing. Expert support door to door.",
    ctaPrimary: "Browse Cars",
    ctaSecondary: "Get a Quote",
    ctaPrimaryHref: routes.inventory,
    ctaSecondaryHref: routes.contact,
  },
];

const SLIDE_DURATION_MS = 5000;

interface HeroApi {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  ctaPrimary?: string;
  ctaSecondary?: string;
}

export default function HeroSlide() {
  const { t } = useCurrency();
  const [activeIndex, setActiveIndex] = useState(0);
  const [heroFromApi, setHeroFromApi] = useState<HeroApi | null>(null);

  useEffect(() => {
    fetch("/api/content/hero")
      .then((res) => res.json())
      .then((json: { data?: HeroApi }) => {
        const d = json?.data;
        if (d && typeof d === "object" && (d.title || d.subtitle)) setHeroFromApi(d);
      })
      .catch(() => { });
  }, []);

  const displaySlides = useMemo((): HeroSlideItem[] => {
    if (!heroFromApi?.title && !heroFromApi?.subtitle) return HERO_SLIDES;
    return HERO_SLIDES.map((slide, i) =>
      i === 0
        ? {
          ...slide,
          title: heroFromApi?.title ?? t('hero_title'),
          subtitle: heroFromApi?.subtitle ?? t('hero_subtitle'),
          ctaPrimary: t('hero_cta_primary'),
          ctaSecondary: t('hero_cta_secondary')
        }
        : {
          ...slide,
          ctaPrimary: t('hero_cta_primary'),
          ctaSecondary: t('hero_cta_secondary')
        }
    );
  }, [heroFromApi]);

  const activeSlide = displaySlides[activeIndex];

  useEffect(() => {
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % displaySlides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(t);
  }, [displaySlides.length]);

  return (
    <section className="relative w-full h-[75vh] min-h-[500px] flex flex-col justify-center overflow-hidden">
      {/* Background slider */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === activeIndex ? 1 : 0, zIndex: 0 }}
        >
          <WatermarkedImage
            src={slide.src}
            alt={slide.alt}
            fill
            className={`transition-transform duration-[8000ms] ease-out ${i === activeIndex ? "scale-105" : "scale-100"}`}
          />
        </div>
      ))}

      {/* Premium Overlays */}
      <div className="absolute inset-0 bg-brand-navy/30 z-[1]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/10 to-transparent z-[2]" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/80 via-transparent to-transparent z-[2]" aria-hidden />

      <div className="container-custom relative z-10 w-full">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            key={`title-${activeIndex}`}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-400 text-xs font-semibold uppercase tracking-[0.2em] mb-6">
              Official Japanese Exporter
            </span>
            <h1 className="font-hero text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.2] tracking-tight text-white mb-5 text-balance">
              {activeSlide.title} <br />
              <span className="text-teal-400">{activeSlide.subtitle}</span>
            </h1>
            <p className="text-lg md:text-xl font-medium text-white/90 max-w-2xl leading-relaxed mb-8 tracking-wide">
              {activeSlide.paragraph}
            </p>

            <div className="flex flex-wrap gap-3">
              <Magnetic>
                <Link
                  href={activeSlide.ctaPrimaryHref}
                  className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-2xl hover:bg-teal-700 transition-all overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {activeSlide.ctaPrimary}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Link
                  href={activeSlide.ctaSecondaryHref}
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-white/30 bg-white/5 backdrop-blur-md px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 hover:border-white/50 transition-all"
                >
                  <PlayCircle className="h-4 w-4" />
                  {activeSlide.ctaSecondary}
                </Link>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Status Bar - Adjusted to be visible but not too high */}
      <div className="absolute bottom-20 right-10 z-20 hidden lg:flex items-center gap-8 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse" />
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">Global Status: Online</p>
        </div>
        <div className="h-8 w-px bg-white/20" />
        <div className="flex items-center gap-5">
          <div>
            <p className="text-[8px] text-white/50 uppercase tracking-tighter">Inventory</p>
            <p className="text-sm font-bold text-white tracking-widest">50,000+</p>
          </div>
          <div>
            <p className="text-[8px] text-white/50 uppercase tracking-tighter">Ports</p>
            <p className="text-sm font-bold text-white tracking-widest">Global</p>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-teal-500" : "w-1.5 bg-white/50 hover:bg-white/70"}`}
            onClick={() => setActiveIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
