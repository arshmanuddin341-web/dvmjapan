/**
 * Demo auction vehicle listings (jpcenter-style) for Live Auctions page.
 * Lot, make, model, year, auction, date, mileage, engine, start/sold price, image.
 */

export interface AuctionListing {
  id?: string;
  lot: string;
  make: string;
  model: string;
  year: number;
  auction: string;
  date: string;
  mileage: number;
  engine: string;
  startPrice: number;
  soldPrice: number;
  image: string;
  chassis?: string;
  grade?: string;
  status?: string;
  endTime?: string;
}

const IMG = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=90&w=400`;

export const auctionListingsDemo: AuctionListing[] = [];
