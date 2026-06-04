import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const id = params.id || "";
  return {
    title: `Auction ${id}`,
    description: "View auction listing details, bidding status, and vehicle information from DVM JAPAN Group auctions.",
    alternates: { canonical: `/auction/${id}` },
  };
}

export default function AuctionDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}

