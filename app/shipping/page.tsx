"use client";

import { motion } from "framer-motion";
import { Ship, Anchor, Globe, MapPin, CheckCircle2, Info } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { routes } from "@/config/routes";

const regions = [
    {
        name: "Africa",
        ports: ["Mombasa (Kenya)", "Dar es Salaam (Tanzania)", "Durban (South Africa)", "Port Louis (Mauritius)"],
        leadTime: "30-45 Days",
    },
    {
        name: "Middle East",
        ports: ["Jebel Ali (UAE)", "Aqaba (Jordan)", "Sohar (Oman)", "Hamad (Qatar)"],
        leadTime: "15-25 Days",
    },
    {
        name: "Europe & UK",
        ports: ["Tilbury (UK)", "Dublin (Ireland)", "Antwerp (Belgium)", "Hamburg (Germany)"],
        leadTime: "40-55 Days",
    },
    {
        name: "Asia Pacific",
        ports: ["Singapore", "Port Klang (Malaysia)", "Suva (Fiji)", "Auckland (New Zealand)"],
        leadTime: "10-20 Days",
    },
];

export default function ShippingPage() {
    return (
        <div className="min-h-screen bg-white pb-20 pt-2">
            <PageHero
                title="Global Shipping & Logistics"
                subtitle="We deliver vehicles from Japan to over 50 ports worldwide with full insurance coverage."
                variant="navy"
            />

            <div className="container-custom py-10">
                <PageBreadcrumb items={[{ label: "Home", href: routes.home }, { label: "Shipping" }]} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-16 items-start">
                    {/* Shipping Methods */}
                    <div>
                        <h2 className="text-3xl font-black text-brand-navy mb-8 tracking-tight">Shipping Methods</h2>
                        <div className="space-y-6">
                            <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-teal-300 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
                                        <Ship className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">RoRo (Roll-on/Roll-off)</h3>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                    The most common and cost-effective method. Cars are driven onto a specialized vessel and secured inside the deck. Best for passenger cars and SUVs.
                                </p>
                                <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 w-fit px-3 py-1.5 rounded-full">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> High Frequency Schedules
                                </div>
                            </div>

                            <div className="p-8 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-teal-300 transition-all">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
                                        <Anchor className="h-6 w-6 text-teal-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900">Container Shipping</h3>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                    Vehicles are loaded into 20ft or 40ft containers. Ideal for premium luxury cars, multiple units, or when extra protection and shipping parts together is required.
                                </p>
                                <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 w-fit px-3 py-1.5 rounded-full">
                                    <CheckCircle2 className="h-3.5 w-3.5" /> Extra Protection & Security
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Regional Table */}
                    <div className="bg-brand-navy rounded-[2.5rem] p-8 md:p-12 text-white">
                        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <Globe className="h-6 w-6 text-teal-400" />
                            Regional Lead Times
                        </h2>
                        <div className="space-y-8">
                            {regions.map((region, i) => (
                                <div key={i} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-white">{region.name}</h3>
                                        <span className="text-teal-400 font-bold text-sm bg-teal-400/10 px-3 py-1 rounded-lg">
                                            {region.leadTime}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {region.ports.map((port, j) => (
                                            <span key={j} className="flex items-center gap-1.5 text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                                                <MapPin className="h-3 w-3 text-teal-500" />
                                                {port}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10">
                            <div className="flex gap-4 items-start">
                                <Info className="h-5 w-5 text-teal-400 shrink-0 mt-1" />
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Lead times are estimated from vehicle purchase date to port arrival. Variations may occur based on shipping company schedules and seasonal demand.
                                    Marine insurance is included in all CIF quotes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
