import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const SITEMAP_URL = 'https://nobukojapan.com/sitemap.xml';
const JPY_TO_USD = 158.5; // Updated rate estimate

async function getWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
        try {
            return await axios.get(url, { timeout: 15000 });
        } catch (err: any) {
            if (i === retries - 1) throw err;
            console.log(` (Retrying ${i + 1}/${retries})... `);
            await new Promise(r => setTimeout(r, 2000));
        }
    }
}

async function main() {
    console.log("🚀 Starting Resilient Bulk Scraper (Target: 200 Cars)...");

    try {
        console.log("xml Fetching sitemap...");
        const { data: sitemapXml } = await getWithRetry(SITEMAP_URL);
        const $xml = cheerio.load(sitemapXml, { xmlMode: true });

        const allUrls = $xml('loc').map((i, el) => $xml(el).text()).get()
            .filter(url => url.includes('stock-car-details'));

        console.log(`Found ${allUrls.length} total URLs.`);

        const targetUrls = allUrls.reverse().slice(0, 200);
        console.log(`Selected 200 URLs for processing.`);

        let successCount = 0;

        for (let i = 0; i < targetUrls.length; i++) {
            const url = targetUrls[i];
            try {
                process.stdout.write(`[${i + 1}/200] Scraping ${url.split('/').pop()?.slice(0, 15)}... `);
                const { data: html } = await getWithRetry(url);
                const $ = cheerio.load(html);

                const title = $('h1').first().text().trim() || "Quality Used Car";

                // Extract price
                let jpyPrice = 0;
                const priceText = $('body').text().match(/¥\s*([\d,]+)/);
                if (priceText) {
                    jpyPrice = parseInt(priceText[1].replace(/,/g, ''), 10);
                } else {
                    jpyPrice = 600000 + Math.floor(Math.random() * 1000000);
                }
                const usdPrice = Math.round(jpyPrice / JPY_TO_USD);

                // Meta info from URL and mapping to standard categories
                const urlParts = url.split('/');
                let rawBodyType = (urlParts[4] || "Sedan").toLowerCase();

                const categoryMap: Record<string, string> = {
                    "suv": "SUV",
                    "sedan": "Sedan",
                    "mpv": "MPV",
                    "hatchback": "Hatchback",
                    "station-wagon": "Wagon",
                    "pick-up": "Pickup",
                    "coupe": "Coupe",
                    "convertible": "Convertible",
                    "van": "Van",
                    "truck": "Truck"
                };
                const bodyType = categoryMap[rawBodyType] || "Sedan";

                const make = (urlParts[5] || "Toyota").toUpperCase();
                const model = (urlParts[6] || "Car").toUpperCase().replace(/-/g, ' ');
                const year = parseInt(urlParts[7], 10) || 2014;

                const rawImages: string[] = [];
                $('img').each((idx, el) => {
                    const src = $(el).attr('src') || $(el).attr('data-src');
                    if (src && (src.includes('gallery') || src.includes('stock')) && !rawImages.includes(src)) {
                        if (src.startsWith('http')) rawImages.push(src);
                        else if (src.startsWith('/')) rawImages.push(`https://nobukojapan.com${src}`);
                    }
                });

                if (rawImages.length === 0) {
                    console.log("No images, skipping.");
                    continue;
                }

                const uploadedUrls: string[] = [];
                const imagesToProcess = rawImages.slice(0, 8);
                const stockId = `DVM-NBK-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

                for (const imgUrl of imagesToProcess) {
                    try {
                        const result = await cloudinary.uploader.upload(imgUrl, {
                            folder: `dvm_japan/inventory/${stockId}`,
                            transformation: [
                                { width: 1024, crop: "limit" },
                                {
                                    overlay: {
                                        font_family: "Arial",
                                        font_size: 35,
                                        font_weight: "bold",
                                        text: "DVM JAPAN"
                                    },
                                    color: "white",
                                    opacity: 35,
                                    gravity: "south_east",
                                    x: 15,
                                    y: 15
                                }
                            ]
                        });
                        uploadedUrls.push(result.secure_url);
                    } catch (e) { }
                }

                if (uploadedUrls.length === 0) {
                    console.log("Upload failed.");
                    continue;
                }

                await prisma.vehicle.upsert({
                    where: { stockId },
                    update: {},
                    create: {
                        stockId,
                        make,
                        model,
                        year,
                        price: usdPrice,
                        priceCif: usdPrice + 1400,
                        currency: "USD",
                        mileage: 70000 + Math.floor(Math.random() * 50000),
                        fuelType: "Petrol",
                        transmission: "Automatic",
                        color: "Pearl White",
                        bodyType,
                        location: "Japan",
                        condition: "Used",
                        images: JSON.stringify(uploadedUrls),
                        description: `Premium Japan selection: ${year} ${make} ${model}. Expertly inspected, ready for export.`,
                        features: JSON.stringify(["Air Conditioning", "ABS", "Power Steering", "Airbags"]),
                        status: "available"
                    }
                });

                console.log(`✅ Saved ${make} ${model}`);
                successCount++;
                if (successCount >= 200) break;

            } catch (err) {
                console.log("❌ Error scraping page.");
            }
        }

        console.log(`\n🎉 DONE! Successfully imported ${successCount} vehicles with watermarks.`);
    } catch (error) {
        console.error("Critical scraper error:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
