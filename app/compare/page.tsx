"use client";

import { useCompare } from "@/context/CompareContext";
import { useCurrency } from "@/context/CurrencyContext";
import WatermarkedImage from "@/components/ui/WatermarkedImage";
import { X, ArrowLeft, Fuel, Gauge, Settings, ShieldCheck, Trash2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { routes } from "@/config/routes";
import { formatMileage } from "@/lib/utils";

export default function ComparePage() {
    const { compareList, removeFromCompare, clearCompare } = useCompare();
    const { convertPrice } = useCurrency();

    const specs = [
        { label: "Year", key: "year" },
        { label: "Mileage", key: "mileage", format: (v: any) => `${formatMileage(v)} km` },
        { label: "Transmission", key: "transmission" },
        { label: "Fuel Type", key: "fuelType" },
        { label: "Engine", key: "engine", subKey: "displacement" },
        { label: "Body Type", key: "bodyType" },
        { label: "Color", key: "color" },
        { label: "Condition", key: "condition" },
        { label: "Auction Grade", key: "auctionGrade" },
    ];

    if (compareList.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                    <ArrowLeft className="h-8 w-8 text-slate-300" />
                </div>
                <h1 className="text-2xl font-black text-slate-900 mb-2">Comparison list is empty</h1>
                <p className="text-slate-500 mb-8 max-w-sm">Add vehicles from the inventory to compare their specifications and pricing.</p>
                <Link href={routes.inventory} className="px-8 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-all">
                    Browse Inventory
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <Link href={routes.inventory} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-teal-600 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Inventory
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={clearCompare}
                            className="px-4 py-2 rounded-lg text-red-500 text-sm font-bold hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Clear All
                        </button>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900">Compare Stock</h1>
                    </div>
                </div>

                <div className="overflow-x-auto pb-8">
                    <div className="min-w-[800px] bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-6 bg-slate-50/50 border-b border-slate-100 text-left w-64 align-bottom">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Specifications</p>
                                    </th>
                                    {compareList.map((v) => (
                                        <th key={v.id} className="p-6 border-b border-slate-100 text-left min-w-[200px] relative">
                                            <button
                                                onClick={() => removeFromCompare(v.id)}
                                                className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                            <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 border border-slate-100">
                                                <WatermarkedImage src={v.images?.[0] || ""} alt={v.make} fill className="object-cover" />
                                            </div>
                                            <p className="text-[10px] font-bold text-teal-600 uppercase mb-1">{v.make}</p>
                                            <h3 className="font-bold text-slate-900 leading-tight mb-2 truncate">{v.model}</h3>
                                            <p className="text-lg font-black text-red-600">
                                                {convertPrice(v.price.fob, v.price.currency)}
                                            </p>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {specs.map((spec, i) => (
                                    <tr key={spec.label} className={i % 2 === 0 ? "bg-slate-50/30" : ""}>
                                        <td className="p-6 border-b border-slate-100">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{spec.label}</span>
                                        </td>
                                        {compareList.map((v: any) => (
                                            <td key={v.id} className="p-6 border-b border-slate-100">
                                                <span className="text-sm font-bold text-slate-900">
                                                    {spec.format
                                                        ? spec.format(v[spec.key])
                                                        : spec.subKey
                                                            ? v[spec.key]?.[spec.subKey] || "—"
                                                            : v[spec.key] || "—"
                                                    }
                                                </span>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr>
                                    <td className="p-6 bg-slate-50/50"></td>
                                    {compareList.map((v) => (
                                        <td key={v.id} className="p-6 bg-slate-50/50">
                                            <Link
                                                href={routes.vehicleDetail(v.id)}
                                                className="w-full py-3 rounded-xl bg-teal-600 text-white font-bold text-center text-xs flex items-center justify-center gap-2 hover:bg-teal-700 transition-all"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
