"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getAllMakes, getModelsByMake } from "@/data/vehicles";
import { routes } from "@/config/routes";

export default function HeroSearchStrip() {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/vehicles/filters", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.makes) && data.makes.length) setMakes(data.makes);
        else setMakes(getAllMakes());
      })
      .catch(() => setMakes(getAllMakes()));
  }, []);

  useEffect(() => {
    if (!make) {
      setModels([]);
      return;
    }
    fetch(`/api/vehicles/filters?make=${encodeURIComponent(make)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.models)) setModels(data.models);
        else setModels(getModelsByMake(make));
      })
      .catch(() => setModels(getModelsByMake(make)));
  }, [make]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (model) params.set("model", model);
    router.push(`${routes.inventory}?${params.toString()}`);
  };

  return (
    <section className="relative bg-white py-8 md:py-10" aria-labelledby="hero-heading">
      <div className="container-custom">
        {/* DVM JAPAN Group: search row first, then heading */}
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center mb-6 md:mb-8">
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-3 sm:gap-2">
            <div className="relative flex-1 min-w-0">
              <label className="sr-only">Make</label>
              <select
                value={make}
                onChange={(e) => { setMake(e.target.value); setModel(""); }}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none cursor-pointer"
                aria-label="Make"
              >
                <option value="">Make</option>
                {makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            <div className="relative flex-1 min-w-0">
              <label className="sr-only">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                disabled={!make}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none cursor-pointer disabled:opacity-60"
                aria-label="Model"
              >
                <option value="">Model</option>
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="shrink-0 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 text-sm transition-colors cursor-pointer"
          >
            Search Cars
          </button>
          <Link
            href={routes.blog}
            className="shrink-0 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium px-5 py-3 text-sm text-center transition-colors"
          >
            See All News
          </Link>
        </div>

        <h1 id="hero-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 text-center tracking-tight">
          DVM JAPAN selected quality vehicles
        </h1>
      </div>
    </section>
  );
}
