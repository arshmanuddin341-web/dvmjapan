import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Japanese Car Pricing - FOB & CIF Prices | DVM JAPAN",
    description: "Transparent pricing for Japanese used cars. Understand FOB and CIF pricing, auction fees, shipping costs, and insurance. Get a free quote for your next Japanese car import with DVM JAPAN.",
    keywords: ["Japan car price", "FOB price Japan car", "CIF price Japan", "Japanese used car cost", "Japan car shipping cost"],
    alternates: {
        canonical: "/pricing",
    },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
    return children;
}
