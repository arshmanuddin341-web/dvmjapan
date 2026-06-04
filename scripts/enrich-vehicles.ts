import { PrismaClient } from "@prisma/client";
import axios from "axios";
import * as cheerio from "cheerio";

const prisma = new PrismaClient();

// Helper to extract image URLs from a Nobuko car detail page
async function extractImageUrls(pageUrl: string): Promise<string[]> {
    try {
        const { data } = await axios.get(pageUrl);
        const $ = cheerio.load(data);
        // Nobuko uses a gallery with <img> tags inside a container with class "gallery" (adjust selector if needed)
        const images: string[] = [];
        $("img").each((_i, el) => {
            const src = $(el).attr("src") || $(el).attr("data-src");
            if (src && !src.includes("placeholder")) {
                images.push(src);
            }
        });
        // Return unique URLs, limit to first 10
        return Array.from(new Set(images)).slice(0, 10);
    } catch (err) {
        console.error(`Failed to fetch ${pageUrl}:`, err);
        return [];
    }
}

async function deleteDummyVehicles() {
    // Assuming dummy vehicles have make "Dummy" or stockId starting with "DUMMY"
    const deleted = await prisma.vehicle.deleteMany({
        where: {
            OR: [{ make: "Dummy" }, { stockId: { startsWith: "DUMMY" } }],
        },
    });
    console.log(`Deleted ${deleted.count} dummy vehicle records.`);
}

async function enrichVehicleImages() {
    const vehicles = await prisma.vehicle.findMany({
        where: {
            // Only consider vehicles that have a source URL (where we can scrape images)
            source: { not: null },
        },
    });

    for (const v of vehicles) {
        let images: string[] = [];
        try {
            images = JSON.parse(v.images || "[]");
        } catch {
            images = [];
        }
        if (images.length >= 5) continue; // already sufficient

        const sourceUrl = (v as any).source as string;
        if (!sourceUrl) continue;

        const scraped = await extractImageUrls(sourceUrl);
        const combined = Array.from(new Set([...images, ...scraped])).slice(0, 5);
        if (combined.length > images.length) {
            await prisma.vehicle.update({
                where: { id: v.id },
                data: { images: JSON.stringify(combined) },
            });
            console.log(`Updated vehicle ${v.stockId} with ${combined.length} images.`);
        }
    }
}

async function main() {
    await deleteDummyVehicles();
    await enrichVehicleImages();
    console.log("✅ Vehicle cleanup and image enrichment complete.");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
