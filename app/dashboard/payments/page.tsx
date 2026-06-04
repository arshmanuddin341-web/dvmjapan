"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { routes } from "@/config/routes";

const demoPayments = [
  {
    id: "PAY-2024-001",
    orderId: "ORD-2024-001",
    amount: 18500,
    status: "paid",
    statusLabel: "Paid",
    date: "Jan 15, 2026",
    description: "2021 Toyota Land Cruiser Prado - FOB",
  },
  {
    id: "PAY-2024-002",
    orderId: "ORD-2024-002",
    amount: 4200,
    status: "pending",
    statusLabel: "Pending",
    date: "Jan 28, 2026",
    description: "Shipping & Documentation - ORD-2024-002",
  },
];

export default function PaymentsPage() {
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-black text-white mb-2">Payments</h1>
        <p className="text-zinc-400">
          View and manage your payments for vehicle imports
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <DollarSign className="h-8 w-8 text-cyan-400 mb-3" />
          <p className="text-2xl font-black text-white">$22,700</p>
          <p className="text-sm text-zinc-500">Total Spent</p>
        </motion.div>
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <CheckCircle className="h-8 w-8 text-green-400 mb-3" />
          <p className="text-2xl font-black text-white">1</p>
          <p className="text-sm text-zinc-500">Paid</p>
        </motion.div>
        <motion.div
          className="card p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Clock className="h-8 w-8 text-amber-400 mb-3" />
          <p className="text-2xl font-black text-white">1</p>
          <p className="text-sm text-zinc-500">Pending</p>
        </motion.div>
      </div>

      <h2 className="text-xl font-bold text-white mb-4">Payment History</h2>
      <div className="space-y-4">
        {demoPayments.map((payment, index) => (
          <motion.div
            key={payment.id}
            className="card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 4) }}
          >
            <div>
              <p className="text-xs text-cyan-400 font-mono mb-1">{payment.id}</p>
              <p className="text-white font-semibold">{payment.description}</p>
              <p className="text-sm text-zinc-500 mt-1">{payment.date}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-xl font-bold text-white">${payment.amount.toLocaleString()}</p>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  payment.status === "paid"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-amber-500/20 text-amber-400"
                }`}
              >
                {payment.statusLabel}
              </span>
              {payment.status === "pending" && (
                <button
                  type="button"
                  className="btn-primary text-sm px-4 py-2 cursor-pointer"
                  onClick={() => setSelectedPayment(payment.id)}
                >
                  Pay Now
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {selectedPayment && (
        <motion.div
          className="card p-6 mt-6 border border-cyan-500/30 bg-cyan-500/5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white mb-1">Payment processing</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Demo mode: Payment integration will be connected to your backend. For now, this is a placeholder.
              </p>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="text-sm text-cyan-400 hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <motion.p
        className="mt-6 text-sm text-zinc-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Need help with a payment?{" "}
        <Link href={routes.contact} className="text-cyan-400 hover:underline cursor-pointer">
          Contact support
        </Link>
      </motion.p>
    </div>
  );
}
