import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting stock ID migration: MDK -> DVM...");

    const vehicles = await prisma.vehicle.findMany({
        where: {
            stockId: {
                startsWith: "MDK-",
            },
        },
    });

    console.log(`Found ${vehicles.length} vehicles with MDK prefix.`);

    for (const vehicle of vehicles) {
        const newStockId = vehicle.stockId.replace("MDK-", "DVM-");
        await prisma.vehicle.update({
            where: { id: vehicle.id },
            data: { stockId: newStockId },
        });
        console.log(`Updated: ${vehicle.stockId} -> ${newStockId}`);
    }

    console.log("Migration complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
