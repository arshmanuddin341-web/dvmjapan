import type { Metadata } from "next";

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const id = params.id || "";
  return {
    title: `Vehicle ${id}`,
    description: "View vehicle details, photos, specifications, pricing, and purchase guidance from DVM JAPAN Group.",
    alternates: { canonical: `/vehicles/${id}` },
  };
}

export default function VehicleDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}

