import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function uploadImages() {
    const directoryPath = "C:\\Users\\Administrator\\Downloads\\WhatsApp Unknown 2026-05-08 at 17.03.26 (1)";
    const stockId = "DVM-MIT-FE305";

    try {
        const files = fs.readdirSync(directoryPath);
        const imageFiles = files.filter(file =>
            ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
        );

        console.log(`Found ${imageFiles.length} images to upload.`);

        const uploadedUrls: string[] = [];

        for (const file of imageFiles) {
            const filePath = path.join(directoryPath, file);
            console.log(`Uploading ${file}...`);

            try {
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: `dvm_japan/vehicles/${stockId}`,
                    use_filename: true,
                    unique_filename: false,
                    overwrite: true
                });

                uploadedUrls.push(result.secure_url);
                console.log(`Uploaded! URL: ${result.secure_url}`);
            } catch (err) {
                console.error(`Failed to upload ${file}, skipping...`, err);
            }
        }

        if (uploadedUrls.length > 0) {
            console.log(`Updating database with ${uploadedUrls.length} images...`);
            await prisma.vehicle.update({
                where: { stockId },
                data: {
                    images: JSON.stringify(uploadedUrls),
                },
            });
            console.log('Database updated successfully.');
        }

    } catch (error) {
        console.error('Error during upload/update:', error);
    } finally {
        await prisma.$disconnect();
    }
}

uploadImages();
