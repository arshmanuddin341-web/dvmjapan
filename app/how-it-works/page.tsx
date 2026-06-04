"use client";

import { motion } from "framer-motion";
import { Search, ShieldCheck, Wallet, Truck, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import WatermarkedImage from "@/components/ui/WatermarkedImage";
import PageHero from "@/components/layout/PageHero";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { routes } from "@/config/routes";

const steps = [
    {
        icon: Search,
        title: "1. Search & Select",
        description: "Browse our inventory or access 150+ live Japanese auctions. We help you find the perfect vehicle, translate auction sheets, and provide condition guidance.",
    },
    {
        icon: ShieldCheck,
        title: "2. Verify & Inspect",
        description: "Every vehicle undergoes a professional inspection. We provide high-resolution photos and official grading so you know exactly what you are buying.",
    },
    {
        icon: Wallet,
        title: "3. Secure Payment",
        description: "Once you select a car, we handle the bidding and purchase. We accept bank transfers (SWIFT) with full transparency and secure payment confirmation.",
    },
    {
        icon: Truck,
        title: "4. Export & Delivery",
        description: "We handle all Japan-side logistics, including export documentation, marine insurance, and shipping to your destination port (RoRo or Container).",
    },
];

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen bg-white pb-20 pt-2">
            <PageHero
                title="Direct From Japan To Your Door"
                subtitle="A simple, secure, and transparent 4-step process to import your next vehicle."
                variant="navy"
            />

            <div className="container-custom py-10">
                <PageBreadcrumb items={[{ label: "Home", href: routes.home }, { label: "How to Buy" }]} />

                {/* Process Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="relative p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:border-teal-200 hover:bg-white hover:shadow-xl transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <step.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Why DVM */}
                <div className="mt-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-100 shadow-2xl">
                        <WatermarkedImage
                            src="https://images.unsplash.com/photo-1549241520-2ce006509f61?auto=format&fit=crop&w=1200&q=80"
                            alt="Japan Export Logistics"
                            fill
                        />
                        <div className="absolute inset-0 bg-brand-navy/10" />
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-brand-navy mb-6 tracking-tight leading-tight">
                            Transparent Export Services <br /> <span className="text-teal-600">You Can Rely On</span>
                        </h2>
                        <div className="space-y-6">
                            {[
                                "Licensed access to major auction houses across Japan.",
                                "Professional inspection reports and engine health checks.",
                                "Full door-to-port logistics and shipping documentation.",
                                "Real-time tracking from purchase to final delivery."
                            ].map((text, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="mt-1 w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="h-3 w-3 text-teal-600" />
                                    </div>
                                    <p className="text-slate-700 font-medium">{text}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 flex gap-4">
                            <Link href={routes.inventory} className="px-8 py-4 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-all flex items-center gap-2">
                                Browse Stock <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href={routes.contact} className="px-8 py-4 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all">
                                Contact Agent
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
