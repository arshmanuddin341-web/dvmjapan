"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, X, Calculator } from "lucide-react";

const currencies = [
  { code: "USD", name: "US Dollar" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "AED", name: "UAE Dirham" },
  { code: "PKR", name: "Pakistani Rupee" },
  { code: "INR", name: "Indian Rupee" },
  { code: "CNY", name: "Chinese Yuan" },
];

const mockRates: Record<string, number> = {
  USD: 1, JPY: 150.5, EUR: 0.92, GBP: 0.79, AED: 3.67, PKR: 278.5, INR: 83.2, CNY: 7.2,
};

export default function RatesConverter() {
  const [isOpen, setIsOpen] = useState(false);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("JPY");
  const [amount, setAmount] = useState("1");
  const [rates, setRates] = useState(mockRates);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const convert = () => {
    const from = rates[fromCurrency] || 1;
    const to = rates[toCurrency] || 1;
    return ((parseFloat(amount) || 0) / from * to).toFixed(2);
  };

  const refreshRates = () => { setRates(mockRates); setLastUpdate(new Date()); };
  const swap = () => { setFromCurrency(toCurrency); setToCurrency(fromCurrency); };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-5 z-50 w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white transition-all duration-300 hover:scale-105 hover:bg-slate-700 active:scale-95 cursor-pointer shadow-lg shadow-slate-900/30 touch-manipulation"
        title="Currency Converter"
        aria-label="Open currency converter"
      >
        <Calculator className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] cursor-pointer"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-4 right-4 left-4 sm:left-auto sm:bottom-24 sm:right-5 z-[101] w-[calc(100vw-2rem)] sm:w-[340px] max-w-[340px] mx-auto sm:mx-0 rounded-2xl border border-white/[0.08] bg-[#0c0c0f]/95 backdrop-blur-xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Calculator className="h-4 w-4 text-teal-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Currency Converter</h3>
                    <p className="text-[10px] text-zinc-500">Rates for reference</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">From</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                      placeholder="0"
                    />
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="rounded-xl border border-white/10 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan-500/50"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code} className="bg-white text-slate-900">
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={swap}
                    className="p-2 rounded-full border border-white/10 bg-white/5 text-teal-500 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-zinc-500 uppercase tracking-wider mb-2">To</label>
                  <div className="flex gap-2">
                    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white">
                      {convert()}
                    </div>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="rounded-xl border border-white/10 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-cyan-500/50"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code} className="bg-white text-slate-900">
                          {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    1 {fromCurrency} = {((rates[toCurrency] || 1) / (rates[fromCurrency] || 1)).toFixed(4)} {toCurrency}
                  </span>
                  <button type="button" onClick={refreshRates} className="p-1.5 rounded text-zinc-500 hover:text-teal-500 transition-colors cursor-pointer">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-zinc-400">Updated {lastUpdate.toLocaleTimeString()}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
