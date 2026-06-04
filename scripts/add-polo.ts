import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const polo = await prisma.vehicle.create({
        data: {
            stockId: "DVM-VW-1092",
            make: "Volkswagen",
            model: "Polo",
            year: 2019,
            price: 3530, // Approx $3,530 for 543,000 JPY
            currency: "USD",
            mileage: 38000,
            fuelType: "Petrol",
            transmission: "Automatic",
            bodyType: "Hatchback",
            color: "White",
            engineSize: 1.0,
            location: "Yokohama",
            condition: "Used",
            description: "**Engine check Light On** & Suspension Damage. Clean interior, 5 doors, 5 seats. Well maintained hatchback from Japan.",
            features: JSON.stringify(["Automatic", "Power Windows", "Air Conditioning", "5 Seats", "5 Doors"]),
            images: JSON.stringify([
                "/images/inventory/vw-polo-2019/polo-1.jpg",
                "/images/inventory/vw-polo-2019/polo-2.jpg",
                "/images/inventory/vw-polo-2019/polo-3.jpg",
                "/images/inventory/vw-polo-2019/polo-4.jpg",
                "/images/inventory/vw-polo-2019/polo-5.jpg"
            ]),
            status: "available",
            featured: true
        }
    });

    console.log("Vehicle added successfully:", polo.stockId);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
