import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About DVM JAPAN - Trusted Japanese Car Exporter Since 2003",
  description: "DVM JAPAN is a leading Japanese used car exporter serving 50+ countries. Direct access to 150+ auction houses, quality inspections, and worldwide shipping. Trusted by 10,000+ customers globally.",
  keywords: ["DVM JAPAN", "Japanese car exporter", "Japan used car dealer", "trusted car importer Japan", "about DVM JAPAN"],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
