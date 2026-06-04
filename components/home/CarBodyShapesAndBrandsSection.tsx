"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Car,
  Truck,
  Bus,
  CarFront,
  Zap,
} from "lucide-react";
import { routes } from "@/config/routes";
import { carBrands } from "@/data/car-brands";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const bodyShapes: { label: string; bodyType: string; icon: React.ReactNode }[] = [
  { label: "SUV", bodyType: "SUV", icon: <CarFront className="h-6 w-6 text-slate-700" /> },
  { label: "Hatchback", bodyType: "Hatchback", icon: <Car className="h-6 w-6 text-slate-700" /> },
  { label: "Sedan", bodyType: "Sedan", icon: <CarFront className="h-6 w-6 text-slate-700" /> },
  { label: "MPV", bodyType: "MPV", icon: <Bus className="h-6 w-6 text-slate-700" /> },
  { label: "Station Wagon", bodyType: "Station Wagon", icon: <Car className="h-6 w-6 text-slate-700" /> },
  { label: "Truck", bodyType: "Truck", icon: <Truck className="h-6 w-6 text-slate-700" /> },
  { label: "Van", bodyType: "Van", icon: <Bus className="h-6 w-6 text-slate-700" /> },
  { label: "Coupe", bodyType: "Coupe", icon: <Car className="h-6 w-6 text-slate-700" /> },
  { label: "Convertible", bodyType: "Convertible", icon: <Car className="h-6 w-6 text-slate-700" /> },
  { label: "Hybrid", bodyType: "Hybrid", icon: <Zap className="h-6 w-6 text-slate-700" /> },
];

const TOP_BRAND_SLUGS = ["toyota", "bmw", "honda", "volkswagen", "audi", "nissan", "volvo", "mazda", "mitsubishi", "subaru"];
const topBrands = TOP_BRAND_SLUGS.map((slug) => carBrands.find((b) => b.slug === slug)).filter(Boolean) as typeof carBrands;

function inventoryWithBodyType(bodyType: string) {
  return `${routes.inventory}?bodyType=${encodeURIComponent(bodyType)}`;
}

function inventoryWithMake(make: string) {
  return `${routes.inventory}?make=${encodeURIComponent(make)}`;
}

export default function CarBodyShapesAndBrandsSection() {
  return (
    <section className="section bg-slate-50" aria-labelledby="car-type-brand-heading">
      <div className="container-custom">
        {/* DVM JAPAN Group: red subtitle, dark blue title */}
        <div className="text-center mb-5">
          <p className="eyebrow-mdk mb-1">Find your perfect car by type and brand</p>
          <h2 id="car-type-brand-heading" className="heading-section-mdk text-xl md:text-2xl font-bold mb-3">
            For you to choose
          </h2>
          <div className="flex justify-center">
            <span
              className="inline-block px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-[10px] uppercase tracking-wider"
              aria-hidden
            >
              Car Body Shapes & Top Brands
            </span>
          </div>
        </div>

        {/* Car Body Shapes grid */}
        <div className="mb-6">
          <h3 className="text-slate-900 font-bold text-sm mb-3">Car Body Shapes</h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          >
            {bodyShapes.map((item) => (
              <motion.div key={item.bodyType} variants={itemVariants}>
                <Link
                  href={inventoryWithBodyType(item.bodyType)}
                  className="flex flex-col items-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all duration-200 group h-full"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-slate-100 mb-3 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-slate-800 font-bold text-[11px] text-center uppercase tracking-wider">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Top Car Brands grid */}
        <div>
          <h3 className="text-slate-900 font-bold text-sm mb-3">Top Car Brands</h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
          >
            {topBrands.map((brand) => (
              <motion.div key={brand.slug} variants={itemVariants}>
                <Link
                  href={inventoryWithMake(brand.name)}
                  className="flex flex-col items-center p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all duration-200 group h-full"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-slate-200 mb-3 overflow-hidden group-hover:scale-105 transition-transform">
                    <Image
                      src={brand.logoUrl}
                      alt=""
                      width={48}
                      height={48}
                      className="object-contain w-10 h-10 text-slate-700"
                    />
                  </div>
                  <span className="text-slate-800 font-bold text-xs text-center">
                    {brand.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
