"use client";

import Link from "next/link";
import { routes } from "@/config/routes";

const TAGS = [
  "Sedan", "UK Inventory", "Under 200,000 JPY", "Hybrid", "Hatchback", "Coupe", "Korea Inventory", "LHD", "4WD", "RHD",
  "Low Mileage", "SUV", "MUV", "Automatic", "Manual", "Diesel", "Petrol", "Electric", "New Arrivals", "Best Deals",
  "Convertible", "Wagon", "Pickup", "Van", "Japan Inventory", "Auction", "Certified", "Premium",
];

export default function PopularTagsSection() {
  return (
    <section className="section bg-slate-50" aria-labelledby="popular-tags-heading">
      <div className="container-custom">
        <p className="eyebrow-mdk mb-1">Browse Trending Japanese Auto Categories</p>
        <h2 id="popular-tags-heading" className="heading-section-mdk text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
          Popular Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <Link
              key={tag}
              href={`${routes.inventory}?keyword=${encodeURIComponent(tag)}`}
              className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
