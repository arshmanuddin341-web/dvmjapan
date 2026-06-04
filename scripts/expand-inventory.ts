import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("🚀 Expanding inventory to 200+ vehicles with proper categories and 5 images each...");

    const vehicles = await prisma.vehicle.findMany();
    console.log(`Current base vehicles: ${vehicles.length}`);

    if (vehicles.length === 0) {
        console.log("No base vehicles found. Run rebuild-inventory.ts first.");
        return;
    }

    const TARGET_TOTAL = 210;
    const toAddCount = TARGET_TOTAL - vehicles.length;

    if (toAddCount <= 0) {
        console.log("Already have 200+ vehicles.");
        return;
    }

    console.log(`Adding ${toAddCount} categorical variations...`);

    const colors = ["Diamond Black", "Pearl White", "Metallic Silver", "Deep Blue", "Graphite Grey", "Champagne Gold"];

    for (let i = 0; i < toAddCount; i++) {
        const base = vehicles[i % vehicles.length];

        // Vary mileage and price
        const mileageVariance = Math.floor((Math.random() - 0.5) * 40000);
        const baseMileage = base.mileage ?? 50000;
        const newMileage = Math.max(5000, baseMileage + mileageVariance);
        const priceVariance = 0.85 + (Math.random() * 0.3);
        const newPrice = Math.round(base.price * priceVariance);

        const stockId = `DVM-EXP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        await prisma.vehicle.create({
            data: {
                stockId,
                make: base.make,
                model: base.model,
                year: base.year,
                price: newPrice,
                priceCif: newPrice + 1500,
                currency: base.currency,
                mileage: newMileage,
                fuelType: base.fuelType,
                transmission: base.transmission,
                bodyType: base.bodyType,
                color: colors[Math.floor(Math.random() * colors.length)],
                location: base.location,
                condition: base.condition,
                images: base.images, // Re-use the existing 5 images
                description: `PRIME SELECTION: ${base.year} ${base.make} ${base.model}. This ${base.bodyType} is part of our certified Japanese export inventory. Inspected for quality with only ${newMileage.toLocaleString()}km.`,
                features: base.features,
                status: "available",
                featured: Math.random() > 0.85,
                source: base.source // Keep source for reference if needed
            }
        });

        if (i % 25 === 0) console.log(`...Added ${i}/${toAddCount} variations`);
    }

    console.log("✨ Final inventory expansion complete. Total records: ~210");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
