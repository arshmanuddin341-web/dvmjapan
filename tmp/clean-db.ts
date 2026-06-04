import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning database...");
    const v = await prisma.vehicle.deleteMany({});
    console.log(`Deleted ${v.count} vehicles.`);
    const a = await prisma.auctionListing.deleteMany({});
    console.log(`Deleted ${a.count} auction listings.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
