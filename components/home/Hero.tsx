"use client";

import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=92')] bg-cover bg-center opacity-20 pointer-events-none" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/80 pointer-events-none" aria-hidden="true" />

      <div className="relative container-custom py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Import Premium Japanese Vehicles
            <span className="block text-primary-400">Direct from Japan</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Access thousands of quality used cars from Japan's largest auction network. 
            Transparent pricing, reliable shipping, and expert support worldwide.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by make, model, or stock ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <Link
                href={`/inventory${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`}
                className="btn-primary whitespace-nowrap flex items-center justify-center gap-2"
              >
                Search Vehicles
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div>
              <div className="text-3xl font-bold text-primary-400">10,000+</div>
              <div className="text-sm text-gray-400 mt-1">Vehicles Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-400">120+</div>
              <div className="text-sm text-gray-400 mt-1">Auction Houses</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-400">50+</div>
              <div className="text-sm text-gray-400 mt-1">Countries Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-400">15+</div>
              <div className="text-sm text-gray-400 mt-1">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
