import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Body type inference
const BODY_TYPE_KEYWORDS: Record<string, string> = {
    'alphard': 'MPV', 'voxy': 'MPV', 'noah': 'MPV', 'sienna': 'MPV', 'odyssey': 'MPV',
    'step wagon': 'MPV', 'serena': 'MPV', 'delica': 'MPV', 'stepwgn': 'MPV',
    'land cruiser': 'SUV', 'rav4': 'SUV', 'cx-5': 'SUV', 'cx5': 'SUV',
    'x-trail': 'SUV', 'forester': 'SUV', 'harrier': 'SUV', 'rush': 'SUV',
    'hilux': 'Truck', 'ranger': 'Truck', 'navara': 'Truck', 'canter': 'Truck',
    'corolla': 'Sedan', 'camry': 'Sedan', 'accord': 'Sedan', 'axela': 'Sedan',
    'mark x': 'Sedan', 'lancer': 'Sedan', 'legacy': 'Sedan', 'prius': 'Sedan',
    'fit': 'Hatchback', 'yaris': 'Hatchback', 'swift': 'Hatchback', 'demio': 'Hatchback',
    'aqua': 'Hatchback', 'note': 'Hatchback', 'vitz': 'Hatchback', 'polo': 'Hatchback',
    'every': 'Van', 'hiace': 'Van', 'carry': 'Van', 'nv200': 'Van',
};

function inferBodyType(stockId: string): string {
    const lower = stockId.toLowerCase();
    for (const [kw, bt] of Object.entries(BODY_TYPE_KEYWORDS)) {
        if (lower.includes(kw.replace(' ', ''))) return bt;
    }
    return 'Sedan';
}

async function getAllFolders(): Promise<string[]> {
    const folders: string[] = [];
    let nextCursor: string | undefined = undefined;

    do {
        const result: any = await cloudinary.api.sub_folders('DVM_JAPAN', {
            max_results: 500,
            next_cursor: nextCursor,
        });
        for (const f of result.folders) {
            folders.push(f.name);
        }
        nextCursor = result.next_cursor;
    } while (nextCursor);

    return folders;
}

async function getImagesForFolder(stockFolder: string): Promise<string[]> {
    try {
        const result: any = await cloudinary.api.resources({
            type: 'upload',
            prefix: `DVM_JAPAN/${stockFolder}/`,
            max_results: 20,
            resource_type: 'image',
        });
        return result.resources.map((r: any) => r.secure_url);
    } catch {
        return [];
    }
}

async function main() {
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║   Restoring DB from Cloudinary Images       ║');
    console.log('╚══════════════════════════════════════════════╝');

    // First add manual vehicles (Polo & Canter) with known Cloudinary images
    console.log('\n[1] Adding manual vehicles (Polo & Canter)...');
    try {
        await prisma.vehicle.upsert({
            where: { stockId: 'DVM-VW-1092' },
            update: {},
            create: {
                stockId: 'DVM-VW-1092', make: 'VOLKSWAGEN', model: 'Polo', year: 2019,
                price: 3530, currency: 'USD', mileage: 38000, fuelType: 'Petrol',
                transmission: 'Automatic', bodyType: 'Hatchback', color: 'White',
                location: 'Japan', condition: 'Used', status: 'available', featured: true,
                description: 'Clean Volkswagen Polo 2019. Well maintained. Low mileage.',
                features: JSON.stringify(['Automatic', '5 Seats', 'Radio', 'Air Conditioning']),
                images: JSON.stringify([
                    'https://res.cloudinary.com/drm3wgah8/image/upload/v1780239203/dvm_japan/vehicles/DVM-VW-1092/media__1780238321510.png',
                    'https://res.cloudinary.com/drm3wgah8/image/upload/v1780239204/dvm_japan/vehicles/DVM-VW-1092/media__1780238335484.png',
                    'https://res.cloudinary.com/drm3wgah8/image/upload/v1780239205/dvm_japan/vehicles/DVM-VW-1092/media__1780238348608.png',
                    'https://res.cloudinary.com/drm3wgah8/image/upload/v1780239206/dvm_japan/vehicles/DVM-VW-1092/media__1780238361494.png',
                    'https://res.cloudinary.com/drm3wgah8/image/upload/v1780239207/dvm_japan/vehicles/DVM-VW-1092/media__1780238376264.png',
                ]),
            }
        });
        console.log('  ✓ Polo added');

        await prisma.vehicle.upsert({
            where: { stockId: 'DVM-MIT-FE305' },
            update: {},
            create: {
                stockId: 'DVM-MIT-FE305', make: 'MITSUBISHI', model: 'Canter', year: 1993,
                price: 8300, currency: 'USD', mileage: 106000, fuelType: 'Diesel',
                transmission: 'Manual', bodyType: 'Truck', color: 'Blue',
                location: 'Japan', condition: 'Used', status: 'available', featured: true,
                description: 'Mitsubishi Canter Dump Truck. Heavy duty performance.',
                features: JSON.stringify(['Manual', 'Diesel', 'Heavy Duty', 'Dump Truck']),
                images: JSON.stringify([
                    'https://res.cloudinary.com/drm3wgah8/image/upload/v1780237678/dvm_japan/vehicles/DVM-MIT-FE305/WhatsApp_Image_2026-05-08_at_15.47.42_2.jpg',
                    'https://res.cloudinary.com/drm3wgah8/image/upload/v1780237679/dvm_japan/vehicles/DVM-MIT-FE305/WhatsApp_Image_2026-05-08_at_15.47.42_6.jpg',
                    'https://res.cloudinary.com/drm3wgah8/image/upload/v1780237682/dvm_japan/vehicles/DVM-MIT-FE305/WhatsApp_Image_2026-05-08_at_15.47.42_3.jpg',
                    'https://res.cloudinary.com/drm3wgah8/image/upload/v1780237683/dvm_japan/vehicles/DVM-MIT-FE305/WhatsApp_Image_2026-05-08_at_15.47.42_9.jpg',
                    'https://res.cloudinary.com/drm3wgah8/image/upload/v1780237685/dvm_japan/vehicles/DVM-MIT-FE305/WhatsApp_Image_2026-05-08_at_15.47.42.jpg',
                ]),
            }
        });
        console.log('  ✓ Canter added');
    } catch (e: any) {
        console.log('  ⚠ Manual vehicles:', e.message);
    }

    // Get all MDK vehicle folders from Cloudinary
    console.log('\n[2] Fetching vehicle folders from Cloudinary...');
    let folders: string[] = [];
    try {
        folders = await getAllFolders();
        console.log(`  ✓ Found ${folders.length} folders in DVM_JAPAN/`);
    } catch (e: any) {
        console.log('  ⚠ Could not list folders:', e.message);
    }

    if (folders.length === 0) {
        console.log('\n  No MDK vehicle folders found. Only manual vehicles added.');
        const count = await prisma.vehicle.count();
        console.log(`\n✅ Total vehicles in DB: ${count}`);
        return;
    }

    console.log('\n[3] Rebuilding vehicle records from image folders...');
    let success = 0, skipped = 0;

    for (const folder of folders) {
        // Skip manual ones we already added
        if (folder.includes('DVM-VW') || folder.includes('DVM-MIT') || folder.includes('VW-1092') || folder.includes('MIT-FE305')) {
            skipped++;
            continue;
        }

        try {
            const images = await getImagesForFolder(folder);
            if (images.length === 0) { skipped++; continue; }

            // Parse stockId from folder name (e.g. "MDK-DVM-12345" or "DVM-12345")
            const stockId = `MDK-${folder}`;

            // Try to extract make/model from folder name: "MDK-DVM-TOYOTA-COROLLA-12345"
            const parts = folder.split('-').filter(p => p.length > 1);
            const make = (parts[0] || 'UNKNOWN').toUpperCase();
            const model = parts.slice(1, 3).join(' ') || 'Vehicle';

            await prisma.vehicle.upsert({
                where: { stockId },
                update: { images: JSON.stringify(images) },
                create: {
                    stockId, make, model, year: 2018, price: 0, currency: 'USD',
                    mileage: 0, fuelType: 'Petrol', transmission: 'Automatic',
                    bodyType: inferBodyType(folder), color: 'Unknown',
                    location: 'Japan', condition: 'Used', status: 'available',
                    featured: success < 20,
                    description: `${make} ${model} — Available for export from Japan.`,
                    features: JSON.stringify([]),
                    images: JSON.stringify(images),
                }
            });
            success++;
            if (success % 10 === 0) process.stdout.write(`  ${success} vehicles restored...\n`);
        } catch {
            skipped++;
        }
    }

    const total = await prisma.vehicle.count();
    console.log(`\n✅ Done! ${success} vehicles restored from Cloudinary.`);
    console.log(`📦 Total in DB: ${total}`);
}

main()
    .catch(e => { console.error('Error:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
