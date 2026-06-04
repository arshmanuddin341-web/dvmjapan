"use client";

import { useState } from "react";
import HeroSlide from "@/components/home/HeroSlide";
import HomeSearchHub from "@/components/home/HomeSearchHub";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import ExploreOurCollection from "@/components/home/ExploreOurCollection";
import CountryCardsSection from "@/components/home/CountryCardsSection";
import PopularTagsSection from "@/components/home/PopularTagsSection";
import CarBodyShapesAndBrandsSection from "@/components/home/CarBodyShapesAndBrandsSection";
import GlobalHubSection from "@/components/home/GlobalHubSection";
import StatsSection from "@/components/home/StatsSection";
import BuyerQuestionsSection from "@/components/home/BuyerQuestionsSection";
import HomeBlogSection from "@/components/home/HomeBlogSection";
import Testimonials from "@/components/home/Testimonials";
import { useCurrency } from "@/context/CurrencyContext";
import Reveal from "@/components/common/Reveal";

export default function HomePage() {
  const { t } = useCurrency();
  const [filters, setFilters] = useState<any>({});

  return (
    <div className="relative w-full min-w-0 overflow-x-hidden bg-white">
      <HeroSlide />
      <HomeSearchHub onFilterChange={setFilters} />

      <section className="bg-white py-8 md:py-14 -mt-6 relative z-20">
        <div className="container-custom">
          <Reveal className="flex flex-col items-center text-center max-w-2xl mx-auto mb-8">
            <span className="text-teal-600 font-semibold text-[10px] uppercase tracking-[0.35em] mb-3">Marketplace</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              DVM JAPAN <span className="text-teal-600">{t('premium_collections')}</span>
            </h1>
            <p className="mt-2 text-slate-500 text-sm">
              {t('marketplace_subtitle')}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <FeaturedVehicles activeFilters={filters} />
          </Reveal>
        </div>
      </section>

      <div className="bg-slate-50 py-12">
        <Reveal>
          <ExploreOurCollection />
        </Reveal>
      </div>

      <section className="py-10 bg-white">
        <div className="container-custom mb-5">
          <Reveal>
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-teal-600 pl-3 uppercase tracking-tight">{t('explore_by_region')}</h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <CountryCardsSection />
        </Reveal>
      </section>

      <Reveal>
        <CarBodyShapesAndBrandsSection />
      </Reveal>

      <div className="bg-brand-navy py-12">
        <Reveal>
          <StatsSection />
        </Reveal>
      </div>

      <Reveal>
        <GlobalHubSection />
      </Reveal>

      <div className="bg-slate-50 py-12">
        <Reveal>
          <BuyerQuestionsSection />
        </Reveal>
      </div>

      <Reveal>
        <HomeBlogSection />
      </Reveal>

      <Reveal>
        <Testimonials />
      </Reveal>
    </div>
  );
}
