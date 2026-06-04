"use client";

import { useCompare } from "@/context/CompareContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRightLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import WatermarkedImage from "@/components/ui/WatermarkedImage";

export default function CompareBar() {
    const { compareList, removeFromCompare, clearCompare } = useCompare();

    if (compareList.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[95%] max-w-2xl bg-white border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl p-4 flex items-center justify-between gap-4 overflow-hidden"
            >
                <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-1">
                    {compareList.map((v) => (
                        <div key={v.id} className="relative flex-shrink-0 group">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200">
                                <WatermarkedImage src={v.images?.[0] || ""} alt={v.make} fill className="object-cover" />
                            </div>
                            <button
                                onClick={() => removeFromCompare(v.id)}
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    {compareList.length < 4 && (
                        <div className="w-14 h-14 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                            <span className="text-[10px] font-bold">ADD</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={clearCompare}
                        className="p-2.5 rounded-xl border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Clear all"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                        href="/compare"
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 transition-all active:scale-95 whitespace-nowrap"
                    >
                        <ArrowRightLeft className="h-4 w-4" />
                        Compare Now
                    </Link>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
