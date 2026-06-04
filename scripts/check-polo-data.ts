import { prisma } from "../lib/db";

async function check() {
    const cars = await prisma.vehicle.findMany({
        where: {
            OR: [
                { model: { contains: "Polo", mode: "insensitive" } },
                { model: { contains: "Canter", mode: "insensitive" } },
                { make: { contains: "Mitsubishi", mode: "insensitive" } }
            ]
        },
        select: {
            id: true,
            stockId: true,
            make: true,
            model: true,
            images: true
        }
    });

    console.log(JSON.stringify(cars, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
