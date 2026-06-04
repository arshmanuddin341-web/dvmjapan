import type { Metadata } from "next";

const COUNTRY_NAME_BY_SLUG: Record<string, string> = {
  uk: "United Kingdom",
  zambia: "Zambia",
  zimbabwe: "Zimbabwe",
  tanzania: "Tanzania",
  kenya: "Kenya",
  ireland: "Ireland",
  jamaica: "Jamaica",
};

export function generateMetadata({ params }: { params: { country: string } }): Metadata {
  const slug = (params.country || "").toLowerCase();
  const name = COUNTRY_NAME_BY_SLUG[slug] || slug.toUpperCase();

  return {
    title: `Import Japanese Cars to ${name}`,
    description: `Country guide for importing Japanese cars to ${name}: shipping timeline, documentation, customs considerations, and how DVM JAPAN Group supports the end-to-end process.`,
    alternates: { canonical: `/destinations/${slug}` },
  };
}

export default function CountryLayout({ children }: { children: React.ReactNode }) {
  return children;
}

