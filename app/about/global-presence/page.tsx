"use client";

import { Globe } from "lucide-react";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";

export default function GlobalPresencePage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container-custom max-w-4xl">
        <PageBreadcrumb items={[{ label: "About Us", href: "/about" }, { label: "Global Presence" }]} />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Global Presence</h1>
        <p className="text-teal-600 text-sm font-semibold mb-10">
          Trusted Japanese vehicles & machinery, delivered globally.
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <Globe className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          <p className="text-slate-700 leading-relaxed text-center max-w-2xl mx-auto">
            We serve customers in over 50 countries across six continents. Our global network of shipping partners, inspection facilities, and support teams ensures that every vehicle reaches its destination safely and on time. From Africa to the Caribbean, Europe to Asia, DVM JAPAN is your trusted partner for Japanese vehicle imports worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}
