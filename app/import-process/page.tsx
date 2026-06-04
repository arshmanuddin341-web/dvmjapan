"use client";

import { motion } from "framer-motion";
import { ClipboardList, Globe, ShieldCheck, Ship, FileCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { routes } from "@/config/routes";

const stages = [
    {
        icon: ClipboardList,
        title: "1. Quotation & Invoice",
        desc: "Once you select a car, we provide a detailed Proforma Invoice (PI) including FOB and CIF costs for your destination port.",
    },
    {
        icon: ShieldCheck,
        title: "2. Payment Confirmation",
        desc: "Payment is made via Bank Transfer (TT). Once we confirm receipt, we finalize the vehicle purchase and move it to the export yard.",
    },
    {
        icon: Ship,
        title: "3. Booking & Shipment",
        desc: "We book the next available vessel for your port. The vehicle is cleaned, the radiation test is performed, and it's loaded onto the ship.",
    },
    {
        icon: FileCheck,
        title: "4. Documentation",
        desc: "After the ship departs, we process the Bill of Lading (B/L) and other official export documents and courier them to you via DHL.",
    },
];

export default function ImportProcessPage() {
    return (
        <div className="min-h-screen bg-white pb-20 pt-2">
            <PageHero
                title="Official Import Guide"
                subtitle="Step-by-step guidance on how to import your vehicle from Japan to your country."
                variant="navy"
            />

            <div className="container-custom py-10">
                <PageBreadcrumb items={[{ label: "Home", href: routes.home }, { label: "Import Process" }]} />

                <div className="mt-16 max-w-4xl mx-auto">
                    <div className="space-y-12">
                        {stages.map((stage, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="flex flex-col md:flex-row gap-8 items-start relative"
                            >
                                {i < stages.length - 1 && (
                                    <div className="hidden md:block absolute left-7 top-16 bottom-0 w-0.5 bg-slate-100" />
                                )}
                                <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-lg relative z-10">
                                    <stage.icon className="h-7 w-7" />
                                </div>
                                <div className="pt-2">
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{stage.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-lg mb-6">{stage.desc}</p>

                                    {i === 3 && (
                                        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Required Documents</p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {["Bill of Lading", "Export Certificate", "Commercial Invoice", "Insurance Policy", "JEVIC / QISJ"].map((doc) => (
                                                    <div key={doc} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                                                        <CheckCircle2 className="h-4 w-4 text-teal-600" />
                                                        {doc}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 p-10 rounded-[2.5rem] bg-brand-navy text-white text-center">
                        <h2 className="text-2xl font-bold mb-4">Need Country Specific Advice?</h2>
                        <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                            Import regulations vary by country. Our agents can help you with age limits, tax structures, and local clearance requirements.
                        </p>
                        <Link href={routes.contact} className="inline-flex px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all">
                            Talk to a Regional Expert
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
