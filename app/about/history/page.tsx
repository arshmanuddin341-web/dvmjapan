"use client";

import { Clock } from "lucide-react";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";

const milestones = [
  { year: "2010", title: "Foundation", text: "DVM JAPAN founded with a vision to make Japanese vehicle imports accessible worldwide." },
  { year: "2013", title: "Growth", text: "First 1,000 vehicles exported; strong relationships with Japanese auction houses." },
  { year: "2016", title: "Expansion", text: "Operations in 25 countries; online platform launched." },
  { year: "2020", title: "10,000+ vehicles", text: "Major milestone; advanced verification and cost tools introduced." },
  { year: "Today", title: "Global leader", text: "50+ countries, 10,000+ satisfied customers, 50,000+ vehicles in inventory." },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container-custom max-w-4xl">
        <PageBreadcrumb items={[{ label: "About Us", href: "/about" }, { label: "History" }]} />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">History</h1>
        <p className="text-teal-600 text-sm font-semibold mb-10">
          Global leaders in Japanese vehicle exports.
        </p>
        <div className="rounded-xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-slate-700">
              Our journey from a small team to a global exporter trusted by thousands.
            </p>
          </div>
          <ul className="space-y-6">
            {milestones.map((m) => (
              <li key={m.year} className="flex gap-4">
                <span className="font-bold text-teal-600 shrink-0 w-16">{m.year}</span>
                <div>
                  <h3 className="font-semibold text-slate-900">{m.title}</h3>
                  <p className="text-slate-600 text-sm mt-0.5">{m.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
