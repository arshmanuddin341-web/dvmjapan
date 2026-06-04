import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact DVM JAPAN - Get a Free Quote for Japanese Car Import",
  description: "Contact DVM JAPAN for a free quote on Japanese used car imports. Our team in Yokohama, Japan is ready to help with vehicle selection, auction bidding, and worldwide shipping. Phone, email, and WhatsApp support available.",
  keywords: ["contact DVM JAPAN", "Japanese car import quote", "buy car from Japan contact", "Japan car exporter phone"],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
