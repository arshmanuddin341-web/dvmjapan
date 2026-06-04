import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixSpecificVehicle() {
    const stockId = "DVM-1238925";
    console.log(`Fixing mixed images for stock: ${stockId}`);

    const vehicle = await prisma.vehicle.findUnique({
        where: { stockId }
    });

    if (vehicle) {
        try {
            const images = JSON.parse(vehicle.images);
            if (Array.isArray(images) && images.length > 5) {
                // Keep only the first 5 images which are likely the correct car
                const cleaned = images.slice(0, 5);
                await prisma.vehicle.update({
                    where: { id: vehicle.id },
                    data: { images: JSON.stringify(cleaned) }
                });
                console.log('✓ Photos cleaned for DVM-1238925');
            }
        } catch (e) {
            console.log('Failed to parse images');
        }
    } else {
        console.log('Vehicle not found');
    }
}

fixSpecificVehicle()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
