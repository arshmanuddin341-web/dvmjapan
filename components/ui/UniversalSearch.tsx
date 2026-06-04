"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Car, MapPin, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";
import { useCurrency } from "@/context/CurrencyContext";

type SearchResult = {
  type: "vehicle" | "page";
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  metadata?: string;
  image?: string;
};

const STATIC_PAGES = [
  { title: "How to Buy", url: "/how-it-works", desc: "Our 4-step import process" },
  { title: "Inventory", url: routes.inventory, desc: "Browse all vehicles" },
  { title: "Auction Service", url: routes.auction, desc: "Direct auction access" },
  { title: "Shipping", url: "/shipping", desc: "Ports and schedules" },
  { title: "Company Profile", url: "/about", desc: "About DVM JAPAN" },
  { title: "Contact Us", url: routes.contact, desc: "Get in touch" },
  { title: "FAQ", url: "/faq", desc: "Common questions" },
];

export default function UniversalSearch() {
  const { convertPrice } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults: SearchResult[] = [];

        // 1. Filter Static Pages
        const q = query.toLowerCase();
        const matchedPages = STATIC_PAGES.filter(p =>
          p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
        ).map(p => ({
          type: "page" as const,
          title: p.title,
          description: p.desc,
          url: p.url,
          icon: <MapPin className="h-4 w-4" />
        }));
        searchResults.push(...matchedPages);

        // 2. Fetch Live Vehicles
        const res = await fetch(`/api/vehicles?q=${encodeURIComponent(query)}&limit=6`);
        if (res.ok) {
          const data = await res.json();
          const vehicles = data.vehicles.map((v: any) => ({
            type: "vehicle" as const,
            title: `${v.make} ${v.model} ${v.year}`,
            description: `${v.transmission} • ${v.fuelType} • ${v.mileage.toLocaleString()} km`,
            url: routes.vehicleDetail(v.id),
            icon: <Car className="h-4 w-4" />,
            metadata: `FOB: ${convertPrice(v.price)}`,
            image: v.images[0]
          }));
          searchResults.push(...vehicles);
        }

        setResults(searchResults);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 transition-all text-xs font-semibold"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Quick Search</span>
        <kbd className="hidden lg:inline-flex px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded shadow-sm ml-2">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
              ref={searchRef}
            >
              <div className="flex items-center gap-4 p-4 border-b border-slate-100">
                <Search className="h-5 w-5 text-teal-600 shrink-0" />
                <input
                  autoFocus
                  placeholder="Search vehicles, stock ID, pages..."
                  className="flex-1 bg-transparent border-none outline-none text-slate-900 text-sm placeholder:text-slate-400"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                {loading ? <Loader2 className="h-4 w-4 animate-spin text-teal-600" /> : query && (
                  <button onClick={() => setQuery("")} className="p-1 hover:bg-slate-100 rounded-lg">
                    <X className="h-4 w-4 text-slate-400" />
                  </button>
                )}
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length > 0 ? (
                  <div className="space-y-1">
                    {results.map((res, i) => (
                      <Link
                        key={i}
                        href={res.url}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-teal-50 group transition-all"
                      >
                        <div className="w-12 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-teal-600 shrink-0 transition-all overflow-hidden border border-slate-200">
                          {res.image ? (
                            <img src={res.image} alt="" className="w-full h-full object-cover" />
                          ) : res.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 text-xs group-hover:text-teal-700">{res.title}</h4>
                          <p className="text-[9px] text-slate-400">{res.description}</p>
                        </div>
                        {res.metadata && <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">{res.metadata}</span>}
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
                      </Link>
                    ))}
                  </div>
                ) : query.trim() && !loading ? (
                  <div className="py-12 text-center">
                    <TrendingUp className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No results found for &quot;{query}&quot;</p>
                  </div>
                ) : (
                  <div className="py-8 px-4 text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Popular Pages</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {STATIC_PAGES.slice(0, 4).map(p => (
                        <Link
                          key={p.url}
                          href={p.url}
                          onClick={() => setIsOpen(false)}
                          className="p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 group text-center transition-all"
                        >
                          <div className="w-8 h-8 rounded-lg bg-teal-600/10 text-teal-600 mx-auto mb-2 flex items-center justify-center">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <p className="text-[10px] font-bold text-slate-900 group-hover:text-teal-700">{p.title}</p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
