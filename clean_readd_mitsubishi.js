const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanAndAdd() {
    try {
        console.log('Cleaning Mitsubishi...');
        await prisma.vehicle.deleteMany({
            where: { stockId: 'STK-MC-1993-001' }
        });
        console.log('Re-adding Mitsubishi...');
        // ... copied from add-car-mitsubishi.ts ...
        const images = [
            "WhatsApp Image 2026-05-08 at 15.47.42 (1).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (10).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (11).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (12).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (13).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (14).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (15).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (16).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (17).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (2).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (3).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (4).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (5).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (6).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (7).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (8).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42 (9).jpeg",
            "WhatsApp Image 2026-05-08 at 15.47.42.jpeg"
        ].map(img => `/uploads/mitsubishi-canter-1993/${encodeURIComponent(img)}`);

        await prisma.vehicle.create({
            data: {
                stockId: "STK-MC-1993-001",
                make: "MITSUBISHI",
                model: "Canter",
                year: 1993,
                price: 8300,
                currency: "USD",
                mileage: 106000,
                fuelType: "Diesel",
                transmission: "Manual",
                color: "Blue",
                engineSize: 3560,
                engineType: "4D32",
                chassis: "FE305BD-49**",
                location: "Japan",
                condition: "Used",
                description: "1993 MITSUBISHI Canter. Grade: dump. Loading Capacity: 2000 KG. Model: U-FE305BD. Equipment: PS PW. Manual Transmission.",
                features: JSON.stringify(["Dump Grade", "Loading Capacity 2000 KG", "PS (Power Steering)", "PW (Power Windows)", "Manual Transmission"]),
                images: JSON.stringify(images),
                status: "available",
                featured: true,
            },
        });
        console.log('Mitsubishi Re-added.');

        const total = await prisma.vehicle.count();
        console.log('Total Vehicles:', total);
    } catch (err) {
        console.error(err);
    } finally {
        await prisma.$disconnect();
    }
}

cleanAndAdd();
