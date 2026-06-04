import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function uploadPoloImagesFinalV2() {
    const artifactDir = "C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\98b8d9f5-9909-4763-be75-4ce131fe7a7c";
    const stockId = "DVM-VW-1092";

    // Confirmed names from directory listing at 7:40 PM
    const poloArtifacts = [
        "media__1780238321510.png",
        "media__1780238335484.png",
        "media__1780238348608.png",
        "media__1780238361494.png",
        "media__1780238376264.png"
    ];

    try {
        console.log(`Found ${poloArtifacts.length} Verified Polo images to upload.`);
        const uploadedUrls: string[] = [];

        for (const fileName of poloArtifacts) {
            const filePath = `${artifactDir}\\${fileName}`;
            console.log(`Uploading ${fileName}...`);

            const result = await cloudinary.uploader.upload(filePath, {
                folder: `dvm_japan/vehicles/${stockId}`,
                use_filename: true,
                unique_filename: false,
                overwrite: true
            });

            uploadedUrls.push(result.secure_url);
            console.log(`Uploaded! URL: ${result.secure_url}`);
        }

        if (uploadedUrls.length > 0) {
            console.log('Updating database for Polo with VERIFIED images...');
            await prisma.vehicle.update({
                where: { stockId },
                data: {
                    images: JSON.stringify(uploadedUrls),
                },
            });
            console.log('Polo database updated successfully with real images.');
        }

    } catch (error) {
        console.error('Error during Polo upload/update:', error);
    } finally {
        await prisma.$disconnect();
    }
}

uploadPoloImagesFinalV2();
