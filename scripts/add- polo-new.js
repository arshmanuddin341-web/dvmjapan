const { v2: cloudinary } = require('cloudinary');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: 'drm3wgah8',
    api_key: '884483134455385',
    api_secret: '7ok9inU_kBBcatdo2rVoakrVdkc',
});

const images = [
    'C:/Users/Administrator/.gemini/antigravity/brain/e01361a3-5226-4b8d-91a8-ef2640012819/media__1780600349140.png',
    'C:/Users/Administrator/.gemini/antigravity/brain/e01361a3-5226-4b8d-91a8-ef2640012819/media__1780600363385.png',
    'C:/Users/Administrator/.gemini/antigravity/brain/e01361a3-5226-4b8d-91a8-ef2640012819/media__1780600380917.png'
];

async function uploadAndInsert() {
    try {
        console.log('Uploading images to Cloudinary...');
        const uploadedUrls = [];
        const stockId = 'DVM-VW-23894'; // Using part of Chassis No as stockId

        for (const imgPath of images) {
            const result = await cloudinary.uploader.upload(imgPath, {
                folder: `dvm_japan/vehicles/${stockId}`,
                use_filename: true,
                unique_filename: false
            });
            uploadedUrls.push(result.secure_url);
        }
        console.log('✓ Images uploaded.');

        console.log('Inserting into database...');
        await prisma.vehicle.upsert({
            where: { stockId },
            update: {},
            create: {
                stockId,
                make: 'VOLKSWAGEN',
                model: 'POLO',
                year: 2013,
                price: 3644,
                currency: 'GBP',
                mileage: 100000,
                fuelType: 'Gasoline',
                transmission: 'Automatic',
                bodyType: 'Hatchback',
                color: 'White',
                location: 'Southampton Por',
                condition: 'Used',
                status: 'available',
                featured: true,
                description: '2013 VOLKSWAGEN POLO TSI COMFORTLINE BLUEMOTION TECHNOLOGY. Grade: TSI COMFORTLINE. Engine: 1,190cc.',
                features: JSON.stringify(['2WD', '5 Doors', '5 Seats', 'Automatic', 'BlueMotion Technology']),
                images: JSON.stringify(uploadedUrls),
            }
        });
        console.log(`✓ Vehicle ${stockId} added to database.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

uploadAndInsert();
