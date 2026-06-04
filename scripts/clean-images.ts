import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDuplicateImages() {
    console.log('--- Cleaning mixed vehicle images ---');

    const vehicles = await prisma.vehicle.findMany();

    for (const v of vehicles) {
        try {
            const images = JSON.parse(v.images);

            if (Array.isArray(images) && images.length > 3) {
                console.log(`3-Image Limit: ${v.make} ${v.model} (${v.stockId})`);

                const cleanedImages = images.slice(0, 3);

                await prisma.vehicle.update({
                    where: { id: v.id },
                    data: {
                        images: JSON.stringify(cleanedImages)
                    }
                });
            }
        } catch (e) {
            // ignore
        }
    }

    console.log('--- Done! ---');
}

cleanDuplicateImages()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
