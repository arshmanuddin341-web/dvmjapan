"use client";

import { motion } from "framer-motion";
import WatermarkedImage from "@/components/ui/WatermarkedImage";
import Link from "next/link";
import { Car, MapPin, Calendar, Fuel, Gauge, ArrowRight, ArrowRightLeft } from "lucide-react";
import { routes } from "@/config/routes";
import { formatMileage } from "@/lib/utils";
import { useCurrency } from "@/context/CurrencyContext";
import { useCompare } from "@/context/CompareContext";
import Badge from "@/components/ui/Badge";

export interface VehicleCardProps {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency?: string;
  mileage: number;
  fuelType: string;
  location: string;
  image: string;
  auctionGrade?: string;
  condition?: string;
  stockId?: string;
  featured?: boolean;
}

export default function VehicleCard({
  id,
  make,
  model,
  year,
  price,
  currency = "USD",
  mileage,
  fuelType,
  location,
  image,
  auctionGrade,
  condition,
  stockId,
  featured = false,
}: VehicleCardProps) {
  const { convertPrice } = useCurrency();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const inCompare = isInCompare(id);

  const vehicle = { id, make, model, year, price, currency, mileage, fuelType, location, images: [image], stockId, featured, auctionGrade, condition };

  return (
    <motion.div
      className="card p-0 overflow-hidden group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      {/* Image */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-dark-800">
        <WatermarkedImage
          src={image}
          alt={`${year} ${make} ${model}`}
          fill
          className="group-hover:scale-110 transition-transform duration-500"
        />
        {featured && (
          <div className="absolute top-4 left-4">
            <Badge variant="info">Featured</Badge>
          </div>
        )}
        {auctionGrade && (
          <div className="absolute top-4 right-4">
            <Badge variant="default">Grade {auctionGrade}</Badge>
          </div>
        )}

        {/* Compare Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            inCompare ? removeFromCompare(id) : addToCompare(vehicle as any);
          }}
          className={`absolute bottom-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all backdrop-blur-md opacity-0 group-hover:opacity-100 ${inCompare ? "bg-teal-500 text-white" : "bg-white/80 text-slate-600 hover:text-teal-600"}`}
          title={inCompare ? "Remove from Compare" : "Add to Compare"}
        >
          <ArrowRightLeft className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5">
        {/* Title */}
        <div className="mb-2">
          <h3 className="text-base font-bold text-slate-900 mb-0 leading-tight truncate">
            {year} {make} {model}
          </h3>
          {stockId && (
            <p className="text-[11px] text-slate-700 font-medium">Stock ID: {stockId}</p>
          )}
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
            <Calendar className="h-3.5 w-3.5 text-slate-600" />
            <span>{year}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
            <Gauge className="h-3.5 w-3.5 text-slate-600" />
            <span>{formatMileage(mileage)} km</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
            <Fuel className="h-3.5 w-3.5 text-slate-600" />
            <span>{fuelType}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
            <MapPin className="h-3.5 w-3.5 text-slate-600" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-2 pt-2 border-t border-slate-100">
          <div className="text-base font-bold text-red-600">
            {convertPrice(price, currency)}
          </div>
          {condition && (
            <p className="text-[11px] text-slate-700 mt-0.5">Condition: {condition}</p>
          )}
        </div>

        {/* CTA */}
        <Link
          href={routes.vehicleDetail(id)}
          className="bg-slate-900 hover:bg-slate-800 text-white w-full h-10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
