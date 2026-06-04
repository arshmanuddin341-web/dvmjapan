"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { formatMileage } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { ArrowRight, MapPin, Filter, X, Search, Sparkles, TrendingUp, Grid3x3, List, SortAsc, ChevronDown, Fuel, Gauge, Calendar, Loader2 } from "lucide-react";
import AdvancedFilters from "./AdvancedFilters";
import TotalPriceCalculator from "./TotalPriceCalculator";
import { FilterState, type FilterOptions } from "@/types/inventory";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import WatermarkedImage from "@/components/ui/WatermarkedImage";
import { routes } from "@/config/routes";
import type { Vehicle } from "@/types";
import { getAllMakes, getModelsByMake } from "@/data/vehicles";

function mapApiVehicleToFrontend(v: {
  id: string;
  stockId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  priceCif?: number | null;
  currency: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType?: string | null;
  auctionGrade?: string | null;
  condition?: string | null;
  driveType?: string | null;
  engineSize?: number | null;
  color: string;
  location: string;
  images: string[];
  description: string;
  features: string[];
  chassis?: string | null;
}): Vehicle {
  const imgs = Array.isArray(v.images) ? v.images : [];
  return {
    id: v.id,
    stockId: v.stockId,
    make: v.make,
    model: v.model,
    year: v.year,
    price: { fob: v.price, cif: v.priceCif ?? undefined, currency: v.currency },
    engine: { displacement: (v.engineSize || 0).toString(), type: "", fuel: v.fuelType },
    transmission: v.transmission,
    mileage: v.mileage,
    color: v.color,
    images: imgs.length ? imgs : ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"],
    bodyType: v.bodyType || "",
    driveType: v.driveType || "",
    auctionGrade: v.auctionGrade || "",
    condition: v.condition || "",
    location: v.location,
    features: Array.isArray(v.features) ? v.features : [],
    description: v.description || "",
    chassis: v.chassis ?? undefined,
  };
}

type ViewMode = "grid" | "list";
type SortBy = "newest" | "price-low" | "price-high" | "year" | "mileage";

export default function InventoryPage() {
  const searchParams = useSearchParams();
  const { convertPrice, t } = useCurrency();
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("newest");
  const [filters, setFilters] = useState<FilterState>({
    make: "",
    model: "",
    minYear: "",
    maxYear: "",
    minPrice: "",
    maxPrice: "",
    fuel: "",
    transmission: "",
    minMileage: "",
    maxMileage: "",
    bodyType: "",
    color: "",
    location: "",
    stockId: "",
    minCC: "",
    maxCC: "",
  });

  const [apiVehicles, setApiVehicles] = useState<Vehicle[] | null>(null);
  const [apiTotal, setApiTotal] = useState<number | null>(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);

  // Live filter options from API (Refine sidebar dropdowns)
  useEffect(() => {
    fetch("/api/vehicles/filters", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { makes?: string[]; transmissions?: string[]; fuelTypes?: string[]; locations?: string[] } | null) => {
        if (data && (data.makes?.length || data.transmissions?.length || data.fuelTypes?.length || data.locations?.length)) {
          setFilterOptions({
            makes: data.makes ?? [],
            models: [],
            transmissions: data.transmissions ?? [],
            fuelTypes: data.fuelTypes ?? [],
            locations: data.locations ?? [],
            bodyTypes: (data as any).bodyTypes ?? [],
            colors: (data as any).colors ?? [],
            driveTypes: (data as any).driveTypes ?? [],
            auctionGrades: (data as any).auctionGrades ?? [],
            conditions: (data as any).conditions ?? [],
          });
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!filters.make) {
      setFilterOptions((prev) => (prev ? { ...prev, models: [] } : null));
      return;
    }
    fetch(`/api/vehicles/filters?make=${encodeURIComponent(filters.make)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { models?: string[] } | null) => {
        const models = Array.isArray(data?.models) ? data.models : [];
        setFilterOptions((prev) => (prev ? { ...prev, models } : { makes: [], models, transmissions: [], fuelTypes: [], locations: [] }));
      })
      .catch(() => setFilterOptions((prev) => (prev ? { ...prev, models: [] } : null)));
  }, [filters.make]);

  // Load filters from URL params
  useEffect(() => {
    if (searchParams) {
      const urlFilters: Partial<FilterState> = {};
      if (searchParams.get("make")) urlFilters.make = searchParams.get("make") || "";
      if (searchParams.get("model")) urlFilters.model = searchParams.get("model") || "";
      if (searchParams.get("bodyType")) urlFilters.bodyType = searchParams.get("bodyType") || "";
      if (searchParams.get("fuel")) urlFilters.fuel = searchParams.get("fuel") || "";
      if (searchParams.get("minYear")) urlFilters.minYear = searchParams.get("minYear") || "";
      if (searchParams.get("maxYear")) urlFilters.maxYear = searchParams.get("maxYear") || "";
      if (searchParams.get("minPrice")) urlFilters.minPrice = searchParams.get("minPrice") || "";
      if (searchParams.get("maxPrice")) urlFilters.maxPrice = searchParams.get("maxPrice") || "";
      if (searchParams.get("transmission")) urlFilters.transmission = searchParams.get("transmission") || "";
      if (searchParams.get("minMileage")) urlFilters.minMileage = searchParams.get("minMileage") || "";
      if (searchParams.get("maxMileage")) urlFilters.maxMileage = searchParams.get("maxMileage") || "";
      if (searchParams.get("location")) urlFilters.location = searchParams.get("location") || "";
      if (searchParams.get("stockId")) urlFilters.stockId = searchParams.get("stockId") || "";
      if (searchParams.get("driveType")) urlFilters.driveType = searchParams.get("driveType") || "";
      if (searchParams.get("auctionGrade")) urlFilters.auctionGrade = searchParams.get("auctionGrade") || "";
      if (searchParams.get("condition")) urlFilters.condition = searchParams.get("condition") || "";
      if (searchParams.get("minCC")) urlFilters.minCC = searchParams.get("minCC") || "";
      if (searchParams.get("maxCC")) urlFilters.maxCC = searchParams.get("maxCC") || "";

      const q = searchParams.get("search") || searchParams.get("q");
      if (q) setSearchQuery(q);

      if (Object.keys(urlFilters).length > 0) {
        setFilters((prev) => ({ ...prev, ...urlFilters }));
        setShowFilters(true); // Auto-open filters if coming from home page
      }
    }
  }, [searchParams]);

  const hasUrlFilters = useMemo(() => {
    if (!searchParams) return false;
    return !!(
      searchParams.get("make") || searchParams.get("model") || searchParams.get("bodyType") ||
      searchParams.get("fuel") || searchParams.get("minYear") || searchParams.get("maxYear") ||
      searchParams.get("minPrice") || searchParams.get("maxPrice") || searchParams.get("transmission") ||
      searchParams.get("stockId") || searchParams.get("search") || searchParams.get("q") ||
      searchParams.get("driveType") || searchParams.get("auctionGrade") || searchParams.get("condition") ||
      searchParams.get("minCC") || searchParams.get("maxCC")
    );
  }, [searchParams]);

  const [fetchTrigger, setFetchTrigger] = useState(0);

  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();

    // Mapping from state keys to API param names
    if (filters.make) params.set("make", filters.make);
    if (filters.model) params.set("model", filters.model);
    if (filters.bodyType) params.set("bodyType", filters.bodyType);
    if (filters.fuel) params.set("fuel", filters.fuel);
    if (filters.transmission) params.set("transmission", filters.transmission);
    if (filters.minYear) params.set("minYear", filters.minYear);
    if (filters.maxYear) params.set("maxYear", filters.maxYear);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.minMileage) params.set("minMileage", filters.minMileage);
    if (filters.maxMileage) params.set("maxMileage", filters.maxMileage);
    if (filters.location) params.set("location", filters.location);
    if (filters.stockId) params.set("stockId", filters.stockId);
    if (filters.driveType) params.set("driveType", filters.driveType || "");
    if (filters.auctionGrade) params.set("auctionGrade", filters.auctionGrade || "");
    if (filters.condition) params.set("condition", filters.condition || "");
    if (filters.minCC) params.set("minCC", filters.minCC || "");
    if (filters.maxCC) params.set("maxCC", filters.maxCC || "");
    if (searchQuery) params.set("q", searchQuery);

    // Sorting
    if (sortBy === "price-low") { params.set("sort", "price"); params.set("order", "asc"); }
    else if (sortBy === "price-high") { params.set("sort", "price"); params.set("order", "desc"); }
    else if (sortBy === "year") { params.set("sort", "year"); params.set("order", "desc"); }
    else if (sortBy === "mileage") { params.set("sort", "mileage"); params.set("order", "asc"); }
    else { params.set("sort", "createdAt"); params.set("order", "desc"); }

    params.set("limit", "50");

    setLoadingApi(true);
    // Use an AbortController to prevent race conditions
    const controller = new AbortController();

    fetch(`/api/vehicles?${params.toString()}`, {
      cache: "no-store",
      signal: controller.signal
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { vehicles?: unknown[]; total?: number } | null) => {
        if (data && Array.isArray(data.vehicles)) {
          setApiVehicles(data.vehicles.map((v) => mapApiVehicleToFrontend(v as Parameters<typeof mapApiVehicleToFrontend>[0])));
          setApiTotal(typeof data.total === "number" ? data.total : data.vehicles.length);
        } else {
          setApiVehicles([]);
          setApiTotal(0);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error("Fetch error:", err);
          setApiVehicles([]);
          setApiTotal(0);
        }
      })
      .finally(() => setLoadingApi(false));

    return () => controller.abort();
  }, [
    fetchTrigger,
    sortBy,
    searchQuery,
    // Deconstruct filters into primitives for dependency tracking
    filters.make,
    filters.model,
    filters.minYear,
    filters.maxYear,
    filters.minPrice,
    filters.maxPrice,
    filters.fuel,
    filters.transmission,
    filters.minMileage,
    filters.maxMileage,
    filters.bodyType,
    filters.location,
    filters.stockId,
    filters.minCC,
    filters.maxCC,
    filters.driveType,
    filters.auctionGrade,
    filters.condition
  ]);

  const displayVehicles = useMemo(() => {
    if (!apiVehicles) return [];
    return [...apiVehicles];
  }, [apiVehicles]);

  const makes = useMemo(() => {
    if (filterOptions?.makes?.length) return filterOptions.makes;
    return getAllMakes();
  }, [filterOptions, getAllMakes]);
  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  return (
    <div className="w-full min-w-0 bg-white pb-10 md:pb-12 relative overflow-x-hidden">
      <div className="container-custom relative z-10 pt-6">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <Breadcrumbs />
          <h1 className="text-xl md:text-2xl font-black text-slate-900 mb-1 tracking-tight uppercase">
            {t('nav_used_cars')}
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-teal-600 rounded-full" />
            <p className="text-slate-700 text-xs md:text-sm font-medium">
              {apiTotal ?? displayVehicles.length} {t('vehicles_found')}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-5 md:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 xl:w-72 hidden lg:block shrink-0 min-w-0">
            <motion.div
              className="rounded-xl border border-slate-200 bg-white p-4 md:p-5 sticky top-24 shadow-sm"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
                <h2 className="text-sm font-bold text-slate-900">
                  {t('refine_search')}
                </h2>
                {activeFiltersCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-teal-600 text-white text-xs font-semibold">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <AdvancedFilters filters={filters} setFilters={setFilters} makes={makes} filterOptions={filterOptions ?? undefined} />
            </motion.div>
          </aside>

          {/* Main Results */}
          <div id="inventory-results" className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 min-w-0">
              <div className="flex items-center justify-between w-full sm:w-auto gap-2 min-w-0">
                <p className="text-sm font-semibold text-slate-700">
                  <span className="text-slate-900">{apiTotal ?? displayVehicles.length}</span> {t('vehicles_found')}
                </p>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-medium"
                >
                  <Filter className="h-4 w-4" />
                  {t('filters')}
                  {activeFiltersCount > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="relative min-w-[140px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="w-full bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 rounded-lg pl-3 pr-8 py-2 appearance-none cursor-pointer"
                  >
                    <option value="newest">Newest first</option>
                    <option value="price-low">Price: low to high</option>
                    <option value="price-high">Price: high to low</option>
                    <option value="year">Model year</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 pointer-events-none" />
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`hidden sm:block p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters Dropdown Removed as requested */}

            <AnimatePresence mode="wait">
              <motion.div
                key={viewMode}
                className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5" : "space-y-3 md:space-y-4"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {loadingApi ? (
                  <div className="col-span-full flex items-center justify-center py-16">
                    <Loader2 className="h-10 w-10 animate-spin text-teal-500" aria-hidden />
                    <span className="sr-only">Loading vehicles…</span>
                  </div>
                ) : (
                  displayVehicles.map((vehicle) => (
                    <Link
                      key={vehicle.id}
                      href={routes.vehicleDetail(vehicle.id)}
                      className={`group block rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all ${viewMode === "list" ? "flex flex-col sm:flex-row sm:min-h-[220px]" : "flex flex-col h-full"}`}
                    >
                      <div className={`relative overflow-hidden bg-slate-100 ${viewMode === "list" ? "sm:w-72 shrink-0 h-48 sm:h-auto" : "h-48 md:h-52"}`}>
                        <WatermarkedImage
                          src={vehicle.images[0]}
                          alt={`${vehicle.make} ${vehicle.model} ${vehicle.year}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                          <span className="px-2 py-1 rounded bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold shadow-sm">
                            {vehicle.year}
                          </span>
                          {vehicle.auctionGrade && (
                            <span className="px-2 py-1 rounded bg-teal-600/90 backdrop-blur-sm text-white text-[10px] font-bold shadow-sm">
                              Grade {vehicle.auctionGrade}
                            </span>
                          )}
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <span className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm text-white text-[9px] font-medium tracking-wider">
                            ID: {vehicle.stockId.replace('MDK-', 'DVM-')}
                          </span>
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-0.5">{vehicle.make}</p>
                          <h3 className="text-sm font-bold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-1">
                            {vehicle.make} {vehicle.model}
                          </h3>
                          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-slate-700 mb-4">
                            <span className="flex items-center gap-1">
                              <Gauge className="h-3 w-3 text-slate-600" />
                              {formatMileage(vehicle.mileage)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Fuel className="h-3 w-3 text-slate-600" />
                              {vehicle.engine.fuel}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-slate-600" />
                              {vehicle.transmission}
                            </span>
                          </div>
                        </div>

                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-600 font-medium uppercase leading-none mb-1">{t('fob_price')}</span>
                            <span className="text-lg font-black text-slate-900 leading-none">
                              {vehicle.price.fob > 0 ? convertPrice(vehicle.price.fob, vehicle.price.currency) : 'Ask'}
                            </span>
                          </div>
                          <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-all">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </motion.div>
            </AnimatePresence>

            {!loadingApi && displayVehicles.length === 0 && (
              <div className="text-center py-16">
                <p className="text-slate-600 mb-4">{t('no_vehicles_match')}</p>
                <button
                  onClick={() => {
                    setFilters({ make: "", model: "", minYear: "", maxYear: "", minPrice: "", maxPrice: "", fuel: "", transmission: "", minMileage: "", maxMileage: "", bodyType: "", color: "", location: "", stockId: "", minCC: "", maxCC: "" });
                    setSearchQuery("");
                    setFetchTrigger(t => t + 1);
                  }}
                  className="rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold px-5 py-2.5"
                >
                  {t('clear_filters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

