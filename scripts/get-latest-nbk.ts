import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const latest = await prisma.vehicle.findFirst({
        where: { stockId: { startsWith: 'DVM-NBK-' } },
        orderBy: { createdAt: 'desc' }
    });
    if (latest) {
        console.log(`Latest Scraped: ${latest.make} ${latest.model}`);
        console.log(`Images: ${latest.images}`);
    } else {
        console.log("No NBK vehicles found yet.");
    }
    await prisma.$disconnect();
}
main();
