const { v2: cloudinary } = require('cloudinary');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: 'drm3wgah8',
    api_key: '884483134455385',
    api_secret: '7ok9inU_kBBcatdo2rVoakrVdkc',
});

const images = [
    'C:/Users/Administrator/.gemini/antigravity/brain/e01361a3-5226-4b8d-91a8-ef2640012819/media__1780604166299.png',
    'C:/Users/Administrator/.gemini/antigravity/brain/e01361a3-5226-4b8d-91a8-ef2640012819/media__1780604166304.png',
    'C:/Users/Administrator/.gemini/antigravity/brain/e01361a3-5226-4b8d-91a8-ef2640012819/media__1780604166309.png',
    'C:/Users/Administrator/.gemini/antigravity/brain/e01361a3-5226-4b8d-91a8-ef2640012819/media__1780604166314.png'
];

async function uploadAndInsert() {
    try {
        console.log('Uploading images to Cloudinary...');
        const uploadedUrls = [];
        const stockId = 'DVM-VITZ-NHP130';

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
                model: 'VITZ HYBRID',
                year: 2017,
                price: 4200,
                currency: 'GBP',
                mileage: 108123,
                fuelType: 'Hybrid',
                transmission: 'Automatic',
                bodyType: 'Hatchback',
                color: 'Silver',
                location: 'UK Port',
                condition: 'Used',
                status: 'available',
                featured: true,
                description: '2017/6 TOYOTA VITZ HYBRID. Package Hybrid F. NHP130. Excellent fuel economy. Modern features and smooth drive.',
                features: JSON.stringify(['Hybrid', 'Automatic', 'AAC', 'Push Start', 'LED Headlamps']),
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
