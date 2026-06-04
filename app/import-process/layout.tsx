import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Japanese Car Import Process - Documentation & Customs | DVM JAPAN",
    description: "Understanding the complete Japanese car import process. Export documentation, customs clearance, deregistration, shipping documents, BL copies, and import duty information for all destination countries.",
    keywords: ["Japan car import process", "Japanese vehicle export documents", "car import customs Japan", "BL copy Japan car", "import duty Japanese car"],
    alternates: {
        canonical: "/import-process",
    },
};

export default function ImportProcessLayout({ children }: { children: React.ReactNode }) {
    return children;
}
