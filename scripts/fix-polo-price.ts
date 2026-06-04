import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixPoloPrice() {
    const stockId = "DVM-VW-1092";

    try {
        console.log('Updating Polo price to 543,000 JPY...');
        await prisma.vehicle.update({
            where: { stockId },
            data: {
                price: 543000,
                currency: "JPY"
            },
        });
        console.log('Polo price updated successfully.');
    } catch (error) {
        console.error('Error updating Polo price:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixPoloPrice();
