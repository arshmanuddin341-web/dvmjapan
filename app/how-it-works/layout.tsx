import { Metadata } from "next";

export const metadata: Metadata = {
    title: "How to Buy Japanese Used Cars - Step by Step Guide | DVM JAPAN",
    description: "Complete step-by-step guide on how to buy Japanese used cars. Learn about vehicle selection, auction bidding, payment, inspection, export documentation, and worldwide shipping from Japan.",
    keywords: ["how to buy car from Japan", "Japan car import process", "buying Japanese used car guide", "import car from Japan steps"],
    alternates: {
        canonical: "/how-it-works",
    },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
    return children;
}
