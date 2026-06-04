/**
 * Normalize raw auction listing into a shape suitable for Prisma Vehicle.
 * Mirrors backend/services/japanAuctions/normalizeAuctionVehicle.js for consistency.
 */

export interface NormalizedVehicle {
  stockId: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  bodyType: string | null;
  color: string;
  location: string;
  condition: string;
  auctionGrade: string | null;
  description: string;
  images: string[];
  auctionHouse: string | null;
  lotNumber: string | null;
  auctionDate: string | null;
  chassis: string | null;
  source: string;
}

export function normalizeAuctionVehicle(
  raw: Record<string, unknown>,
  source: string = "japan_sync"
): NormalizedVehicle | null {
  if (!raw || typeof raw !== "object") return null;

  const lot = String(raw.lot ?? raw.lotNumber ?? raw.id ?? "").trim();
  const make = String(raw.make ?? raw.brand ?? raw.manufacturer ?? "").trim();
  const model = String(raw.model ?? raw.modelName ?? "").trim();
  const year = raw.year != null ? parseInt(String(raw.year), 10) : 0;
  const price =
    raw.price != null
      ? parseFloat(String(raw.price))
      : raw.startPrice != null
        ? parseFloat(String(raw.startPrice))
        : 0;
  const mileage = raw.mileage != null ? parseInt(String(raw.mileage), 10) : 0;
  const grade =
    raw.grade != null
      ? String(raw.grade).trim()
      : raw.auctionGrade != null
        ? String(raw.auctionGrade).trim()
        : null;
  const auctionHouse =
    raw.auctionHouse != null
      ? String(raw.auctionHouse).trim()
      : raw.auction != null
        ? String(raw.auction).trim()
        : null;
  const auctionDate =
    raw.auctionDate != null
      ? String(raw.auctionDate).trim()
      : raw.date != null
        ? String(raw.date).trim()
        : null;
  const chassis = raw.chassis != null ? String(raw.chassis).trim() : null;

  if (!make || !model || year < 1900) return null;

  const stockId =
    lot || `JP-${Date.now()}-${make}-${model}`.replace(/\s+/g, "-").slice(0, 64);
  const image =
    raw.image ??
    raw.thumbnail ??
    raw.mainImage ??
    (Array.isArray(raw.images) ? (raw.images[0] as string) : "");
  const images = Array.isArray(raw.images)
    ? (raw.images as string[])
    : image
      ? [String(image)]
      : [];

  return {
    stockId,
    make,
    model,
    year,
    price,
    mileage,
    fuelType: String(raw.fuelType ?? raw.fuel ?? "Petrol").trim(),
    transmission: String(raw.transmission ?? "Automatic").trim(),
    bodyType: (raw.bodyType ?? raw.type) != null ? String(raw.bodyType ?? raw.type).trim() : null,
    color: String(raw.color ?? "—").trim(),
    location: String(raw.location ?? "Japan").trim(),
    condition: String(raw.condition ?? "Good").trim(),
    auctionGrade: grade,
    description:
      String(raw.description ?? "").trim() ||
      `${year} ${make} ${model} - Japan auction`,
    images,
    auctionHouse,
    lotNumber: lot || null,
    auctionDate,
    chassis,
    source,
  };
}
