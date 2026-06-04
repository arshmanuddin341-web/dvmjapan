"use client";

import { useState } from "react";
import { Ship, Globe, Info, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ShippingCalculatorProps {
    fobPrice: number;
}

const SHIPPING_DATA = [
    { region: "East Africa", ports: ["Mombasa, Kenya", "Dar es Salaam, Tanzania"], rate: 1200 },
    { region: "West Africa", ports: ["Lagos, Nigeria", "Tema, Ghana", "Cotonou, Benin"], rate: 1800 },
    { region: "Southern Africa", ports: ["Durban, South Africa", "Walvis Bay, Namibia"], rate: 1400 },
    { region: "Caribbean", ports: ["Kingston, Jamaica", "Port of Spain, Trinidad", "Georgetown, Guyana"], rate: 2200 },
    { region: "South Asia", ports: ["Karachi, Pakistan", "Colombo, Sri Lanka", "Chittagong, Bangladesh"], rate: 800 },
    { region: "Pacific", ports: ["Auckland, New Zealand", "Suva, Fiji"], rate: 1100 },
];

export default function ShippingCalculator({ fobPrice }: ShippingCalculatorProps) {
    const [selectedRegion, setSelectedRegion] = useState(SHIPPING_DATA[0]);
    const [selectedPort, setSelectedPort] = useState(SHIPPING_DATA[0].ports[0]);
    const [isOpen, setIsOpen] = useState(false);

    const inspectionFee = 150;
    const insurance = 100;
    const freight = selectedRegion.rate;
    const totalCif = fobPrice + freight + inspectionFee + insurance;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
            <div
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-50 flex items-center justify-center">
                        <Ship className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">Shipping Calculator</h3>
                        <p className="text-xs text-slate-500">Estimate CIF price to your port</p>
                    </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100"
                    >
                        <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Region</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500/20 outline-none"
                                        value={selectedRegion.region}
                                        onChange={(e) => {
                                            const region = SHIPPING_DATA.find(r => r.region === e.target.value)!;
                                            setSelectedRegion(region);
                                            setSelectedPort(region.ports[0]);
                                        }}
                                    >
                                        {SHIPPING_DATA.map(r => <option key={r.region} value={r.region}>{r.region}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Port</label>
                                    <select
                                        className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-teal-500/20 outline-none"
                                        value={selectedPort}
                                        onChange={(e) => setSelectedPort(e.target.value)}
                                    >
                                        {selectedRegion.ports.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-50 space-y-2">
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>FOB Price</span>
                                    <span className="font-bold">${fobPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>Freight (Estimated)</span>
                                    <span className="font-bold">${freight.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>Inspection & Insurance</span>
                                    <span className="font-bold">${(inspectionFee + insurance).toLocaleString()}</span>
                                </div>
                                <div className="pt-2 mt-2 border-t border-slate-200 flex justify-between items-center">
                                    <span className="text-sm font-black text-slate-900">Total CIF</span>
                                    <span className="text-lg font-black text-red-600">${totalCif.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 p-3 rounded-lg bg-teal-50 border border-teal-100 items-start">
                                <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-teal-800 leading-normal">
                                    CIF (Cost, Insurance & Freight) includes delivery to your port. Import duties and taxes in your country are not included. Rate is for 40ft container shared (RORO).
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
