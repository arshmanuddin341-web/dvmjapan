import { Metadata } from "next";
import { Suspense } from "react";
import InventoryPage from "@/components/inventory/InventoryPage";

export const metadata: Metadata = {
  title: "Used Japanese Cars for Sale | 50,000+ Vehicles | Buy from Japan Auction",
  description: "Browse 50,000+ used Japanese cars for sale direct from Japan auctions. Toyota, Honda, Nissan, Suzuki, Mazda & more. Best FOB prices, auction-grade inspections, worldwide shipping to 50+ countries. Search by make, model, year, price & mileage.",
  keywords: ["used Japanese cars for sale", "buy car from Japan", "Japan car auction", "Japanese used vehicles", "Toyota Japan export", "Honda Japan", "cheap cars from Japan", "Japan car import"],
  alternates: {
    canonical: "/inventory",
  },
};

export default function Inventory() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <InventoryPage />
    </Suspense>
  );
}
