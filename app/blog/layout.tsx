import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Japanese Car Import Tips, Guides & News | DVM JAPAN",
  description: "Read expert guides on importing Japanese used cars. Tips on auction bidding, shipping, vehicle inspection, customs clearance, and choosing the right Japanese car for your market.",
  keywords: ["Japanese car import guide", "how to buy car from Japan", "Japan auction tips", "car import blog", "Japanese vehicle export news"],
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
