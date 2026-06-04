import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const BASE_URL = 'https://mdkjapan.com';
const API_URL = `${BASE_URL}/used-cars/search/api`;
const LOGO_PATH = path.join(process.cwd(), 'public', 'logo.png');

// How many vehicles to import (increase/decrease as needed)
const TOTAL_VEHICLES_TO_IMPORT = parseInt(process.env.SCRAPE_LIMIT || '200');

// Body type inference from make/model keywords
const BODY_TYPE_KEYWORDS: Record<string, string> = {
    'alphard': 'MPV', 'voxy': 'MPV', 'noah': 'MPV', 'sienna': 'MPV', 'odyssey': 'MPV',
    'step wagon': 'MPV', 'serena': 'MPV', 'delica': 'MPV',
    'land cruiser': 'SUV', 'rav4': 'SUV', 'cx-5': 'SUV', 'cx5': 'SUV',
    'x-trail': 'SUV', 'xtrail': 'SUV', 'forester': 'SUV', 'outback': 'SUV',
    'cr-v': 'SUV', 'crv': 'SUV', 'rush': 'SUV', 'terios': 'SUV',
    'hilux': 'Truck', 'ranger': 'Truck', 'navara': 'Truck', 'canter': 'Truck',
    'corolla': 'Sedan', 'camry': 'Sedan', 'accord': 'Sedan', 'axela': 'Sedan',
    'legacy': 'Sedan', 'lancer': 'Sedan', 'mark x': 'Sedan',
    'fit': 'Hatchback', 'yaris': 'Hatchback', 'swift': 'Hatchback', 'demio': 'Hatchback',
    'aqua': 'Hatchback', 'note': 'Hatchback', 'vitz': 'Hatchback',
    'every': 'Van', 'hiace': 'Van', 'carry': 'Van', 'nv200': 'Van',
    'clipper': 'Van', 'town box': 'Van',
    'prius': 'Sedan', 'insight': 'Sedan',
    'wingroad': 'Station Wagon', 'levorg': 'Station Wagon',
};

function inferBodyType(make: string, model: string): string {
    const combined = `${make} ${model}`.toLowerCase();
    for (const [keyword, bodyType] of Object.entries(BODY_TYPE_KEYWORDS)) {
        if (combined.includes(keyword)) return bodyType;
    }
    return 'Sedan'; // Default fallback
}

async function downloadImage(url: string): Promise<Buffer> {
    const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 20000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
            'Referer': 'https://mdkjapan.com/'
        }
    });
    return Buffer.from(response.data);
}

async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
    if (!fs.existsSync(LOGO_PATH)) return imageBuffer;
    try {
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        if (!metadata.width || !metadata.height) return imageBuffer;

        const logoWidth = Math.round(metadata.width * 0.18); // 18% width
        const logoBuffer = await sharp(LOGO_PATH)
            .resize(logoWidth)
            .png()
            .toBuffer();

        return await image
            .composite([{ input: logoBuffer, gravity: 'southeast', blend: 'over' }])
            .jpeg({ quality: 88 })
            .toBuffer();
    } catch {
        return imageBuffer;
    }
}

async function uploadToCloudinary(buffer: Buffer, vehicleFolder: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `DVM_JAPAN/${vehicleFolder}`,
                resource_type: 'image',
                overwrite: false,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result?.secure_url || '');
            }
        );
        uploadStream.end(buffer);
    });
}

async function scrapeVehicleDetails(url: string) {
    try {
        const { data: html } = await axios.get(url, {
            timeout: 15000,
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });
        const $ = cheerio.load(html);

        const details: any = { sourceUrl: url };

        // --- Stock ID and Chassis ---
        const topBadgeText = $('span.badge.bg-danger').text();
        const stockMatch = topBadgeText.match(/Stock No:\s*(\d+)/);
        if (stockMatch) details.stockId = `DVM-${stockMatch[1]}`;

        const chassisText = $('span.text-muted, span').filter((i, el) => $(el).text().includes('Chassis No:')).text();
        const chassisMatch = chassisText.match(/Chassis No:\s*([^\s<]+)/);
        if (chassisMatch) details.chassis = chassisMatch[1].replace(/\*/g, '*');

        // --- Title → Make, Model, Year ---
        const h1Text = $('h1').first().text().trim();
        details.title = h1Text;

        // "Honda Step Wagon 2018" → make=Honda, model=Step Wagon, year=2018
        const yearMatch = h1Text.match(/(\d{4})\s*$/);
        if (yearMatch) {
            details.year = parseInt(yearMatch[1]);
            const withoutYear = h1Text.replace(yearMatch[0], '').trim();
            const parts = withoutYear.split(' ');
            details.make = parts[0] || 'Unknown';
            details.model = parts.slice(1).join(' ') || 'Vehicle';
        } else {
            const parts = h1Text.split(' ');
            details.make = parts[0] || 'Unknown';
            details.model = parts.slice(1).join(' ') || 'Vehicle';
        }

        // Normalize make to uppercase
        details.make = details.make.toUpperCase();

        // --- Specs ---
        $('.spec-card-item').each((i, el) => {
            const label = $(el).find('.spec-label').text().trim().toLowerCase();
            const value = $(el).find('.spec-value').text().trim();
            if (label.includes('mileage')) {
                details.mileage = parseInt(value.replace(/[^0-9]/g, '')) || 0;
            }
            if (label.includes('engine')) details.engineSize = value;
            if (label.includes('transmission')) details.transmission = value.includes('Auto') ? 'Automatic' : 'Manual';
            if (label.includes('fuel')) details.fuelType = value;
            if (label.includes('year') && !details.year) details.year = parseInt(value) || 2015;
            if (label.includes('door')) details.doors = parseInt(value) || 4;
        });

        // --- Price (USD — MDK Japan displays prices directly in USD $) ---
        let priceUsd = 0;

        // Method 1: Discounted price span (priority)
        const discountedText = $('span.vehicle-price-discounted').first().text().trim();
        if (discountedText) {
            priceUsd = parseInt(discountedText.replace(/[^\d]/g, '')) || 0;
        }

        // Method 2: Regular vehicle-price span (non-discounted)
        if (priceUsd === 0) {
            const regularPriceText = $('span.vehicle-price').not('.vehicle-price-placeholder').not('.vehicle-price-original').first().text().trim();
            if (regularPriceText) {
                priceUsd = parseInt(regularPriceText.replace(/[^\d]/g, '')) || 0;
            }
        }

        // Method 3: Original (strikethrough) price as last resort
        if (priceUsd === 0) {
            const originalText = $('span.vehicle-price-original').first().text().trim();
            if (originalText) {
                priceUsd = parseInt(originalText.replace(/[^\d]/g, '')) || 0;
            }
        }

        // Method 4: Regex fallback — find "$X,XXX" pattern in HTML
        if (priceUsd === 0) {
            const usdMatches = html.match(/\$[\d,]+/g);
            if (usdMatches && usdMatches.length > 0) {
                const prices = usdMatches
                    .map((p: string) => parseInt(p.replace(/[^\d]/g, '')))
                    .filter((p: number) => p >= 500 && p < 500000)
                    .sort((a: number, b: number) => a - b);
                if (prices.length > 0) priceUsd = prices[0];
            }
        }

        details.priceUsd = priceUsd;

        // --- Body Type ---
        details.bodyType = inferBodyType(details.make || '', details.model || '');

        // --- Images ---
        const images: string[] = [];

        // Target specific areas for vehicle photos
        // Target specific areas for vehicle photos ONLY
        const selectors = [
            '#full-gallery .carousel-item img',
            '.vehicle-thumb-item img',
            '#vehicleThumbnailGrid img',
            '.vehicle-gallery img',
            // Removed broad '.carousel img' which might grab other sliders
        ];

        selectors.forEach(sel => {
            $(sel).each((i, el) => {
                const src = $(el).attr('src') || $(el).attr('data-src') || '';
                // Filter out small icons or related item images
                if (src && !src.includes('placeholder') && !src.includes('logo') && !src.includes('icon') && !src.includes('avatar')) {
                    // Check if it looks like a vehicle image (usually has 'vehicle' or 'cars' or unique ID in it)
                    const fullUrl = src.startsWith('http') ? src : BASE_URL + src;
                    if (!images.includes(fullUrl)) images.push(fullUrl);
                }
            });
        });

        // Limit images to avoid bloat (max 15 high-quality images is usually enough)
        details.images = images.slice(0, 15);

        // --- Features ---
        const features: string[] = [];
        $('[class*="feature"] span, [class*="option"] span').each((i, el) => {
            const text = $(el).text().trim();
            if (text && text.length > 2 && text.length < 50) features.push(text);
        });
        details.features = features;

        // --- Description ---
        details.description = `${details.year || ''} ${details.make} ${details.model} — ${details.fuelType || 'Petrol'}, ${details.transmission || 'Automatic'}, ${details.mileage?.toLocaleString() || '0'}km. Fully inspected and ready for export from Japan.`;

        return details;
    } catch (err: any) {
        console.error(`\nError scraping ${url}: ${err.message}`);
        return null;
    }
}

async function delay(ms: number) {
    return new Promise(r => setTimeout(r, ms));
}

async function getVehicleLinks(totalNeeded: number): Promise<string[]> {
    const links: string[] = [];
    let page = 1;

    while (links.length < totalNeeded) {
        try {
            const { data } = await axios.get(`${API_URL}?page=${page}`, {
                timeout: 10000,
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            if (!data.success || !data.gridHtml) break;

            const $ = cheerio.load(data.gridHtml);
            const pageLinks: string[] = [];
            $('a[href*="used-cars/"]').each((i, el) => {
                const href = $(el).attr('href');
                if (href && /\/used-cars\/\d+$/.test(href)) {
                    const full = href.startsWith('http') ? href : BASE_URL + href;
                    if (!links.includes(full) && !pageLinks.includes(full)) {
                        pageLinks.push(full);
                    }
                }
            });

            if (pageLinks.length === 0) break;
            links.push(...pageLinks);
            console.log(`  Page ${page}: +${pageLinks.length} links (total: ${links.length})`);
            page++;
            await delay(500);
        } catch {
            console.log(`  Page ${page} failed, stopping collection.`);
            break;
        }
    }

    return links.slice(0, totalNeeded);
}

async function main() {
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║      DVM JAPAN — MDK Japan Full Scraper          ║');
    console.log('╚══════════════════════════════════════════════════╝');
    console.log(`\nTarget: ${TOTAL_VEHICLES_TO_IMPORT} vehicles | Cloudinary: drm3wgah8 | Watermark: ✓`);

    console.log('\n[1/4] Wiping ALL existing vehicle records (Total Cleanup)...');
    const deleted = await prisma.vehicle.deleteMany({});
    console.log(`  ✓ Successfully deleted ${deleted.count} old records.`);

    // Step 2: Collect vehicle links
    console.log(`\n[2/4] Collecting ${TOTAL_VEHICLES_TO_IMPORT} vehicle URLs...`);
    const vehicleLinks = await getVehicleLinks(TOTAL_VEHICLES_TO_IMPORT);
    console.log(`  ✓ Collected ${vehicleLinks.length} URLs`);

    if (vehicleLinks.length === 0) {
        console.log('No vehicle links found. Exiting.');
        return;
    }

    // Step 3: Scrape and import
    console.log(`\n[3/4] Scraping vehicle details + watermarking images...`);

    let success = 0;
    let failed = 0;

    for (let i = 0; i < vehicleLinks.length; i++) {
        const url = vehicleLinks[i];
        const shortUrl = url.split('/').pop() || url;
        process.stdout.write(`  [${i + 1}/${vehicleLinks.length}] Stock #${shortUrl} ... `);

        try {
            const details = await scrapeVehicleDetails(url);
            if (!details || !details.stockId) {
                console.log('SKIP (no stockId)');
                failed++;
                continue;
            }

            // Process up to 10 images
            const cloudUrls: string[] = [];
            const imageList: string[] = (details.images || []).slice(0, 10);
            for (const imgUrl of imageList) {
                try {
                    const buf = await downloadImage(imgUrl);
                    const watermarked = await addWatermark(buf);
                    const cdnUrl = await uploadToCloudinary(watermarked, details.stockId);
                    if (cdnUrl) cloudUrls.push(cdnUrl);
                } catch {
                    // skip bad image
                }
            }
            process.stdout.write(`(${cloudUrls.length} imgs) `);

            const make = (details.make || 'UNKNOWN').toUpperCase();
            const stockId = `MDK-${details.stockId}`;

            await prisma.vehicle.upsert({
                where: { stockId },
                update: {
                    price: details.priceUsd || 0,
                    mileage: details.mileage || 0,
                    images: JSON.stringify(cloudUrls.length > 0 ? cloudUrls : details.images?.slice(0, 10) || []),
                    bodyType: details.bodyType,
                    make,
                    model: details.model || 'Vehicle',
                    year: details.year || 2020,
                    fuelType: details.fuelType || 'Petrol',
                    transmission: details.transmission || 'Automatic',
                    description: details.description || '',
                    features: JSON.stringify(details.features || []),
                },
                create: {
                    stockId,
                    make,
                    model: details.model || 'Vehicle',
                    year: details.year || 2020,
                    price: details.priceUsd || 0,
                    currency: 'USD',
                    mileage: details.mileage || 0,
                    fuelType: details.fuelType || 'Petrol',
                    transmission: details.transmission || 'Automatic',
                    bodyType: details.bodyType,
                    color: 'Unknown',
                    location: 'Japan',
                    condition: 'Used',
                    images: JSON.stringify(cloudUrls.length > 0 ? cloudUrls : details.images?.slice(0, 10) || []),
                    description: details.description || '',
                    features: JSON.stringify(details.features || []),
                    chassis: details.chassis,
                    source: url,
                    status: 'available',
                    featured: success < 20, // First 20 are featured
                }
            });

            success++;
            console.log('✓');
        } catch (err: any) {
            console.log(`✗ (${err.message?.slice(0, 40)})`);
            failed++;
        }

        // Polite delay
        await delay(400);
    }

    // Step 4: Show summary
    console.log('\n[4/4] Import complete!');
    console.log('═'.repeat(50));
    console.log(`  ✅ Imported: ${success} vehicles`);
    console.log(`  ❌ Failed:   ${failed} vehicles`);

    const breakdown = await prisma.vehicle.groupBy({
        by: ['bodyType'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } }
    });
    const makes = await prisma.vehicle.groupBy({
        by: ['make'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
    });
    const priceStats = await prisma.vehicle.aggregate({
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true }
    });

    console.log('\n📊 Body Type Breakdown:');
    breakdown.forEach(b => console.log(`   ${b.bodyType || 'Unknown'}: ${b._count.id}`));
    console.log('\n🚗 Top Makes:');
    makes.forEach(m => console.log(`   ${m.make}: ${m._count.id}`));
    console.log('\n💰 Price Stats (USD):');
    console.log(`   Min: $${priceStats._min.price?.toLocaleString() || 0}`);
    console.log(`   Max: $${priceStats._max.price?.toLocaleString() || 0}`);
    console.log(`   Avg: $${Math.round(priceStats._avg.price || 0).toLocaleString()}`);
    console.log('\n[5/5] Adding manual vehicles (Polo & Canter)...');
    try {
        await prisma.vehicle.create({
            data: {
                stockId: "DVM-VW-1092",
                make: "VOLKSWAGEN",
                model: "Polo",
                year: 2019,
                price: 3530,
                currency: "USD",
                mileage: 38000,
                fuelType: "Petrol",
                transmission: "Automatic",
                bodyType: "Hatchback",
                images: JSON.stringify([
                    "https://res.cloudinary.com/drm3wgah8/image/upload/v1780239203/dvm_japan/vehicles/DVM-VW-1092/media__1780238321510.png",
                    "https://res.cloudinary.com/drm3wgah8/image/upload/v1780239204/dvm_japan/vehicles/DVM-VW-1092/media__1780238335484.png",
                    "https://res.cloudinary.com/drm3wgah8/image/upload/v1780239205/dvm_japan/vehicles/DVM-VW-1092/media__1780238348608.png",
                    "https://res.cloudinary.com/drm3wgah8/image/upload/v1780239206/dvm_japan/vehicles/DVM-VW-1092/media__1780238361494.png",
                    "https://res.cloudinary.com/drm3wgah8/image/upload/v1780239207/dvm_japan/vehicles/DVM-VW-1092/media__1780238376264.png"
                ]),
                status: "available",
                featured: true,
                description: "Clean Volkswagen Polo 2019. Well maintained. Low mileage.",
                location: "Japan",
                condition: "Used",
                color: "White",
                features: JSON.stringify(["Automatic", "5 Seats", "Compact", "Radio", "Air Conditioning"])
            }
        });
        await prisma.vehicle.create({
            data: {
                stockId: "DVM-MIT-FE305",
                make: "MITSUBISHI",
                model: "Canter",
                year: 1993,
                price: 8300,
                currency: "USD",
                mileage: 106000,
                fuelType: "Diesel",
                transmission: "Manual",
                bodyType: "Truck",
                images: JSON.stringify([
                    "https://res.cloudinary.com/drm3wgah8/image/upload/v1780237678/dvm_japan/vehicles/DVM-MIT-FE305/WhatsApp_Image_2026-05-08_at_15.47.42_2.jpg",
                    "https://res.cloudinary.com/drm3wgah8/image/upload/v1780237679/dvm_japan/vehicles/DVM-MIT-FE305/WhatsApp_Image_2026-05-08_at_15.47.42_6.jpg",
                    "https://res.cloudinary.com/drm3wgah8/image/upload/v1780237682/dvm_japan/vehicles/DVM-MIT-FE305/WhatsApp_Image_2026-05-08_at_15.47.42_3.jpg",
                    "https://res.cloudinary.com/drm3wgah8/image/upload/v1780237683/dvm_japan/vehicles/DVM-MIT-FE305/WhatsApp_Image_2026-05-08_at_15.47.42_9.jpg",
                    "https://res.cloudinary.com/drm3wgah8/image/upload/v1780237685/dvm_japan/vehicles/DVM-MIT-FE305/WhatsApp_Image_2026-05-08_at_15.47.42.jpg"
                ]),
                status: "available",
                featured: true,
                description: "Mitsubishi Canter Dump Truck. Reliable and ready to work. Heavy duty performance.",
                location: "Japan",
                condition: "Used",
                color: "Blue",
                features: JSON.stringify(["Manual", "Diesel", "Heavy Duty", "Dump Truck"])
            }
        });
        console.log('  ✓ Manual vehicles added.');
    } catch (err: any) {
        console.log('  ⚠ Manual vehicles already exist or error occurred:', err.message);
    }

    console.log('\n🎉 DVM Japan inventory is live and fully cleaned!');
}

main()
    .catch(e => { console.error('Critical error:', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
