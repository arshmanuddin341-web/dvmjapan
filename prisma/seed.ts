import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { auctionListingsDemo } from "../data/live-auction-demo";
import { extendedVehicles } from "../data/vehicles-extended";

const prisma = new PrismaClient();

function parsePrice(v: { price: { fob: number; cif?: number; currency: string } }) {
  const p = v.price as { fob: number; cif?: number; currency: string };
  return { price: p.fob, priceCif: p.cif ?? null, currency: p.currency || "USD" };
}

function parseEngine(v: { engine?: { displacement?: string; type?: string; fuel?: string } }) {
  const e = v.engine as { displacement?: string; type?: string; fuel?: string } | undefined;
  if (!e) return { engineType: null };
  return {
    engineType: [e.displacement, e.type, e.fuel].filter(Boolean).join(" ") || null,
  };
}

async function main() {
  console.log("Seeding database...");

  const adminHash = hashSync("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@dvmjapan.com" },
    update: { passwordHash: adminHash },
    create: {
      email: "admin@dvmjapan.com",
      name: "Admin",
      passwordHash: adminHash,
      role: "admin",
    },
  });
  console.log("Admin user:", admin.email);

  const vehicleCount = await prisma.vehicle.count();
  if (vehicleCount === 0) {
    for (const v of extendedVehicles) {
      const { price, priceCif, currency } = parsePrice(v as { price: { fob: number; cif?: number; currency: string } });
      const { engineType } = parseEngine(v as { engine?: { displacement?: string; type?: string; fuel?: string } });
      await prisma.vehicle.create({
        data: {
          stockId: (v as { stockId: string }).stockId || `STK-${v.id}`,
          make: v.make,
          model: v.model,
          year: v.year,
          price,
          priceCif,
          currency,
          mileage: v.mileage,
          fuelType: (v as { engine?: { fuel?: string } }).engine?.fuel || "Petrol",
          transmission: v.transmission,
          color: v.color,
          location: v.location,
          condition: (v as any).condition ?? "Used",
          auctionGrade: (v as { auctionGrade?: string }).auctionGrade ?? null,
          images: JSON.stringify(v.images),
          description: v.description,
          features: JSON.stringify(v.features),
          engineType,
        },
      });
    }
    console.log("Created", extendedVehicles.length, "vehicles");
  }

  const auctionCount = await prisma.auctionListing.count();
  if (auctionCount === 0) {
    for (const a of auctionListingsDemo) {
      await prisma.auctionListing.create({
        data: {
          lot: a.lot,
          make: a.make,
          model: a.model,
          year: a.year,
          auction: a.auction,
          date: a.date,
          mileage: a.mileage,
          engine: a.engine,
          startPrice: a.startPrice,
          soldPrice: a.soldPrice,
          image: a.image,
          chassis: a.chassis,
          grade: a.grade,
        },
      });
    }
    console.log("Created", auctionListingsDemo.length, "auction listings");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
