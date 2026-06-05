const { v2: cloudinary } = require('cloudinary');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: 'drm3wgah8',
    api_key: '884483134455385',
    api_secret: '7ok9inU_kBBcatdo2rVoakrVdkc',
});

const images = [
    'C:/Users/Administrator/.gemini/antigravity/brain/e01361a3-5226-4b8d-91a8-ef2640012819/media__1780602288761.png',
    'C:/Users/Administrator/.gemini/antigravity/brain/e01361a3-5226-4b8d-91a8-ef2640012819/media__1780602302083.png',
    'C:/Users/Administrator/.gemini/antigravity/brain/e01361a3-5226-4b8d-91a8-ef2640012819/media__1780602315706.png'
];

async function uploadAndInsert() {
    try {
        console.log('Uploading images to Cloudinary...');
        const uploadedUrls = [];
        const stockId = 'DVM-PRIUS-3072149';

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
                make: 'TOYOTA',
                model: 'PRIUS PHV',
                year: 2015,
                price: 3685,
                currency: 'GBP',
                mileage: 129000,
                fuelType: 'Hybrid',
                transmission: 'Automatic',
                bodyType: 'Sedan',
                color: 'White',
                location: 'Southampton Por',
                condition: 'Used',
                status: 'available',
                featured: true,
                description: '2015 TOYOTA PRIUS PHV (Plug-in Hybrid). Grade S. ZVW35. Excellent condition, Auction Grade 4. Fuel efficient hybrid technology.',
                features: JSON.stringify(['Hybrid', 'Automatic', 'AAC', 'FF', 'ZVW35']),
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
