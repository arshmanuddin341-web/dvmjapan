import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Japanese Car Import Questions Answered | DVM JAPAN",
  description: "Get answers to frequently asked questions about importing Japanese used cars. Learn about FOB vs CIF pricing, auction grades, shipping timelines, payment methods, and vehicle inspection processes at DVM JAPAN.",
  keywords: ["Japanese car import FAQ", "FOB CIF meaning", "Japan auction grades", "how to import car from Japan", "Japan car shipping time"],
  alternates: {
    canonical: "/faq",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of vehicles do you export?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We export all types of Japanese vehicles, including sedans, SUVs, trucks, vans, and commercial vehicles. We source directly from over 150 auction houses across Japan.",
      },
    },
    {
      "@type": "Question",
      name: "Which countries do you ship to?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We ship to over 50 countries worldwide, including major hubs in Africa, the Middle East, Asia Pacific, and the Americas.",
      },
    },
    {
      "@type": "Question",
      name: "How long does the process take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The typical timeline is 1-2 weeks for selection and payment, 30-45 days for shipping, and 1-2 weeks for documentation and customs. Total time is usually 2-3 months.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between FOB and CIF?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "FOB (Free On Board) is the price of the car at the Japanese port. CIF (Cost, Insurance, and Freight) includes the car price plus shipping and marine insurance to your destination port.",
      },
    },
    {
      "@type": "Question",
      name: "What do auction grades mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Auction grades range from 1 to 6. Grade 4.5 and 5 are excellent/near-new condition. Grade 4 is good. Grade 3.5 is fair. Grade R indicates the vehicle has had repairs.",
      },
    },
    {
      "@type": "Question",
      name: "Are there any hidden charges?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Our quotes are transparent. We break down the vehicle price, auction fees, storage, and shipping so you see exactly what you are paying for.",
      },
    },
  ],
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
