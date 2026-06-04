
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    const v = await prisma.vehicle.findMany({ take: 5 });
    console.log(JSON.stringify(v, null, 2));
}

check().then(() => prisma.$disconnect());
