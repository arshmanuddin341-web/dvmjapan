import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Wiping all vehicle records...");
    const deleted = await prisma.vehicle.deleteMany({});
    console.log(`Successfully deleted ${deleted.count} vehicles.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
