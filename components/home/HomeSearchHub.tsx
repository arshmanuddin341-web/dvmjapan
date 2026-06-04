"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Search, MapPin, DollarSign, Car, Filter, X, ArrowRight,
    ChevronDown, Loader2, Fuel, Gauge, Calendar, SlidersHorizontal
} from "lucide-react";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCurrency } from "@/context/CurrencyContext";

const PRICE_OPTS = [
    { label: "Any Price", value: "" },
    { label: "Under $5,000", value: "5000" },
    { label: "Under $10,000", value: "10000" },
    { label: "Under $20,000", value: "20000" },
    { label: "Under $40,000", value: "40000" },
    { label: "Under $70,000", value: "70000" },
];

const TRANSMISSIONS = ["Automatic", "Manual", "CVT"];
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 25 }, (_, i) => currentYear - i);
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric", "LPG"];
const BODY_TYPES = ["SUV", "Sedan", "Hatchback", "Wagon", "Van", "Coupe", "Pickup", "MPV"];

interface Suggestion {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    images: string[];
    fuelType: string;
    mileage: number;
}

export default function HomeSearchHub({ onFilterChange }: { onFilterChange?: (filters: any) => void }) {
    const router = useRouter();
    const { convertPrice, t } = useCurrency();

    // Basic
    const [query, setQuery] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [budget, setBudget] = useState("");

    // Advanced panel
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [bodyType, setBodyType] = useState("");
    const [fuel, setFuel] = useState("");
    const [transmission, setTransmission] = useState("");
    const [yearFrom, setYearFrom] = useState("");
    const [yearTo, setYearTo] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxMileage, setMaxMileage] = useState("");
    const [stockId, setStockId] = useState("");

    // API data
    const [apiMakes, setApiMakes] = useState<string[]>([]);
    const [apiModels, setApiModels] = useState<string[]>([]);
    const [apiBodyTypes, setApiBodyTypes] = useState<string[]>([]);
    const [total, setTotal] = useState(0);

    // Live suggestions
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSugg, setShowSugg] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const suggRef = useRef<HTMLDivElement>(null);

    // Fetch filter options from API
    useEffect(() => {
        fetch("/api/vehicles/filters", { cache: "no-store" })
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                if (d) {
                    setApiMakes(Array.isArray(d.makes) ? d.makes : []);
                    setApiBodyTypes(Array.isArray(d.bodyTypes) ? d.bodyTypes : BODY_TYPES);
                    setTotal(d.total || 0);
                }
            })
            .catch(() => { });
    }, []);

    // Fetch models when make selected
    useEffect(() => {
        if (!make) { setApiModels([]); return; }
        fetch(`/api/vehicles/filters?make=${encodeURIComponent(make)}`, { cache: "no-store" })
            .then(r => r.ok ? r.json() : null)
            .then(d => setApiModels(Array.isArray(d?.models) ? d.models : []))
            .catch(() => setApiModels([]));
    }, [make]);

    // Effect to trigger live updates to parent
    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                make,
                model,
                yearFrom,
                yearTo,
                query
            });
        }
    }, [make, model, yearFrom, yearTo, query, onFilterChange]);

    // Live search suggestions for the text input
    const fetchSugg = useCallback((q: string) => {
        if (!q || q.length < 2) { setSuggestions([]); setShowSugg(false); return; }
        setLoading(true);
        fetch(`/api/vehicles?q=${encodeURIComponent(q)}&limit=5`, { cache: "no-store" })
            .then(r => r.ok ? r.json() : null)
            .then(d => {
                const items = d?.vehicles?.slice(0, 5) || [];
                setSuggestions(items);
                setShowSugg(items.length > 0);
            })
            .catch(() => { setSuggestions([]); setShowSugg(false); })
            .finally(() => setLoading(false));
    }, []);

    const handleQueryChange = (val: string) => {
        setQuery(val);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSugg(val), 300);
    };

    // Close suggestions on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (suggRef.current && !suggRef.current.contains(e.target as Node)) setShowSugg(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const advancedCount = [bodyType, fuel, transmission, yearFrom, yearTo, minPrice, maxMileage, stockId].filter(Boolean).length;

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setShowSugg(false);
        const p = new URLSearchParams();
        if (query) p.set("q", query);
        if (make) p.set("make", make);
        if (model) p.set("model", model);
        if (budget) p.set("maxPrice", budget);
        if (bodyType) p.set("bodyType", bodyType);
        if (fuel) p.set("fuel", fuel);
        if (transmission) p.set("transmission", transmission);
        if (yearFrom) p.set("minYear", yearFrom);
        if (yearTo) p.set("maxYear", yearTo);
        if (minPrice) p.set("minPrice", minPrice);
        if (maxMileage) p.set("maxMileage", maxMileage);
        if (stockId) p.set("stockId", stockId);
        router.push(`${routes.inventory}?${p.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSearch(); };
    const clearAdvanced = () => { setBodyType(""); setFuel(""); setTransmission(""); setYearFrom(""); setYearTo(""); setMinPrice(""); setMaxMileage(""); setStockId(""); };

    const makesOptions = apiMakes.length ? apiMakes : ["TOYOTA", "HONDA", "NISSAN", "SUZUKI", "MAZDA", "MITSUBISHI"];
    const bodyOptions = apiBodyTypes.length ? apiBodyTypes : BODY_TYPES;

    const selectCls = "w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 appearance-none cursor-pointer";
    const inputCls = "w-full pl-3 pr-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400";

    return (
        <div className="container-custom relative -mt-16 z-50 pb-6">
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-[0_24px_56px_-12px_rgba(0,0,0,0.14)] border border-slate-100 overflow-visible"
            >
                {/* ── Main Row ── */}
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-end gap-3 p-4">

                    {/* Live Search */}
                    <div ref={suggRef} className="flex-[2] w-full relative">
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-0.5">{t('search_anything') || 'Search Anything'}</label>
                        <div className="relative group">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-teal-600 transition-colors pointer-events-none" />
                            <input
                                type="text"
                                placeholder={t('search_placeholder')}
                                className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all outline-none text-slate-900 text-sm font-medium placeholder-slate-400"
                                value={query}
                                onChange={e => handleQueryChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => query.length >= 2 && setShowSugg(true)}
                                autoComplete="off"
                            />
                            {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400 animate-spin" />}
                            {query && !loading && (
                                <button type="button" onClick={() => { setQuery(""); setSuggestions([]); setShowSugg(false); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Suggestions dropdown */}
                        <AnimatePresence>
                            {showSugg && suggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden"
                                >
                                    {suggestions.map(v => (
                                        <Link
                                            key={v.id}
                                            href={routes.vehicleDetail(v.id)}
                                            className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors group"
                                            onClick={() => setShowSugg(false)}
                                        >
                                            {v.images?.[0] ? (
                                                <img src={v.images[0]} alt="" className="w-14 h-10 object-cover rounded-md flex-shrink-0" />
                                            ) : (
                                                <div className="w-14 h-10 bg-slate-100 rounded-md flex-shrink-0 flex items-center justify-center">
                                                    <Car className="h-5 w-5 text-slate-300" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-teal-600 truncate">{v.make} {v.model}</p>
                                                <p className="text-xs text-slate-400">{v.year} · {v.fuelType} · {v.mileage?.toLocaleString()} km</p>
                                            </div>
                                            <span className="text-sm font-bold text-slate-800 shrink-0">{convertPrice(v.price)}</span>
                                        </Link>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={handleSearch}
                                        className="w-full py-2.5 text-xs text-teal-600 font-bold hover:bg-teal-50 transition-colors flex items-center justify-center gap-1.5 border-t border-slate-100"
                                    >
                                        See all results for &ldquo;{query}&rdquo; <ArrowRight className="h-3.5 w-3.5" />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Brand */}
                    <div className="flex-1 min-w-[140px] w-full">
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-0.5">{t('brand')}</label>
                        <div className="relative group">
                            <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-focus-within:text-teal-600 transition-colors" />
                            <select className={selectCls} value={make} onChange={e => setMake(e.target.value)}>
                                <option value="">{t('all_brands')}</option>
                                {makesOptions.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Model */}
                    <div className="flex-1 min-w-[140px] w-full">
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-0.5">
                            {t('model')}
                            {make && apiModels.length === 0 && <span className="ml-2 text-teal-500 animate-pulse">...</span>}
                        </label>
                        <div className="relative group">
                            <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-focus-within:text-teal-600 transition-colors" />
                            <select
                                className={`${selectCls} ${!make ? "opacity-60 grayscale" : ""}`}
                                value={model}
                                onChange={e => setModel(e.target.value)}
                                disabled={!make}
                            >
                                <option value="">{make ? (apiModels.length ? t('any_model') : "No models found") : "Select brand"}</option>
                                {apiModels.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Year FROM */}
                    <div className="flex-1 min-w-[100px] w-full">
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-0.5">{t('year_from')}</label>
                        <div className="relative group">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-focus-within:text-teal-600 transition-colors" />
                            <select className={selectCls} value={yearFrom} onChange={e => setYearFrom(e.target.value)}>
                                <option value="">From</option>
                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Year TO */}
                    <div className="flex-1 min-w-[100px] w-full">
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5 ml-0.5">{t('year_to')}</label>
                        <div className="relative group">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-focus-within:text-teal-600 transition-colors" />
                            <select className={selectCls} value={yearTo} onChange={e => setYearTo(e.target.value)}>
                                <option value="">To</option>
                                {YEARS.filter(y => !yearFrom || y >= parseInt(yearFrom)).map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="w-full md:w-auto px-8 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-black flex items-center justify-center gap-2 hover:bg-teal-600 active:scale-95 transition-all shadow-xl shadow-slate-900/10 uppercase tracking-widest"
                    >
                        {t('discover')} <ArrowRight className="h-4 w-4" />
                    </button>
                </form>

                {/* ── Bottom Row ── */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 px-5 py-3 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">{t('verified_stock')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">{t('direct_auction')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-tight">{t('insured_shipping')}</span>
                    </div>

                    {/* ✅ ADVANCED SEARCH BUTTON — now fully clickable */}
                    <button
                        type="button"
                        onClick={() => setShowAdvanced(v => !v)}
                        className="ml-auto flex items-center gap-1.5 text-teal-600 font-bold text-xs hover:text-teal-700 transition-colors cursor-pointer group"
                    >
                        <SlidersHorizontal className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                        {t('advanced_search')}
                        {advancedCount > 0 && (
                            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-teal-600 text-white text-[9px] font-black flex items-center justify-center">
                                {advancedCount}
                            </span>
                        )}
                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`} />
                    </button>
                </div>

                {/* ── Advanced Panel ── */}
                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: "easeInOut" }}
                            className="overflow-hidden border-t border-slate-100"
                        >
                            <div className="p-4 sm:p-5 bg-slate-50/80">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

                                    {/* Body Type */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Body Type</label>
                                        <div className="relative">
                                            <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                            <select value={bodyType} onChange={e => setBodyType(e.target.value)} className={selectCls}>
                                                <option value="">All Types</option>
                                                {bodyOptions.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Advanced Model Search (if preferred over dropdown) */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Stock ID / Keywords</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={stockId}
                                                onChange={e => setStockId(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                placeholder="e.g. DVM-123456"
                                                className={inputCls}
                                            />
                                        </div>
                                    </div>

                                    {/* Fuel */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                            <Fuel className="inline h-3 w-3 mr-1 text-teal-500" />Fuel
                                        </label>
                                        <div className="relative">
                                            <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                            <select value={fuel} onChange={e => setFuel(e.target.value)} className={selectCls}>
                                                <option value="">All Fuels</option>
                                                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Transmission */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Transmission</label>
                                        <div className="relative">
                                            <Gauge className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                            <select value={transmission} onChange={e => setTransmission(e.target.value)} className={selectCls}>
                                                <option value="">All Types</option>
                                                {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Year From */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                            <Calendar className="inline h-3 w-3 mr-1 text-teal-500" />Year From
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                            <select value={yearFrom} onChange={e => setYearFrom(e.target.value)} className={selectCls}>
                                                <option value="">From</option>
                                                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Year To */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Year To</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                            <select value={yearTo} onChange={e => setYearTo(e.target.value)} className={selectCls}>
                                                <option value="">To</option>
                                                {YEARS.filter(y => !yearFrom || y >= parseInt(yearFrom)).map(y => <option key={y} value={y}>{y}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Min Price */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                            <DollarSign className="inline h-3 w-3 mr-1 text-teal-500" />Min Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={e => setMinPrice(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="e.g. 5000"
                                            className={inputCls}
                                        />
                                    </div>

                                    {/* Max Price */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                                            <DollarSign className="inline h-3 w-3 mr-1 text-teal-500" />Max Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={budget}
                                            onChange={e => setBudget(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="e.g. 20000"
                                            className={inputCls}
                                        />
                                    </div>

                                    {/* Max Mileage */}
                                    <div>
                                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Max Mileage (km)</label>
                                        <input
                                            type="number"
                                            value={maxMileage}
                                            onChange={e => setMaxMileage(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            placeholder="e.g. 100000"
                                            className={inputCls}
                                        />
                                    </div>

                                </div>

                                {/* Advanced action row */}
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                                    {advancedCount > 0 ? (
                                        <button type="button" onClick={clearAdvanced} className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1.5 font-medium transition-colors">
                                            <X className="h-3.5 w-3.5" /> Clear advanced filters
                                        </button>
                                    ) : <span className="text-xs text-slate-400">Fill in any filters above</span>}
                                    <button
                                        type="button"
                                        onClick={handleSearch}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-teal-600 text-white text-sm font-bold hover:bg-teal-700 transition-colors shadow-md shadow-teal-600/20"
                                    >
                                        <Search className="h-4 w-4" />
                                        Search Cars
                                        {advancedCount > 0 && <span className="text-xs opacity-80">({advancedCount} filters)</span>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </div>
    );
}
