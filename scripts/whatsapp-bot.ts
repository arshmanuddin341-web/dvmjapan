import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

dotenv.config();
const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        headless: true
    }
});

async function getUsdRates() {
    try {
        const res = await axios.get('https://open.er-api.com/v6/latest/USD');
        return res.data.rates;
    } catch {
        return { JPY: 156, PKR: 278, AED: 3.67 }; // Fallback
    }
}

// Helper: Advanced Text Parser
async function parseCarData(text: string) {
    const textLower = text.toLowerCase();
    const lines = text.split('\n').map(l => l.trim());
    const rates = await getUsdRates();

    let make = "Unknown";
    let model = "Car";
    let year = new Date().getFullYear();
    let priceUsd = 0;
    let mileage = 50000;
    let engineSize = 1.5;
    let transmission = "Automatic";
    let fuelType = "Petrol";
    let bodyType = "Sedan";
    let location = "Yokohama Port";

    // 1. Make/Model (Line 1)
    const firstLine = lines[0] || "";
    if (firstLine) {
        const parts = firstLine.split(' ');
        if (parts.length >= 2) {
            make = parts[0].toUpperCase();
            model = parts.slice(1).join(' ').toUpperCase();
        } else {
            model = firstLine.toUpperCase();
        }
    }

    // 2. Price & Currency Conversion
    const priceRegex = /(\d+[,.]\d+|\d+)\s*(USD|\$|Lakh|PKR|Yen|JPY|¥|AED|DH)/i;
    const priceMatch = text.match(priceRegex);
    if (priceMatch) {
        let rawPrice = parseFloat(priceMatch[1].replace(/,/g, ''));
        const currency = priceMatch[2].toUpperCase();

        if (currency.includes('YEN') || currency.includes('JPY') || currency === '¥') {
            priceUsd = rawPrice / (rates.JPY || 156);
        } else if (currency.includes('PKR') || currency.includes('LAKH')) {
            if (currency.includes('LAKH')) rawPrice = rawPrice * 100000;
            priceUsd = rawPrice / (rates.PKR || 278);
        } else if (currency.includes('AED') || currency.includes('DH')) {
            priceUsd = rawPrice / (rates.AED || 3.67);
        } else {
            priceUsd = rawPrice; // Already USD
        }
    }

    // 3. Other Fields
    const yearMatch = text.match(/\b(20\d{2}|19\d{2})\b/);
    if (yearMatch) year = parseInt(yearMatch[1]);

    const mileageMatch = text.match(/(\d+[,.]\d+|\d+)\s*(KM|Mileage)/i);
    if (mileageMatch) mileage = parseInt(mileageMatch[1].replace(/[,.]/g, ''));

    const engineMatch = text.match(/(\d+(\.\d+)?)L/i);
    if (engineMatch) engineSize = parseFloat(engineMatch[1]);

    // Body Type keywords
    if (textLower.includes('suv')) bodyType = "SUV";
    else if (textLower.includes('hatchback')) bodyType = "Hatchback";
    else if (textLower.includes('wagon')) bodyType = "Wagon";
    else if (textLower.includes('van')) bodyType = "Van";
    else if (textLower.includes('pickup')) bodyType = "Pickup";

    // Location keywords
    if (textLower.includes('kobe')) location = "Kobe Port";
    else if (textLower.includes('osaka')) location = "Osaka Port";
    else if (textLower.includes('nagoya')) location = "Nagoya Port";

    if (textLower.includes('manual')) transmission = "Manual";
    if (textLower.includes('diesel')) fuelType = "Diesel";
    if (textLower.includes('hybrid')) fuelType = "Hybrid";

    return {
        make, model, year, price: Math.round(priceUsd), mileage, engineSize, transmission, fuelType, bodyType, location,
        description: text
    };
}

client.on('message_create', async (msg) => {
    if (msg.hasMedia) {
        try {
            console.log('📦 New Car Listing Received! Converting currencies...');
            const media = await msg.downloadMedia();
            if (!media || !media.mimetype.startsWith('image/')) return;

            const data = await parseCarData(msg.body || "");

            const tempFile = path.join(__dirname, `temp_${Date.now()}.jpg`);
            fs.writeFileSync(tempFile, Buffer.from(media.data, 'base64'));

            const uploadRes = await cloudinary.uploader.upload(tempFile, { folder: 'whatsapp_stock' });
            fs.unlinkSync(tempFile);

            const vehicle = await prisma.vehicle.create({
                data: {
                    stockId: `WA-${Math.floor(100000 + Math.random() * 900000)}`,
                    make: data.make,
                    model: data.model,
                    year: data.year,
                    price: data.price > 0 ? data.price : 5000,
                    mileage: data.mileage,
                    engineSize: data.engineSize,
                    transmission: data.transmission,
                    fuelType: data.fuelType,
                    bodyType: data.bodyType,
                    color: "Various",
                    condition: "Used",
                    location: data.location,
                    images: uploadRes.secure_url,
                    description: data.description || "Uploaded via WhatsApp Bot",
                    features: "WhatsApp Import with Auto-Conversion",
                    status: 'available',
                }
            });

            await msg.reply(`✅ *LIVE UPDATE:*
            ${vehicle.make} ${vehicle.model} (${vehicle.year})
            💰 Price: $${vehicle.price.toLocaleString()} (Auto-Converted)
            📍 Location: ${vehicle.location}
            🚗 Body: ${vehicle.bodyType}
            
            🌐 View: http://187.77.152.99/vehicles/${vehicle.id}`);

        } catch (err: any) {
            console.error('❌ Bot Error:', err.message);
        }
    }
});

client.initialize();
console.log('🚀 Starting DVM WhatsApp Bot with Currency Support...');
