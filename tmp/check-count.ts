import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.vehicle.count();
    console.log(`Current vehicle count: ${count}`);
}
main().finally(() => prisma.$disconnect());
