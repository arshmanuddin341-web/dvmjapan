"use client";

import { useState } from "react";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { Search, Ship, MapPin, Calendar, CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TrackingPage() {
    const [stockId, setStockId] = useState("");
    const [trackingData, setTrackingData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stockId) return;

        setLoading(true);
        setError("");
        setTrackingData(null);

        try {
            // Mocking the tracking API for now as we need real data to be entered by admin
            // In a real scenario, this would fetch from /api/tracking?stockId=...
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock result if Stock ID contains 'DVM'
            if (stockId.toUpperCase().includes("DVM")) {
                setTrackingData({
                    vessel: "GLORIOUS LEADER V.42",
                    status: "In Transit",
                    origin: "Yokohama, Japan",
                    destination: "Mombasa, Kenya",
                    etd: "2026-05-15",
                    eta: "2026-06-20",
                    updates: [
                        { date: "2026-06-01", status: "Vessel departed from Singapore transshipment port", location: "Singapore" },
                        { date: "2026-05-20", status: "Vessel in transit to Singapore", location: "East China Sea" },
                        { date: "2026-05-16", status: "Vessel departed from Yokohama", location: "Yokohama, Japan" },
                        { date: "2026-05-10", status: "Vehicle loaded onto vessel", location: "Yokohama Port" },
                        { date: "2026-05-05", status: "Export certificate issued", location: "Tokyo, Japan" },
                    ]
                });
            } else {
                setError("No tracking information found for this Stock ID. Please ensure the ID is correct or contact support.");
            }
        } catch (err) {
            setError("An error occurred while fetching tracking data.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <div className="bg-[#1A1F3C] pt-32 pb-20 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <Ship className="absolute -bottom-10 -right-10 w-96 h-96" />
                </div>
                <div className="container-custom relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Track Your <span className="text-teal-400">Shipment</span></h1>
                    <p className="text-slate-300 max-w-2xl mx-auto mb-10">
                        Enter your Stock ID or Chassis Number to get real-time updates on your vehicle's journey from Japan to your doorstep.
                    </p>

                    <form onSubmit={handleTrack} className="max-w-xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Enter Stock ID (e.g. DVM-1234)"
                            className="w-full h-16 px-6 pr-16 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-teal-500/50 backdrop-blur-md transition-all text-lg font-bold"
                            value={stockId}
                            onChange={(e) => setStockId(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 w-12 rounded-xl bg-teal-500 hover:bg-teal-600 text-white flex items-center justify-center transition-all disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                        </button>
                    </form>
                </div>
            </div>

            <div className="container-custom -mt-10">
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="max-w-2xl mx-auto p-6 rounded-2xl bg-white border-2 border-red-100 shadow-xl flex gap-4 items-center"
                        >
                            <AlertCircle className="h-8 w-8 text-red-500 shrink-0" />
                            <p className="text-slate-600 font-medium">{error}</p>
                        </motion.div>
                    )}

                    {trackingData && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto space-y-6"
                        >
                            {/* Summary Card */}
                            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Status</p>
                                        <div className="flex items-center gap-2">
                                            <span className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
                                            <p className="text-xl font-black text-slate-900">{trackingData.status}</p>
                                        </div>
                                        <p className="text-sm text-slate-500">{trackingData.vessel}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</p>
                                        <div className="flex items-center gap-3">
                                            <p className="font-bold text-slate-900">{trackingData.origin}</p>
                                            <Ship className="h-4 w-4 text-slate-300" />
                                            <p className="font-bold text-slate-900">{trackingData.destination}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estimated Arrival</p>
                                        <p className="text-xl font-black text-teal-600">{trackingData.eta}</p>
                                        <p className="text-xs text-slate-400">ETD: {trackingData.etd}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl">
                                <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-teal-500" />
                                    Shipment History
                                </h3>
                                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                                    {trackingData.updates.map((update: any, i: number) => (
                                        <div key={i} className="relative pl-10">
                                            <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center ${i === 0 ? "bg-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.5)]" : "bg-slate-200"}`}>
                                                {i === 0 && <CheckCircle2 className="h-3 w-3 text-white" />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 mb-0.5">{update.date}</p>
                                                <p className={`font-bold ${i === 0 ? "text-slate-900" : "text-slate-500"}`}>{update.status}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {update.location}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {!trackingData && !loading && (
                <div className="container-custom mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { icon: Ship, title: "Ocean Freight", desc: "Real-time vessel tracking across global shipping lanes." },
                        { icon: Calendar, title: "ETA Forecasting", desc: "Accurate arrival predictions based on port congestion and weather." },
                        { icon: CheckCircle2, title: "Document Portal", desc: "Easy access to BL and export certificates once cleared." }
                    ].map((feature, i) => {
                        const Icon = feature.icon;
                        return (
                            <div key={i} className="text-center p-6 space-y-3">
                                <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-50 flex items-center justify-center mb-4">
                                    <Icon className="h-8 w-8 text-teal-600" />
                                </div>
                                <h4 className="font-bold text-slate-900">{feature.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
