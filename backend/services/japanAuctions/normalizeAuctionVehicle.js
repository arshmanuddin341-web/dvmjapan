/**
 * Normalize raw auction listing from any source into a single shape.
 * Used by sync service and source adapters.
 * All fields returned are safe for DB upsert (no undefined requireds).
 */

/**
 * Normalize one raw auction/listing item into a canonical vehicle object.
 * @param {Object} raw - Raw item from adapter (e.g. { lot, make, model, year, ... })
 * @param {string} [source] - Source identifier (e.g. 'jdmarapi', 'avtojp', 'custom')
 * @returns {Object} Normalized vehicle for Prisma/API
 */
function normalizeAuctionVehicle(raw, source = 'japan_sync') {
  if (!raw || typeof raw !== 'object') {
    return null;
  }

  const lot = String(raw.lot ?? raw.lotNumber ?? raw.id ?? '').trim();
  const make = String(raw.make ?? raw.brand ?? raw.manufacturer ?? '').trim();
  const model = String(raw.model ?? raw.modelName ?? '').trim();
  const year = raw.year != null ? parseInt(String(raw.year), 10) : 0;
  const price = raw.price != null ? parseFloat(String(raw.price)) : (raw.startPrice != null ? parseFloat(String(raw.startPrice)) : 0);
  const mileage = raw.mileage != null ? parseInt(String(raw.mileage), 10) : 0;
  const engine = String(raw.engine ?? raw.engineType ?? raw.engineSize ?? '').trim();
  const chassis = raw.chassis != null ? String(raw.chassis).trim() : null;
  const grade = raw.grade != null ? String(raw.grade).trim() : (raw.auctionGrade != null ? String(raw.auctionGrade).trim() : null);
  const auctionHouse = raw.auctionHouse ?? raw.auction ?? raw.auctionName ?? null;
  const auctionDate = raw.auctionDate ?? raw.date ?? raw.saleDate ?? null;

  // Stock ID must be unique: prefer lot-based, fallback to generated
  const stockId = lot || `JP-${Date.now()}-${make}-${model}`.replace(/\s+/g, '-').slice(0, 64);

  if (!make || !model || year < 1900) {
    return null;
  }

  const image = raw.image ?? raw.thumbnail ?? raw.mainImage ?? (Array.isArray(raw.images) ? raw.images[0] : '');
  const images = Array.isArray(raw.images) ? raw.images : (image ? [image] : []);

  return {
    stockId,
    make,
    model,
    year,
    price,
    mileage,
    fuelType: String(raw.fuelType ?? raw.fuel ?? 'Petrol').trim(),
    transmission: String(raw.transmission ?? 'Automatic').trim(),
    bodyType: raw.bodyType ?? raw.type ?? null,
    color: String(raw.color ?? '—').trim(),
    location: String(raw.location ?? 'Japan').trim(),
    condition: String(raw.condition ?? 'Good').trim(),
    auctionGrade: grade,
    description: String(raw.description ?? '').trim() || `${year} ${make} ${model} - Japan auction`,
    images,
    // Japan auction-specific (for Prisma Vehicle)
    auctionHouse: auctionHouse != null ? String(auctionHouse).trim() : null,
    lotNumber: lot || null,
    auctionDate: auctionDate != null ? String(auctionDate).trim() : null,
    chassis,
    source,
  };
}

module.exports = {
  normalizeAuctionVehicle,
};
