"use client";

import { useState, useEffect } from "react";
import WatermarkedImage from "@/components/ui/WatermarkedImage";
import Link from "next/link";
import PageBreadcrumb from "@/components/layout/PageBreadcrumb";
import { routes } from "@/config/routes";
import { Vehicle } from "@/types";
import { Loader2, Car } from "lucide-react";

export default function GalleryPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      try {
        // Fetch up to 24 vehicles for the gallery
        const res = await fetch("/api/vehicles?limit=24&sort=createdAt&order=desc");
        if (res.ok) {
          const data = await res.json();
          setVehicles(data.vehicles || []);
        }
      } catch (err) {
        console.error("Failed to fetch gallery images:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-0 pb-16">
      <div className="container-custom max-w-5xl">
        <PageBreadcrumb items={[{ label: "About Us", href: "/about" }, { label: "Gallery" }]} />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">Gallery</h1>
        <p className="text-teal-600 text-sm font-semibold mb-10">
          Browse premium Japanese vehicles & machinery from our live stock.
        </p>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p>Loading real-time gallery...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <Car className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No vehicles in gallery</h3>
            <p className="text-slate-500">Wait for the inventory to be updated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <Link
                key={v.id}
                href={routes.vehicleDetail(v.id)}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-md bg-white border border-slate-200 hover:border-teal-500/50 transition-all duration-300"
              >
                <WatermarkedImage
                  src={v.images?.[0] || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"}
                  alt={`${v.make} ${v.model}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white font-bold text-sm">{v.year} {v.make}</p>
                  <p className="text-teal-400 font-medium text-xs truncate">{v.model}</p>
                  <div className="mt-2 text-[10px] text-white/70 font-mono tracking-wider">
                    STOCK: {v.stockId}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href={routes.inventory}
            className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-lg hover:shadow-teal-500/20 transition-all active:scale-95"
          >
            View full inventory
          </Link>
        </div>
      </div>
    </div>
  );
}
