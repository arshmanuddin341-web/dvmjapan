import { PrismaClient } from "@prisma/client";
import { syncToDVM } from "../lib/sync";

const prisma = new PrismaClient();

async function syncAll() {
    console.log("🚀 Starting Bulk Sync from DVM JAPAN to DVM...");

    try {
        const vehicles = await prisma.vehicle.findMany({
            where: {
                status: "available", // Only sync available stock
            },
        });

        console.log(`Found ${vehicles.length} vehicles to sync.`);

        let successCount = 0;
        let failCount = 0;

        for (const vehicle of vehicles) {
            process.stdout.write(`Syncing ${vehicle.stockId}... `);
            const result = await syncToDVM(vehicle, "POST"); // Use POST to create if not exists

            if (result?.success) {
                console.log("✅ Success");
                successCount++;
            } else {
                console.log(`❌ Failed: ${result?.error || "Unknown error"}`);
                failCount++;
            }
        }

        console.log("\n--- Sync Complete ---");
        console.log(`Total: ${vehicles.length}`);
        console.log(`Success: ${successCount}`);
        console.log(`Failed: ${failCount}`);

    } catch (error) {
        console.error("Fatal Error during sync:", error);
    } finally {
        await prisma.$disconnect();
    }
}

syncAll();
