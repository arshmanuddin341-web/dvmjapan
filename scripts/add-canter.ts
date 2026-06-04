import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const canter = await prisma.vehicle.create({
        data: {
            stockId: "DVM-MIT-FE305",
            make: "Mitsubishi",
            model: "Canter",
            year: 1993,
            price: 8300,
            currency: "USD",
            mileage: 106000,
            fuelType: "Diesel",
            transmission: "Manual",
            bodyType: "Truck",
            color: "Blue",
            engineSize: 3.56,
            engineType: "4D32",
            location: "Yokohama",
            condition: "Used",
            chassis: "FE305BD-49**",
            description: "Mitsubishi Canter Dump Truck. Loading Capacity: 2000 KG. Reliable 4D32 diesel engine. Features Power Steering (PS) and Power Windows (PW). Excellent condition for its age, ready for work.",
            features: JSON.stringify(["Manual Transmission", "Diesel", "Dump Truck", "Power Steering", "Power Windows", "2000kg Capacity"]),
            images: JSON.stringify([
                "/images/inventory/mitsubishi-canter-1993/truck-1.jpg",
                "/images/inventory/mitsubishi-canter-1993/truck-2.jpg"
            ]),
            status: "available",
            featured: false
        }
    });

    console.log("Truck added successfully:", canter.stockId);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
