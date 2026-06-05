const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteMdkCars() {
    try {
        console.log('Deleting all MDK vehicles...');
        const deleted = await prisma.vehicle.deleteMany({
            where: {
                stockId: {
                    startsWith: 'MDK'
                }
            }
        });
        console.log(`✓ Deleted ${deleted.count} MDK vehicles.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

deleteMdkCars();
