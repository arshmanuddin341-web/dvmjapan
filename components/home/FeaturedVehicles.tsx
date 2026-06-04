"use client";

import Link from "next/link";
import WatermarkedImage from "@/components/ui/WatermarkedImage";
import { useState, useRef, useEffect, useCallback } from "react";
import { formatMileage } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { routes } from "@/config/routes";
import { ArrowRight, MapPin, Fuel, Gauge, Share2, Heart, Loader2, ChevronLeft, ChevronRight, Car } from "lucide-react";
import type { Vehicle } from "@/types";

const AUTOPLAY_MS = 3500;

export default function FeaturedVehicles({ activeFilters }: { activeFilters?: any }) {
  const { convertPrice, t } = useCurrency();
  const [featured, setFeatured] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [current, setCurrent] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchFeatured = useCallback(async () => {
    try {
      const p = new URLSearchParams();
      p.set("limit", "12");
      p.set("sort", "createdAt");
      p.set("order", "desc");

      const hasFilters = activeFilters && (
        activeFilters.make ||
        activeFilters.model ||
        activeFilters.yearFrom ||
        activeFilters.yearTo ||
        activeFilters.query
      );

      setIsFiltering(!!hasFilters);

      if (activeFilters) {
        if (activeFilters.make) p.set("make", activeFilters.make);
        if (activeFilters.model) p.set("model", activeFilters.model);
        if (activeFilters.yearFrom) p.set("minYear", activeFilters.yearFrom);
        if (activeFilters.yearTo) p.set("maxYear", activeFilters.yearTo);
        if (activeFilters.query) p.set("q", activeFilters.query);
      }

      const res = await fetch(`/api/vehicles?${p.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const mapped = (data.vehicles || []).map((v: any) => ({
          id: v.id,
          stockId: v.stockId,
          make: v.make,
          model: v.model,
          year: v.year,
          price: { fob: v.price, cif: v.priceCif, currency: v.currency },
          engine: { displacement: "", type: "", fuel: v.fuelType },
          transmission: v.transmission,
          mileage: v.mileage,
          color: v.color,
          auctionGrade: v.auctionGrade,
          condition: v.condition,
          images: Array.isArray(v.images) ? v.images : [],
          location: v.location,
          features: v.features,
          description: v.description,
          bodyType: v.bodyType || "",
          driveType: v.driveType || "",
        }));
        setFeatured(mapped);
        setCurrent(0); // Reset carousel
      }
    } catch (err) {
      console.error("Failed to fetch featured vehicles", err);
    } finally {
      setLoading(false);
    }
  }, [activeFilters]);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setVisibleCount(1);
      else if (w < 900) setVisibleCount(2);
      else if (w < 1280) setVisibleCount(3);
      else setVisibleCount(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const maxIndex = Math.max(0, featured.length - visibleCount);

  const next = useCallback(() => {
    setCurrent(i => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrent(i => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  // Auto-play
  useEffect(() => {
    if (maxIndex <= 0) return;
    autoRef.current = setInterval(next, AUTOPLAY_MS);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [next, maxIndex]);

  const stopAutoplay = () => { if (autoRef.current) clearInterval(autoRef.current); };
  const startAutoplay = () => {
    stopAutoplay();
    if (maxIndex > 0) {
      autoRef.current = setInterval(next, AUTOPLAY_MS);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (featured.length === 0) {
    if (isFiltering) {
      return (
        <div className="py-12 px-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl mx-auto max-w-lg">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Car className="h-6 w-6 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No matches found</h3>
          <p className="text-sm text-slate-500 mt-1">Try adjusting your filters to see more results.</p>
        </div>
      );
    }
    return null;
  }

  // Calculate card width based on container
  const gapPx = 20;
  const cardWidthPct = `calc(${100 / visibleCount}% - ${(gapPx * (visibleCount - 1)) / visibleCount}px)`;
  const translateX = `calc(-${current * (100 / visibleCount)}% - ${current * gapPx / visibleCount}px)`;

  return (
    <div className="relative" onMouseEnter={stopAutoplay} onMouseLeave={startAutoplay}>
      {/* Slider Track */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ gap: `${gapPx}px`, transform: `translateX(${translateX})` }}
        >
          {featured.map((vehicle) => (
            <article
              key={vehicle.id}
              className="flex-shrink-0"
              style={{ width: cardWidthPct }}
            >
              <Link
                href={routes.vehicleDetail(vehicle.id)}
                className="block bg-white rounded-xl border border-slate-200 overflow-hidden group shadow-sm hover:shadow-md hover:border-teal-400/40 transition-all duration-300 card-shine-hover"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100">
                  <WatermarkedImage
                    src={vehicle.images?.[0] || ""}
                    alt={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
                    fill
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 rounded-md px-2 py-0.5 bg-teal-700 text-white text-[9px] font-bold uppercase tracking-wider z-10">
                    Featured
                  </span>
                  {vehicle.year && (
                    <span className="absolute top-3 right-3 rounded-md px-2 py-0.5 bg-black/50 backdrop-blur-sm text-white text-[9px] font-bold z-10">
                      {vehicle.year}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mb-1">
                    <MapPin className="h-3 w-3 text-teal-500 shrink-0" />
                    {vehicle.location}
                  </div>
                  <h3 className="font-semibold text-slate-900 text-[13px] mb-2 group-hover:text-teal-600 transition-colors truncate leading-snug">
                    {vehicle.make} {vehicle.model}
                  </h3>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Fuel className="h-3 w-3 text-slate-300" />
                      {vehicle.engine.fuel}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="h-3 w-3 text-slate-300" />
                      {formatMileage(vehicle.mileage)} km
                    </span>
                    <span className="text-slate-400 font-medium tracking-tight uppercase text-[9px] border border-slate-200 px-1.5 py-0.5 rounded">
                      {vehicle.transmission}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-medium leading-none mb-1">{t('fob_price')}</p>
                      <p className="text-slate-900 font-bold text-base leading-none">
                        {convertPrice(vehicle.price.fob)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                        aria-label="Share"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Share2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                        aria-label="Add to favourites"
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="h-3.5 w-3.5" />
                      </button>
                      <span className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-teal-600 text-white text-[11px] font-semibold group-hover:bg-teal-700 transition-colors">
                        View <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Prev / Next Arrows */}
      {maxIndex > 0 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous"
            className="absolute -left-4 top-[38%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="absolute -right-4 top-[38%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${current === i
                ? "w-6 h-2 bg-teal-600"
                : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
