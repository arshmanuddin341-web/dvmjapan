"use client";

import { PlayCircle } from "lucide-react";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";

export default function ThirtySecSeriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container-custom max-w-4xl">
        <PageBreadcrumb items={[{ label: "About Us", href: "/about" }, { label: "Our 30 Sec Series" }]} />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Our 30 Sec Series</h1>
        <p className="text-teal-600 text-sm font-semibold mb-10">
          Fast, informative updates in 30 seconds.
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
              <PlayCircle className="h-12 w-12 text-teal-600" />
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed text-center max-w-2xl mx-auto">
            Short, focused videos covering auction tips, vehicle inspection, shipping updates, and market insights. New 30-second episodes added regularly—subscribe to stay informed.
          </p>
          <p className="text-slate-500 text-sm text-center mt-6">Video series coming soon.</p>
        </div>
      </div>
    </div>
  );
}
