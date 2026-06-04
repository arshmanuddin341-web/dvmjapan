"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { routes } from "@/config/routes";

const cards = [
  {
    title: "Quality Sedans & Family Cars",
    subtitle: "From Japan to your market",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=90",
    cta: "View Stock",
    href: `${routes.inventory}?body=Sedan`,
  },
  {
    title: "Buy Your Car Straight to Your Door",
    subtitle: "Exporting to 65+ countries · Certified Exporters | 10k+ Cars Sold",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=90",
    cta: "Browse Cars",
    href: routes.inventory,
  },
  {
    title: "Japan Used Car Exporter",
    subtitle: "Premium selection from 120+ auction houses",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=90",
    cta: "Explore Inventory",
    href: routes.inventory,
  },
  {
    title: "Japan's Premier Automotive Exporter",
    subtitle: "Trusted worldwide since 2010",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=600&q=90",
    cta: "View All",
    href: routes.inventory,
  },
];

export default function HeroPromoCards() {
  return (
    <section className="container-custom relative z-10 pt-8 md:pt-12 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {cards.map((card, i) => (
          <Link
            key={i}
            href={card.href}
            className="group block rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-xl hover:border-teal-500/30 transition-all duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={card.image}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-bold text-sm md:text-base drop-shadow-md">
                  {card.title}
                </h3>
                {card.subtitle && (
                  <p className="text-white/90 text-xs mt-0.5 line-clamp-2">
                    {card.subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="p-4">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-semibold group-hover:bg-teal-700 transition-colors">
                {card.cta} <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
