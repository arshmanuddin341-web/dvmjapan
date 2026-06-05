const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const count = await prisma.vehicle.count();
    console.log('Total vehicles:', count);

    if (count > 0) {
        const statuses = await prisma.vehicle.groupBy({
            by: ['status'],
            _count: true
        });
        console.log('Statuses:', JSON.stringify(statuses, null, 2));

        const sample = await prisma.vehicle.findFirst();
        console.log('Sample vehicle:', JSON.stringify(sample, null, 2));
    }

    await prisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
