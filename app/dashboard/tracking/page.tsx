"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";

const demoOrders = [
  {
    id: "ORD-2024-001",
    vehicle: "2021 Toyota Land Cruiser Prado",
    status: "in_transit",
    statusLabel: "In Transit",
    location: "En route to Mombasa Port",
    eta: "Feb 15, 2026",
    steps: [
      { label: "Purchased", done: true },
      { label: "Documentation", done: true },
      { label: "Loaded at Yokohama", done: true },
      { label: "In Transit", done: true },
      { label: "Arrival at Port", done: false },
      { label: "Customs Clearance", done: false },
    ],
  },
  {
    id: "ORD-2024-002",
    vehicle: "2020 Nissan Patrol",
    status: "processing",
    statusLabel: "Processing",
    location: "Documentation in progress",
    eta: "Mar 1, 2026",
    steps: [
      { label: "Purchased", done: true },
      { label: "Documentation", done: true },
      { label: "Loaded at Yokohama", done: false },
      { label: "In Transit", done: false },
      { label: "Arrival at Port", done: false },
      { label: "Customs Clearance", done: false },
    ],
  },
];

export default function TrackingPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-black text-white mb-2">My Car Tracking</h1>
        <p className="text-zinc-400">Track your imported vehicles from Japan to your destination</p>
      </motion.div>

      <div className="space-y-6">
        {demoOrders.map((order, index) => (
          <motion.div
            key={order.id}
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <p className="text-xs text-cyan-400 font-mono mb-1">{order.id}</p>
                <h2 className="text-xl font-bold text-white">{order.vehicle}</h2>
                <p className="text-sm text-zinc-500 mt-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {order.location}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                  order.status === "in_transit" ? "bg-cyan-500/20 text-cyan-400" : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {order.statusLabel}
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-sm mb-6">
              <Clock className="h-4 w-4" />
              <span>ETA: {order.eta}</span>
            </div>
            <div className="space-y-3">
              {order.steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      step.done ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-zinc-600"
                    }`}
                  >
                    {step.done ? <CheckCircle className="h-4 w-4" /> : <span className="text-sm font-bold">{i + 1}</span>}
                  </div>
                  <span className={step.done ? "text-zinc-300" : "text-zinc-500"}>{step.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-sm text-zinc-500">
        Questions? <Link href={routes.contact} className="text-cyan-400 hover:underline cursor-pointer">Contact support</Link>
      </p>
    </div>
  );
}
