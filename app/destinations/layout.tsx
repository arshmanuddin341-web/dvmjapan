import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Japanese Car Shipping Destinations - Export to 50+ Countries | DVM JAPAN",
  description: "DVM JAPAN ships Japanese used cars to 50+ countries across Africa, Middle East, Asia Pacific, Europe, and the Americas. Check shipping routes, transit times, and port information for your country.",
  keywords: ["Japan car shipping", "Japanese car export countries", "ship car from Japan to Africa", "Japan vehicle shipping destinations"],
  alternates: {
    canonical: "/destinations",
  },
};

export default function DestinationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
