"use client";

import { motion } from "framer-motion";
import { DollarSign, ShieldCheck, FileText, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { routes } from "@/config/routes";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-white pb-20 pt-2">
            <PageHero
                title="Pricing & Transparency"
                subtitle="No hidden fees. We provide a clear breakdown of vehicle costs, auction fees, and shipping."
                variant="navy"
            />

            <div className="container-custom py-10">
                <PageBreadcrumb items={[{ label: "Home", href: routes.home }, { label: "Pricing" }]} />

                <div className="mt-16 max-w-5xl mx-auto">
                    {/* Price Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-200">
                            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mb-6">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">FOB Price Breakdown</h2>
                            <ul className="space-y-4">
                                {[
                                    "Vehicle Auction Cost (Hammer Price)",
                                    "Auction Bidding Fees & Handling",
                                    "Japan Domestic Transport (Auction to Port)",
                                    "Customs Clearance & Export Documentation",
                                    "Radiation Testing (Required for most ports)"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-slate-600 font-medium">
                                        <CheckCircle2 className="h-5 w-5 text-teal-600 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-10 rounded-[2.5rem] bg-brand-navy text-white">
                            <div className="w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center mb-6">
                                <ShieldCheck className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-6 tracking-tight">CIF Price (Total Export)</h2>
                            <p className="text-slate-400 mb-8 leading-relaxed">
                                CIF = FOB + Marine Insurance + Ocean Freight. This is the total price to deliver the car to your destination port.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Ocean Freight (Vessel Space)",
                                    "Comprehensive Marine Insurance",
                                    "DHL Express Document Delivery",
                                    "Vessel Tracking Support"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-slate-300 font-medium">
                                        <CheckCircle2 className="h-5 w-5 text-teal-400 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Payment Terms */}
                    <div className="p-10 rounded-3xl border border-teal-100 bg-teal-50/30">
                        <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                            <FileText className="h-6 w-6 text-teal-600" />
                            Payment & Bank Terms
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-4">How to Pay</p>
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    All payments to DVM JAPAN should be made via **Telegraphic Transfer (TT)** to our corporate bank account in Japan.
                                </p>
                                <div className="p-4 rounded-xl bg-white border border-teal-200">
                                    <p className="text-xs text-slate-500 mb-2">Required for Auction Bidding</p>
                                    <p className="text-sm font-bold text-slate-900">Minimum 50% Deposit</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-4">Official Currency</p>
                                <p className="text-slate-700 leading-relaxed mb-6">
                                    We accept payments in **USD ($)** and **JPY (¥)**. The exchange rate is locked at the time of invoice issuance.
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                        <div className="w-2 h-2 rounded-full bg-green-500" /> Secure SWIFT
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                                        <div className="w-2 h-2 rounded-full bg-green-500" /> Verified Accounts
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Refund Policy */}
                    <div className="mt-12 flex gap-6 p-8 rounded-2xl bg-amber-50 border border-amber-200">
                        <AlertCircle className="h-6 w-6 text-amber-600 shrink-0" />
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">Important Notice</h4>
                            <p className="text-sm text-slate-700 leading-relaxed">
                                If we are unable to win the vehicle at auction for your target price, your deposit is fully refundable or can be applied to another vehicle.
                                Once a vehicle is successfully purchased, the deposit becomes non-refundable as we pay the auction house immediately.
                            </p>
                        </div>
                    </div>

                    <div className="mt-16 text-center">
                        <Link href={routes.contact} className="inline-flex items-center gap-2 text-teal-600 font-bold hover:text-teal-700 transition-all text-lg">
                            Check current bank details <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
