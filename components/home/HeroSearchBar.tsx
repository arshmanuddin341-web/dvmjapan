"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getAllMakes, getModelsByMake } from "@/data/vehicles";
import { routes } from "@/config/routes";

const makes = getAllMakes();

export default function HeroSearchBar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const models = make ? getModelsByMake(make) : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    router.push(`${routes.inventory}${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="container-custom relative z-20 -mt-8 md:-mt-10 lg:-mt-12">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 p-4 md:p-5 bg-white rounded-2xl shadow-xl border border-slate-200/80 max-w-5xl mx-auto"
      >
        <div className="flex-1 min-w-0">
          <label htmlFor="hero-search" className="sr-only">Search</label>
          <input
            id="hero-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/50"
          />
        </div>
        <div className="flex-1 min-w-0">
          <label htmlFor="hero-make" className="sr-only">Make</label>
          <select
            id="hero-make"
            value={make}
            onChange={(e) => { setMake(e.target.value); setModel(""); }}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/50 appearance-none cursor-pointer bg-white pr-10"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
          >
            <option value="">Make</option>
            {makes.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-0">
          <label htmlFor="hero-model" className="sr-only">Model</label>
          <select
            id="hero-model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/50 appearance-none cursor-pointer bg-white pr-10 disabled:opacity-60"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25rem' }}
            disabled={!make}
          >
            <option value="">Model</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors cursor-pointer shrink-0"
        >
          <Search className="h-5 w-5" />
          Search Cars
        </button>
      </form>
    </div>
  );
}
