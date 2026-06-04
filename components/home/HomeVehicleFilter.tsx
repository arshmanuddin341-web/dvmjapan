"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, X, ChevronDown, Car, Fuel, Gauge, DollarSign,
  SlidersHorizontal, ArrowRight, Loader2, MapPin, Calendar
} from "lucide-react";
import { routes } from "@/config/routes";

const FALLBACK_FUEL = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"];
const FALLBACK_BODY = ["SUV", "Sedan", "Hatchback", "Wagon", "Van", "Coupe", "Pickup", "MPV"];
const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 26 }, (_, i) => currentYear - i);

const pricePresets = [
  { label: "Under $5k", min: 0, max: 5000 },
  { label: "$5k–$15k", min: 5000, max: 15000 },
  { label: "$15k–$30k", min: 15000, max: 30000 },
  { label: "$30k+", min: 30000, max: 9999999 },
];

interface LiveResult {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  images: string[];
  fuelType: string;
  mileage: number;
}

export default function HomeVehicleFilter() {
  const router = useRouter();

  // Basic filters (always visible)
  const [query, setQuery] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Advanced filters (collapsible panel)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [minMileage, setMinMileage] = useState("");
  const [maxMileage, setMaxMileage] = useState("");
  const [stockId, setStockId] = useState("");

  // API data
  const [apiFilters, setApiFilters] = useState<{
    makes: string[];
    bodyTypes: string[];
    fuelTypes: string[];
    total: number;
    yearMin: number;
    yearMax: number;
  } | null>(null);
  const [apiModels, setApiModels] = useState<string[]>([]);

  // Live suggestions
  const [suggestions, setSuggestions] = useState<LiveResult[]>([]);
  const [loadingSugg, setLoadingSugg] = useState(false);
  const [showSugg, setShowSugg] = useState(false);
  const suggRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch filters from API
  useEffect(() => {
    fetch("/api/vehicles/filters", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) {
          setApiFilters({
            makes: Array.isArray(data.makes) ? data.makes : [],
            bodyTypes: Array.isArray(data.bodyTypes) ? data.bodyTypes : FALLBACK_BODY,
            fuelTypes: Array.isArray(data.fuelTypes) ? data.fuelTypes : FALLBACK_FUEL,
            total: data.total || 0,
            yearMin: data.yearMin || 2000,
            yearMax: data.yearMax || currentYear,
          });
        }
      })
      .catch(() => { });
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    if (!make) { setApiModels([]); return; }
    fetch(`/api/vehicles/filters?make=${encodeURIComponent(make)}`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(data => setApiModels(Array.isArray(data?.models) ? data.models : []))
      .catch(() => setApiModels([]));
  }, [make]);

  // Live search suggestions
  const fetchSuggestions = useCallback((q: string) => {
    if (!q || q.length < 2) { setSuggestions([]); setShowSugg(false); return; }
    setLoadingSugg(true);
    const params = new URLSearchParams({ q, limit: "6" });
    fetch(`/api/vehicles?${params}`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.vehicles?.length) {
          setSuggestions(data.vehicles.slice(0, 6));
          setShowSugg(true);
        } else {
          setSuggestions([]);
          setShowSugg(false);
        }
      })
      .catch(() => { setSuggestions([]); setShowSugg(false); })
      .finally(() => setLoadingSugg(false));
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (suggRef.current && !suggRef.current.contains(e.target as Node)) {
        setShowSugg(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const makes = apiFilters?.makes?.length ? apiFilters.makes : ["TOYOTA", "HONDA", "NISSAN", "SUZUKI", "MAZDA", "MITSUBISHI"];
  const bodyTypes = apiFilters?.bodyTypes?.length ? apiFilters.bodyTypes : FALLBACK_BODY;
  const fuelTypes = apiFilters?.fuelTypes?.length ? apiFilters.fuelTypes : FALLBACK_FUEL;
  const totalVehicles = apiFilters?.total ?? 0;

  const advancedActiveCount = [fuel, transmission, yearFrom, yearTo, minPrice, minMileage, maxMileage, stockId].filter(Boolean).length;

  const buildParams = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (bodyType) params.set("bodyType", bodyType);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (fuel) params.set("fuel", fuel);
    if (transmission) params.set("transmission", transmission);
    if (yearFrom) params.set("minYear", yearFrom);
    if (yearTo) params.set("maxYear", yearTo);
    if (minPrice) params.set("minPrice", minPrice);
    if (minMileage) params.set("minMileage", minMileage);
    if (maxMileage) params.set("maxMileage", maxMileage);
    if (stockId) params.set("stockId", stockId);
    return params.toString();
  };

  const handleSearch = () => {
    setShowSugg(false);
    router.push(`${routes.inventory}?${buildParams()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const clearAll = () => {
    setQuery(""); setMake(""); setModel(""); setBodyType(""); setMaxPrice("");
    setFuel(""); setTransmission(""); setYearFrom(""); setYearTo(""); setMinPrice("");
    setMinMileage(""); setMaxMileage(""); setStockId(""); setSuggestions([]); setShowSugg(false);
  };

  const hasAnyFilter = query || make || model || bodyType || maxPrice || advancedActiveCount > 0;

  const selectClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 appearance-none cursor-pointer";
  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500";

  return (
    <section className="section bg-slate-50 relative" aria-labelledby="filter-heading">
      <div className="container-custom">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold uppercase tracking-widest mb-3">
            Live Inventory
          </span>
          <h2 id="filter-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            Find Your <span className="text-teal-600">Perfect Car</span>
          </h2>
          <p className="text-slate-700 text-sm max-w-lg mx-auto mb-5">
            Search across {totalVehicles > 0 ? `${totalVehicles}+` : "thousands of"} premium Japanese vehicles — type any make, model, or stock ID.
          </p>
          {/* Quick stat pills */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { icon: <Car className="h-3.5 w-3.5" />, label: `${makes.length} Makes` },
              { icon: <Fuel className="h-3.5 w-3.5" />, label: `${fuelTypes.length} Fuel Types` },
              { icon: <Gauge className="h-3.5 w-3.5" />, label: `${bodyTypes.length} Body Types` },
              { icon: <MapPin className="h-3.5 w-3.5" />, label: "Shipped from Japan" },
            ].map(item => (
              <span key={item.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-medium shadow-sm">
                <span className="text-teal-500">{item.icon}</span>
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Main search card */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden">

            {/* ── Live Search Bar ── */}
            <div ref={suggRef} className="relative border-b border-slate-100">
              <div className="flex items-center px-4 py-1 gap-2">
                <Search className="h-5 w-5 text-teal-500 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => query.length >= 2 && setShowSugg(true)}
                  placeholder="Search by make, model, year or stock ID... (press Enter)"
                  className="flex-1 py-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent font-medium"
                  autoComplete="off"
                />
                {loadingSugg && <Loader2 className="h-4 w-4 text-teal-400 animate-spin shrink-0" />}
                {query && !loadingSugg && (
                  <button type="button" onClick={() => { setQuery(""); setSuggestions([]); setShowSugg(false); }} className="text-slate-400 hover:text-slate-700 shrink-0">
                    <X className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-colors shrink-0"
                >
                  Search <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              {/* Live Suggestions Dropdown */}
              {showSugg && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 shadow-2xl z-50 rounded-b-2xl overflow-hidden">
                  <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Quick Results — press Enter for full search
                  </p>
                  {suggestions.map(v => (
                    <Link
                      key={v.id}
                      href={routes.vehicleDetail(v.id)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors group"
                      onClick={() => setShowSugg(false)}
                    >
                      {v.images?.[0] ? (
                        <img src={v.images[0]} alt="" className="w-16 h-12 object-cover rounded-lg flex-shrink-0 bg-slate-100" />
                      ) : (
                        <div className="w-16 h-12 bg-slate-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <Car className="h-5 w-5 text-slate-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors truncate">
                          {v.make} {v.model}
                        </p>
                        <p className="text-xs text-slate-400">{v.year} · {v.fuelType} · {v.mileage?.toLocaleString()} km</p>
                      </div>
                      <p className="text-sm font-black text-slate-900 shrink-0">
                        ${v.price?.toLocaleString()}
                      </p>
                    </Link>
                  ))}
                  <Link
                    href={`${routes.inventory}?q=${encodeURIComponent(query)}`}
                    className="flex items-center justify-center gap-2 px-4 py-3 text-sm text-teal-600 font-semibold hover:bg-teal-50 transition-colors border-t border-slate-100"
                    onClick={() => setShowSugg(false)}
                  >
                    See all results for &ldquo;{query}&rdquo; <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>

            {/* ── Basic 4-column Filters ── */}
            <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3 border-b border-slate-100">
              {/* Make */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Make</label>
                <div className="relative">
                  <select value={make} onChange={e => { setMake(e.target.value); setModel(""); }} className={selectClass}>
                    <option value="">All Makes</option>
                    {makes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Model */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Model</label>
                <div className="relative">
                  <select value={model} onChange={e => setModel(e.target.value)} disabled={!make} className={`${selectClass} ${!make ? "opacity-50 cursor-not-allowed" : ""}`}>
                    <option value="">{make ? "All Models" : "Select Make first"}</option>
                    {apiModels.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Body Type</label>
                <div className="relative">
                  <select value={bodyType} onChange={e => setBodyType(e.target.value)} className={selectClass}>
                    <option value="">All Types</option>
                    {bodyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Max Budget (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Any Price"
                    className={`${inputClass} pl-7`}
                  />
                </div>
                {/* Price quick picks */}
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {pricePresets.map(p => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => { setMinPrice(p.min > 0 ? p.min.toString() : ""); setMaxPrice(p.max < 9999999 ? p.max.toString() : ""); }}
                      className={`text-[9px] px-2 py-1 rounded border transition-colors font-bold ${(minPrice === p.min.toString() || maxPrice === p.max.toString()) ? "bg-teal-600 text-white border-teal-600" : "bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-400 hover:text-teal-600"}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Advanced Search Toggle ── */}
            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-semibold text-slate-800 hover:text-teal-600 hover:bg-slate-50 transition-colors group"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-teal-500" />
                  Advanced Search
                  {advancedActiveCount > 0 && (
                    <span className="ml-1 min-w-[20px] h-5 px-1.5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {advancedActiveCount}
                    </span>
                  )}
                </span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${showAdvanced ? "rotate-180 text-teal-500" : ""}`} />
              </button>

              {/* Advanced Panel */}
              {showAdvanced && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                    {/* Fuel */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        <Fuel className="inline h-3 w-3 mr-1 text-teal-500" />Fuel Type
                      </label>
                      <div className="relative">
                        <select value={fuel} onChange={e => setFuel(e.target.value)} className={selectClass}>
                          <option value="">All Fuels</option>
                          {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Transmission */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Transmission</label>
                      <div className="relative">
                        <select value={transmission} onChange={e => setTransmission(e.target.value)} className={selectClass}>
                          <option value="">All Types</option>
                          {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Year From */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        <Calendar className="inline h-3 w-3 mr-1 text-teal-500" />Year From
                      </label>
                      <div className="relative">
                        <select value={yearFrom} onChange={e => setYearFrom(e.target.value)} className={selectClass}>
                          <option value="">From</option>
                          {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Year To */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Year To</label>
                      <div className="relative">
                        <select value={yearTo} onChange={e => setYearTo(e.target.value)} className={selectClass}>
                          <option value="">To</option>
                          {years.filter(y => !yearFrom || y >= parseInt(yearFrom)).map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Min Price */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        <DollarSign className="inline h-3 w-3 mr-1 text-teal-500" />Min Price (USD)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} onKeyDown={handleKeyDown} placeholder="0" className={`${inputClass} pl-7`} />
                      </div>
                    </div>

                    {/* Mileage */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        <Gauge className="inline h-3 w-3 mr-1 text-teal-500" />Max Mileage (km)
                      </label>
                      <input type="number" value={maxMileage} onChange={e => setMaxMileage(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. 100000" className={inputClass} />
                    </div>

                    {/* Min Mileage */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Min Mileage (km)</label>
                      <input type="number" value={minMileage} onChange={e => setMinMileage(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. 0" className={inputClass} />
                    </div>

                    {/* Stock ID */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Stock ID</label>
                      <input type="text" value={stockId} onChange={e => setStockId(e.target.value)} onKeyDown={handleKeyDown} placeholder="e.g. MDK-123456" className={inputClass} />
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* ── Action Bar ── */}
            <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3 flex-wrap">
                {hasAnyFilter && (
                  <button type="button" onClick={clearAll} className="inline-flex items-center gap-1.5 text-sm text-slate-700 hover:text-red-500 transition-colors font-medium">
                    <X className="h-4 w-4" />
                    Clear All
                  </button>
                )}
                {totalVehicles > 0 && (
                  <span className="text-sm text-slate-700">
                    <strong className="text-teal-600">{totalVehicles}+</strong> vehicles available
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleSearch}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 shadow-lg shadow-teal-600/25 transition-all hover:shadow-teal-600/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search className="h-4 w-4" />
                Search Cars
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
