"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routes } from "@/config/routes";
import { useCurrency } from "@/context/CurrencyContext";
import { staggerRevealPremium } from "@/lib/animations";

export default function ExploreOurCollection() {
  const { t } = useCurrency();
  const BLOCKS = [
    { label: t('new_arrivals'), query: "?sort=newest", emptyMsg: t('new_arrivals_msg') },
    { label: t('clearance'), query: "?clearance=1", emptyMsg: t('clearance_msg') },
    { label: t('premium'), query: "?grade=premium", emptyMsg: t('premium_msg') },
    { label: t('third_party'), query: "?source=third-party", emptyMsg: t('third_party_msg') },
  ];
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      staggerRevealPremium(gridRef.current, '> div');
    }
  }, []);
  return (
    <section className="section bg-white" aria-labelledby="explore-collection-heading">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
          <p className="eyebrow-mdk mb-0 text-teal-600 font-bold uppercase text-[10px] tracking-[0.3em]">{t('premium_selection')}</p>
          <Link
            href={routes.inventory}
            className="text-teal-600 hover:text-teal-700 font-semibold text-sm inline-flex items-center gap-1 shrink-0"
          >
            {t('see_more')} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <h2 id="explore-collection-heading" className="heading-section-mdk text-xl sm:text-2xl font-bold text-slate-900 mb-6 tracking-tight">
          {t('explore_collection')}
        </h2>

        {/* DVM JAPAN Group style: 4 separate blocks, not tabs */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {BLOCKS.map((block) => (
            <div
              key={block.label}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5 md:p-6 flex flex-col min-h-[140px] hover:border-teal-500/30 transition-all group"
            >
              <h3 className="text-sm font-bold text-slate-800 mb-2">{block.label}</h3>
              <p className="text-slate-500 text-sm mb-3 leading-relaxed">{block.emptyMsg}</p>
              <Link
                href={`${routes.inventory}${block.query}`}
                className="mt-auto text-teal-600 font-semibold text-sm hover:text-teal-700 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
              >
                {t('see_more')} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
