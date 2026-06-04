const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanUp() {
    const deleted = await prisma.vehicle.deleteMany({
        where: {
            stockId: { startsWith: 'DVM-NBK-' }
        }
    });
    console.log(`Deleted ${deleted.count} vehicles with heavy watermarks.`);
    await prisma.$disconnect();
}

cleanUp();
