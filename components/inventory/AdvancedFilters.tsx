"use client";

import { motion } from "framer-motion";
import { FilterProps } from "@/types/inventory";

const STATIC_TRANSMISSION = ["Automatic", "Manual", "CVT"];
const STATIC_FUEL = ["Petrol", "Diesel", "Hybrid", "Electric"];
const BODY_TYPES = ["SUV", "Sedan", "Hatchback", "MPV", "Van", "Truck", "Coupe", "Station Wagon"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => CURRENT_YEAR - i);
const PRICE_RANGES = [
  { label: "Under $5,000", max: "5000" },
  { label: "$5,000 – $10,000", min: "5000", max: "10000" },
  { label: "$10,000 – $20,000", min: "10000", max: "20000" },
  { label: "$20,000 – $40,000", min: "20000", max: "40000" },
  { label: "$40,000+", min: "40000" },
];
const MILEAGE_RANGES = [
  { label: "Under 30,000 km", max: "30000" },
  { label: "30,000 – 60,000 km", min: "30000", max: "60000" },
  { label: "60,000 – 100,000 km", min: "60000", max: "100000" },
  { label: "100,000+ km", min: "100000" },
];

export default function AdvancedFilters({ filters, setFilters, makes, filterOptions }: FilterProps) {
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const models = filterOptions?.models || [];
  const transmissions = filterOptions?.transmissions?.length ? filterOptions.transmissions : STATIC_TRANSMISSION;
  const fuelTypes = filterOptions?.fuelTypes?.length ? filterOptions.fuelTypes : STATIC_FUEL;
  const bodyTypes = filterOptions?.bodyTypes?.length ? filterOptions.bodyTypes : BODY_TYPES;
  const displayMakes = (filterOptions?.makes?.length ? filterOptions.makes : makes).slice(0, 12);

  const activeCount = Object.values(filters).filter((v) => v && v !== "").length;

  const selectClass = "w-full h-10 px-3 pr-8 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none cursor-pointer disabled:opacity-60";

  return (
    <div className="space-y-5 font-body text-sm">

      {/* ── MAKE (button grid) ── */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Make</label>
        <div className="grid grid-cols-2 gap-1.5">
          {displayMakes.map((make) => (
            <button
              key={make}
              type="button"
              onClick={() => handleFilterChange("make", filters.make === make ? "" : make)}
              className={`px-2 py-2 rounded-lg border text-xs font-semibold transition-all duration-150 text-left ${filters.make === make
                ? "border-teal-600 bg-teal-600 text-white shadow-sm"
                : "border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50 bg-white"
                }`}
            >
              {make}
            </button>
          ))}
        </div>
      </div>

      {/* ── MODEL ── */}
      {filters.make && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Model</label>
          <div className="relative">
            <select
              value={filters.model}
              onChange={(e) => handleFilterChange("model", e.target.value)}
              className={selectClass}
            >
              <option value="">All Models</option>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <ChevronIcon />
          </div>
        </motion.div>
      )}

      {/* ── BODY TYPE (icon buttons) ── */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Body Type</label>
        <div className="flex flex-wrap gap-1.5">
          {bodyTypes.map((bt) => (
            <button
              key={bt}
              type="button"
              onClick={() => handleFilterChange("bodyType", filters.bodyType === bt ? "" : bt)}
              className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${filters.bodyType === bt
                ? "bg-teal-600 border-teal-600 text-white"
                : "bg-white border-slate-200 text-slate-800 hover:border-teal-400 hover:text-teal-700"
                }`}
            >
              {bt}
            </button>
          ))}
        </div>
      </div>

      {/* ── YEAR RANGE ── */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Year</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <select value={filters.minYear} onChange={(e) => handleFilterChange("minYear", e.target.value)} className={selectClass}>
              <option value="">From</option>
              {YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
            </select>
            <ChevronIcon />
          </div>
          <div className="relative">
            <select value={filters.maxYear} onChange={(e) => handleFilterChange("maxYear", e.target.value)} className={selectClass}>
              <option value="">To</option>
              {YEARS.map(y => <option key={y} value={String(y)}>{y}</option>)}
            </select>
            <ChevronIcon />
          </div>
        </div>
      </div>

      {/* ── PRICE RANGE (quick badges) ── */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Price (USD)</label>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => {
            const active = filters.minPrice === (range.min || "") && filters.maxPrice === (range.max || "");
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => {
                  if (active) {
                    handleFilterChange("minPrice", "");
                    handleFilterChange("maxPrice", "");
                  } else {
                    setFilters(prev => ({ ...prev, minPrice: range.min || "", maxPrice: range.max || "" }));
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${active
                  ? "bg-teal-600 border-teal-600 text-white"
                  : "bg-white border-slate-200 text-slate-800 hover:border-teal-400 hover:text-teal-700"
                  }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <input
            type="number"
            placeholder="Min $"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <input
            type="number"
            placeholder="Max $"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* ── MILEAGE ── */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Mileage</label>
        <div className="space-y-1.5">
          {MILEAGE_RANGES.map((range) => {
            const active = filters.minMileage === (range.min || "") && filters.maxMileage === (range.max || "");
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => {
                  if (active) {
                    handleFilterChange("minMileage", "");
                    handleFilterChange("maxMileage", "");
                  } else {
                    setFilters(prev => ({ ...prev, minMileage: range.min || "", maxMileage: range.max || "" }));
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-medium transition-all ${active
                  ? "bg-teal-600 border-teal-600 text-white"
                  : "bg-white border-slate-200 text-slate-800 hover:border-teal-400 hover:text-teal-700"
                  }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FUEL + TRANSMISSION ── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Fuel</label>
          <div className="relative">
            <select value={filters.fuel} onChange={(e) => handleFilterChange("fuel", e.target.value)} className={selectClass}>
              <option value="">Any</option>
              {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <ChevronIcon />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Gearbox</label>
          <div className="relative">
            <select value={filters.transmission} onChange={(e) => handleFilterChange("transmission", e.target.value)} className={selectClass}>
              <option value="">Any</option>
              {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronIcon />
          </div>
        </div>
      </div>

      {/* ── STOCK ID SEARCH ── */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Stock ID</label>
        <input
          type="text"
          placeholder="e.g. DVM-123456"
          value={filters.stockId}
          onChange={(e) => handleFilterChange("stockId", e.target.value)}
          className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* ── RESET ── */}
      {activeCount > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          type="button"
          onClick={() =>
            setFilters({
              make: "", model: "", minYear: "", maxYear: "",
              minPrice: "", maxPrice: "", fuel: "", transmission: "",
              minMileage: "", maxMileage: "", bodyType: "", color: "",
              location: "", stockId: "", minCC: "", maxCC: "",
              driveType: "", auctionGrade: "", condition: "",
            })
          }
          className="w-full py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
        >
          Clear all filters ({activeCount})
        </motion.button>
      )}
    </div>
  );
}

function ChevronIcon() {
  return (
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
