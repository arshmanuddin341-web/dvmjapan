"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Vehicle } from "@/types";
import { routes } from "@/config/routes";
import Link from "next/link";
import WatermarkedImage from "@/components/ui/WatermarkedImage";

export default function VisualGallerySection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGalleryVehicles() {
      try {
        const res = await fetch("/api/vehicles?limit=12&featured=true");
        if (res.ok) {
          const data = await res.json();
          setVehicles(data.vehicles || []);
        }
      } catch (err) {
        console.error("Failed to fetch gallery vehicles:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGalleryVehicles();
  }, []);

  // Variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="section bg-transparent py-12 md:py-16" aria-labelledby="gallery-heading">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 id="gallery-heading" className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            Our <span className="text-teal-500">Premium Inventory</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Browse through our exclusive selection of high-quality Japanese vehicles, directly sourced from top auctions.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-white/5 animate-pulse border border-white/10" />
            ))}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {vehicles.map((v) => (
              <motion.div
                key={v.id}
                variants={itemVariants}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-slate-900"
              >
                <Link href={routes.vehicleDetail(v.id)} className="block w-full h-full">
                  <WatermarkedImage
                    src={v.images?.[0] || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"}
                    alt={`${v.make} ${v.model}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white font-bold text-xs truncate">{v.year} {v.make}</p>
                    <p className="text-teal-400 font-bold text-[10px] uppercase tracking-widest">{v.model}</p>
                  </div>
                  {/* Stock ID Badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10 text-[9px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {v.stockId}
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-12 text-center">
          <Link
            href={routes.inventory}
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-lg hover:shadow-teal-500/20 active:scale-95"
          >
            View full inventory
          </Link>
        </div>
      </div>
    </section>
  );
}
