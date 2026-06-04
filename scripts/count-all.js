const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
    const total = await prisma.vehicle.count();
    console.log('---DATABASE_COUNT---');
    console.log(total);
    console.log('-------------------');
    process.exit(0);
}
run();
