import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Japan Car Auction - Buy Direct from 150+ Auction Houses | DVM JAPAN",
  description: "Access 150+ Japanese car auction houses with DVM JAPAN. Bid on 500,000+ vehicles updated weekly. Registration, bidding, payment, inspection, and worldwide shipping handled for you. Start buying from Japan auctions today.",
  keywords: ["Japan car auction", "Japanese vehicle auction", "buy from Japan auction", "car auction bidding Japan", "USS auction Japan", "TAA auction"],
  alternates: {
    canonical: "/auction",
  },
};

export default function AuctionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
