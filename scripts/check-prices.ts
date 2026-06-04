import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPrices() {
    const vehicles = await prisma.vehicle.findMany({
        where: {
            stockId: { in: ['DVM-VW-1092', 'DVM-MIT-FE305'] }
        },
        select: { stockId: true, make: true, price: true, currency: true }
    });
    console.log(JSON.stringify(vehicles, null, 2));
    await prisma.$disconnect();
}

checkPrices();
