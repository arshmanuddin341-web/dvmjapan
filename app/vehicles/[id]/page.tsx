import { Metadata } from "next";
import { getVehicleById } from "@/data/vehicles";
import VehicleDetailPage from "@/components/vehicles/VehicleDetailPage";
import { notFound } from "next/navigation";
import { mapApiVehicleToVehicle } from "@/lib/map-vehicle";
import type { Vehicle } from "@/types";

import { prisma } from "@/lib/db";

async function getVehicle(id: string): Promise<Vehicle | null> {
  try {
    const v = await prisma.vehicle.findFirst({
      where: {
        OR: [{ id }, { stockId: id }],
      },
    });
    if (!v) return null;

    // Map DB fields to what our frontend expect
    const apiFormat = {
      ...v,
      images: JSON.parse(v.images || "[]"),
      features: JSON.parse(v.features || "[]"),
      specifications: v.specifications ? JSON.parse(v.specifications) : null,
    };

    return mapApiVehicleToVehicle(apiFormat as any);
  } catch (err) {
    console.error("Direct getVehicle error:", err);
    return null;
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = (await getVehicle(id)) ?? getVehicleById(id);
  if (!vehicle) {
    return { title: "Vehicle Not Found | DVM JAPAN" };
  }
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} for Sale - $${vehicle.price.fob.toLocaleString()} FOB Japan | DVM JAPAN`;
  const description = `Buy ${vehicle.year} ${vehicle.make} ${vehicle.model} direct from Japan. ${vehicle.engine?.fuel ?? ""} engine, ${vehicle.transmission} transmission, ${vehicle.mileage.toLocaleString()} km. Auction-inspected, export-ready. FOB price $${vehicle.price.fob.toLocaleString()}. Worldwide shipping available.`;
  return {
    title,
    description,
    keywords: [`${vehicle.make} ${vehicle.model} for sale`, `${vehicle.year} ${vehicle.make}`, `used ${vehicle.make} Japan`, `buy ${vehicle.model} from Japan`, "Japanese used car"],
    openGraph: {
      title,
      description,
      type: "website",
      images: vehicle.images?.[0] ? [{ url: vehicle.images[0], width: 800, height: 600, alt: `${vehicle.year} ${vehicle.make} ${vehicle.model}` }] : undefined,
    },
  };
}

export default async function VehicleDetail({ params }: PageProps) {
  const { id } = await params;
  const vehicle = (await getVehicle(id)) ?? getVehicleById(id);

  if (!vehicle) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dvmjapan.com";
  const vehicleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
    description: `${vehicle.year} ${vehicle.make} ${vehicle.model} - ${vehicle.engine?.fuel ?? ""}, ${vehicle.transmission}, ${vehicle.mileage.toLocaleString()} km. Export-ready from Japan.`,
    image: vehicle.images?.[0] ?? undefined,
    sku: vehicle.stockId,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    productionDate: `${vehicle.year}`,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "KMT",
    },
    fuelType: vehicle.engine?.fuel ?? undefined,
    vehicleTransmission: vehicle.transmission,
    offers: {
      "@type": "Offer",
      price: vehicle.price.fob,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "DVM JAPAN" },
      url: `${siteUrl}/vehicles/${vehicle.id}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(vehicleJsonLd) }}
      />
      <VehicleDetailPage vehicle={vehicle} />
    </>
  );
}
