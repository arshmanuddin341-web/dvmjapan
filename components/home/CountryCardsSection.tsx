"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { routes } from "@/config/routes";
import { staggerRevealPremium } from "@/lib/animations";

function formatCount(n: number): string {
  if (n <= 0) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}+`;
}

/* Explore Global Stock: UK, Zambia, Zimbabwe, Tanzania, Kenya, Ireland, Jamaica only */
const countries = [
  { name: "UK", slug: "uk", fallbackCount: "80+", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80", alt: "United Kingdom" },
  { name: "ZAMBIA", slug: "zambia", fallbackCount: "40+", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80", alt: "Zambia" },
  { name: "ZIMBABWE", slug: "zimbabwe", fallbackCount: "30+", image: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?auto=format&fit=crop&w=800&q=80", alt: "Zimbabwe" },
  { name: "TANZANIA", slug: "tanzania", fallbackCount: "50+", image: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80", alt: "Tanzania" },
  { name: "KENYA", slug: "kenya", fallbackCount: "60+", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80", alt: "Kenya" },
  { name: "IRELAND", slug: "ireland", fallbackCount: "45+", image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=80", alt: "Ireland" },
  { name: "JAMAICA", slug: "jamaica", fallbackCount: "40+", image: "/images/destinations/jamaica.png", alt: "Jamaica" },
];

export default function CountryCardsSection() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/destinations/counts")
      .then((res) => res.ok ? res.json() : {})
      .then((data) => setCounts(data || {}))
      .catch(() => setCounts({}));
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      staggerRevealPremium(gridRef.current, 'a');
    }
  }, []);

  return (
    <section className="section bg-white" aria-labelledby="country-cards-heading">
      <div className="container-custom">
        {/* DVM JAPAN Group centered header: red line + dark blue title */}
        <div className="text-center mb-5 md:mb-7">
          <p className="eyebrow-mdk mb-1 text-[10px] tracking-[0.3em]">Explore Top Spots With The Best Car Options</p>
          <h2 id="country-cards-heading" className="heading-section-mdk text-xl sm:text-2xl md:text-3xl font-bold text-brand-navy tracking-tight">
            Explore Global Stock
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {countries.map((country) => {
            const num = counts[country.slug] ?? 0;
            const displayCount = num > 0 ? formatCount(num) : country.fallbackCount;
            return (
              <Link
                key={country.slug}
                href={routes.countryDetail(country.slug)}
                className="group block relative aspect-[4/3] rounded-xl overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 bg-slate-100 card-shine-hover"
              >
                <Image
                  src={country.image}
                  alt={country.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <div className="text-white font-bold text-base leading-tight mb-1">
                    {displayCount}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-sky-400 text-white shrink-0" aria-hidden>
                      <MapPin className="h-3 w-3" />
                    </span>
                    <span className="text-white font-semibold text-xs md:text-sm">
                      {country.name}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
