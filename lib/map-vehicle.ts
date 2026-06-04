import type { Vehicle } from "@/types";

/** Map API vehicle (GET /api/vehicles/:id) to frontend Vehicle type */
export function mapApiVehicleToVehicle(v: {
  id: string;
  stockId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  priceCif?: number | null;
  currency: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType?: string | null;
  color: string;
  location: string;
  condition?: string;
  auctionGrade?: string | null;
  images: string[];
  description: string;
  features: string[];
  chassis?: string | null;
}): Vehicle {
  const imgs = Array.isArray(v.images) ? v.images : [];
  return {
    id: v.id,
    stockId: v.stockId,
    make: v.make,
    model: v.model,
    year: v.year,
    price: { fob: v.price, cif: v.priceCif ?? undefined, currency: v.currency },
    engine: { displacement: "", type: "", fuel: v.fuelType },
    transmission: v.transmission,
    mileage: v.mileage,
    color: v.color,
    auctionGrade: v.auctionGrade ?? "",
    condition: String(v.condition ?? ""),
    images: imgs.length ? imgs : ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800"],
    location: v.location,
    features: Array.isArray(v.features) ? v.features : [],
    description: v.description || "",
    chassis: v.chassis ?? undefined,
    bodyType: v.bodyType || "",
  };
}
