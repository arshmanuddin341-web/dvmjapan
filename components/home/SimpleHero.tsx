"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SimpleHero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/70 to-dark-950/50 pointer-events-none" aria-hidden="true" />
      
      {/* Content */}
      <div className="relative z-10 container-custom py-32">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Heading with Animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="text-white">Import Premium</span>
              <br />
              <span className="gradient-text">Japanese Vehicles</span>
            </motion.h1>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Access thousands of quality used cars from Japan's largest auction network.
            <br />
            <span className="text-gold-400 font-semibold">Transparent pricing • Reliable shipping • Expert support</span>
          </motion.p>

          {/* Search Bar with Animation */}
          <motion.div
            className="max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gold-400 group-focus-within:text-gold-300 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by make, model, or stock ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 rounded-xl bg-dark-900/80 backdrop-blur-md border-2 border-dark-700 text-white placeholder-gray-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/50 transition-all duration-300 text-lg"
                />
                <motion.div
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-5 w-5 text-gold-400/50" />
                </motion.div>
              </div>
              <Link
                href={`/inventory${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`}
                className="btn-primary whitespace-nowrap flex items-center justify-center gap-2 text-lg px-10"
              >
                Search Vehicles
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>

          {/* Quick Stats with Animation */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {[
              { value: "10,000+", label: "Vehicles Available" },
              { value: "120+", label: "Auction Houses" },
              { value: "50+", label: "Countries Served" },
              { value: "15+", label: "Years Experience" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="card p-6 text-center glow-effect"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-4xl font-black gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-gold-500/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1 h-3 bg-gold-500 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
