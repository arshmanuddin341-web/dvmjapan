import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkSampleImages() {
    const vehicles = await prisma.vehicle.findMany({
        take: 10,
        select: { stockId: true, images: true }
    });

    vehicles.forEach(v => {
        const images = JSON.parse(v.images || "[]");
        console.log(`StockID: ${v.stockId}`);
        console.log(`First Image: ${images[0] || 'NONE'}`);
        console.log('---');
    });

    await prisma.$disconnect();
}

checkSampleImages();
