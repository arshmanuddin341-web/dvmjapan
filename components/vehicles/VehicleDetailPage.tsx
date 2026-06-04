"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Vehicle } from "@/types";
import { formatMileage } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import WatermarkedImage from "@/components/ui/WatermarkedImage";
import {
  MapPin, Calendar, Gauge, Fuel, Settings, Phone, Mail,
  Share2, Heart, ShieldCheck, Globe, Car, ChevronLeft, ChevronRight,
  CheckCircle2, Info, MessageCircle, ArrowRightLeft
} from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { siteConfig } from "@/lib/site-config";
import { routes } from "@/config/routes";
import ShippingCalculator from "./ShippingCalculator";
import { useCompare } from "@/context/CompareContext";

interface VehicleDetailPageProps {
  vehicle: Vehicle;
}

export default function VehicleDetailPage({ vehicle }: VehicleDetailPageProps) {
  const { convertPrice } = useCurrency();
  const { addToCompare, isInCompare, removeFromCompare } = useCompare();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const inCompare = isInCompare(vehicle.id);

  const images = vehicle.images?.length
    ? vehicle.images
    : ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"];

  const prevImage = () => setSelectedImage((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextImage = () => setSelectedImage((i) => (i === images.length - 1 ? 0 : i + 1));

  const specs = [
    { icon: Calendar, label: "Year", value: vehicle.year },
    { icon: Gauge, label: "Mileage", value: `${formatMileage(vehicle.mileage)} km` },
    { icon: Settings, label: "Transmission", value: vehicle.transmission || "—" },
    { icon: Fuel, label: "Fuel Type", value: vehicle.engine?.fuel || "—" },
    { icon: Car, label: "Body Type", value: (vehicle as any).bodyType || "—" },
    { icon: MapPin, label: "Location", value: vehicle.location || "Japan" },
  ];

  const fobPrice = vehicle.price.fob;
  const priceDisplay = fobPrice > 0 ? convertPrice(fobPrice, vehicle.price.currency) : "Ask for Price";

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-16">
      <div className="container-custom">
        <Breadcrumbs />

        {/* Stock & Chassis badges */}
        <div className="flex flex-wrap items-center gap-2 mt-3 mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            Stock No: {vehicle.stockId}
          </span>
          {(vehicle as any).chassis && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
              <Info className="h-3.5 w-3.5" />
              Chassis: {(vehicle as any).chassis}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold border border-teal-200">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Certified Export Ready
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left column: image gallery + specs ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* IMAGE GALLERY */}
            <motion.div
              className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Main image */}
              <div className="relative h-[280px] sm:h-[400px] md:h-[480px] bg-slate-900 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <WatermarkedImage
                      src={images[selectedImage]}
                      alt={`${vehicle.make} ${vehicle.model} ${vehicle.year} — image ${selectedImage + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Nav arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Year badge */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/90 text-slate-900 text-xs font-bold backdrop-blur-sm">
                    {vehicle.year}
                  </span>
                </div>

                {/* Fav + Share */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all backdrop-blur-sm ${isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-slate-600 hover:text-red-500"}`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={() => navigator.share?.({ title: `${vehicle.make} ${vehicle.model} ${vehicle.year}`, url: window.location.href })}
                    className="w-9 h-9 rounded-xl bg-white/80 text-slate-600 hover:text-teal-600 flex items-center justify-center backdrop-blur-sm"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-full bg-black/50 text-white text-xs font-medium backdrop-blur-sm z-10">
                  {selectedImage + 1} / {images.length}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="p-2 bg-slate-50 border-t border-slate-100">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none custom-scrollbar">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImage(idx)}
                        className={`relative flex-shrink-0 w-20 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-teal-500 scale-95 shadow-sm" : "border-transparent opacity-70 hover:opacity-100"}`}
                      >
                        <WatermarkedImage
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* TITLE + PRICE (mobile) */}
            <motion.div
              className="lg:hidden p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">{vehicle.make}</p>
              <h1 className="text-xl font-black text-slate-900">{vehicle.make} {vehicle.model}</h1>
              <div className="mt-3 flex items-end gap-3">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FOB Price</p>
                  <p className="text-2xl font-black text-red-600">{priceDisplay}</p>
                </div>
              </div>
            </motion.div>

            {/* SPECS GRID */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.12 }}
            >
              {specs.map((spec, i) => {
                const Icon = spec.icon;
                return (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-teal-300 transition-all hover:shadow-sm group"
                  >
                    <Icon className="h-5 w-5 text-teal-500 mb-2.5 group-hover:scale-110 transition-transform" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{spec.label}</p>
                    <p className="font-bold text-slate-900 text-sm">{spec.value}</p>
                  </div>
                );
              })}
            </motion.div>

            {/* DESCRIPTION */}
            <motion.div
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.18 }}
            >
              <h2 className="text-base font-black text-slate-900 mb-3 uppercase tracking-widest">Overview</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                {vehicle.description || `The ${vehicle.year} ${vehicle.make} ${vehicle.model} is a well-maintained vehicle ready for immediate export from Japan. Fully inspected and certified. Global shipping available from major Japanese ports.`}
              </p>
            </motion.div>

            {/* FEATURES */}
            {vehicle.features?.length > 0 && (
              <motion.div
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.22 }}
              >
                <h2 className="text-base font-black text-slate-900 mb-4 uppercase tracking-widest">Features & Equipment</h2>
                <div className="grid grid-cols-2 gap-2">
                  {vehicle.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">

            {/* Title (desktop only) */}
            <motion.div
              className="hidden lg:block p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.08 }}
            >
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-1">{vehicle.make}</p>
              <h1 className="text-xl font-black text-slate-900 leading-tight">{vehicle.make} {vehicle.model}</h1>
              <p className="text-slate-500 text-sm mt-1">{vehicle.year} · {vehicle.transmission} · {vehicle.engine?.fuel}</p>

              {/* Price block */}
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Total Price (FOB)</p>
                <p className="text-2xl font-black text-red-600">{convertPrice(vehicle.price.fob, vehicle.price.currency)}</p>
                {vehicle.price.cif && (
                  <p className="text-xs text-slate-500 mt-1">CIF estimate: {convertPrice(vehicle.price.cif, vehicle.price.currency)}</p>
                )}
              </div>
            </motion.div>

            {/* CTA block */}
            <motion.div
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              <h3 className="text-sm font-black text-slate-900 mb-4">Interested in this vehicle?</h3>
              <div className="space-y-2.5">
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello, I am interested in ${vehicle.year} ${vehicle.make} ${vehicle.model} (Stock ID: ${vehicle.stockId}). Please provide more details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat on WhatsApp
                </a>
                <Link
                  href={`${routes.contact}?vehicle=${vehicle.stockId}&subject=Purchase Inquiry`}
                  className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center transition-colors"
                >
                  Request Purchase Info
                </Link>
                <button
                  onClick={() => inCompare ? removeFromCompare(vehicle.id) : addToCompare(vehicle)}
                  className={`w-full py-3 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${inCompare ? "bg-teal-50 border-teal-200 text-teal-600" : "border-slate-200 text-slate-700 hover:border-teal-400 hover:text-teal-600"}`}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  {inCompare ? "Remove from Compare" : "Add to Compare"}
                </button>
                <Link
                  href={`${routes.contact}?vehicle=${vehicle.stockId}`}
                  className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center hover:border-teal-400 hover:text-teal-600 transition-colors"
                >
                  Ask a Question
                </Link>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Globe className="h-3.5 w-3.5" />
                Worldwide shipping available
              </div>
            </motion.div>

            {/* Contact */}
            <motion.div
              className="p-6 rounded-2xl bg-[#1A1F3C]"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
              <h3 className="text-sm font-black text-white mb-1">Expert Support</h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Our team handles inspection reports, export docs, and import guidance.
              </p>
              <div className="space-y-3">
                <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-teal-500/50">
                    <Phone className="h-4 w-4 text-teal-400" />
                  </div>
                  <span className="text-xs font-bold tracking-wider">{siteConfig.contact.phone}</span>
                </a>
                {siteConfig.contact.emails.map((email) => (
                  <a key={email} href={`mailto:${email}`}
                    className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-teal-500/50">
                      <Mail className="h-4 w-4 text-teal-400" />
                    </div>
                    <span className="text-xs font-bold tracking-wider break-all">{email}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
