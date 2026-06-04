import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const NOBUKO_DATA = [
    {
        "title": "HONDA STEP WAGON 2013",
        "year": 2013,
        "mileage": "122000 KM",
        "gear": "Automatic",
        "color": "BLACK",
        "price_jpy": "¥459,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/10146-20260516155640-919979.jpg"
    },
    {
        "title": "NISSAN NOTE 2015",
        "year": 2015,
        "mileage": "79000 KM",
        "gear": "Automatic",
        "color": "SILVER",
        "price_jpy": "¥293,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/10126-20260516150829-418987.jpg"
    },
    {
        "title": "TOYOTA CAMRY 2019",
        "year": 2019,
        "mileage": "115000 KM",
        "gear": "Automatic",
        "color": "PEARL",
        "price_jpy": "¥1,630,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/10114-20260516133229-053390.jpg"
    },
    {
        "title": "TOYOTA VELLFIRE 2014",
        "year": 2014,
        "mileage": "95000 KM",
        "gear": "Automatic",
        "color": "BLACK",
        "price_jpy": "¥775,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/10088-20260516100243-153826.jpg"
    },
    {
        "title": "NISSAN NOTE 2014",
        "year": 2014,
        "mileage": "63000 KM",
        "gear": "Automatic",
        "color": "GREY",
        "price_jpy": "¥272,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/10085-20260516100546-197027.jpg"
    },
    {
        "title": "TOYOTA VELLFIRE 2013",
        "year": 2013,
        "mileage": "113000 KM",
        "gear": "Automatic",
        "color": "BLACK",
        "price_jpy": "¥663,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/10084-20260516100605-550940.jpg"
    },
    {
        "title": "BMW 1 SERIES 2013",
        "year": 2013,
        "mileage": "33000 KM",
        "gear": "Automatic",
        "color": "BROWN",
        "price_jpy": "¥340,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/10072-20260515171400-080293.jpg"
    },
    {
        "title": "NISSAN ELGRAND 2014",
        "year": 2014,
        "mileage": "127000 KM",
        "gear": "Automatic",
        "color": "BLACK",
        "price_jpy": "¥520,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/10055-20260515170733-384019.jpg"
    },
    {
        "title": "NISSAN NOTE 2014",
        "year": 2014,
        "mileage": "86000 KM",
        "gear": "Automatic",
        "color": "BLUE",
        "price_jpy": "¥266,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/10034-20260516082951-670665.jpg"
    },
    {
        "title": "AUDI A3 SEDAN 2014",
        "year": 2014,
        "mileage": "129000 KM",
        "gear": "Automatic",
        "color": "BLACK",
        "price_jpy": "¥545,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/10021-20260515165751-728135.jpg"
    },
    {
        "title": "LEXUS ES 2020",
        "year": 2020,
        "mileage": "84000 KM",
        "gear": "Automatic",
        "color": "PEARL",
        "price_jpy": "¥2,790,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/9984-20260515131835-746490.jpg"
    },
    {
        "title": "TOYOTA ALPHARD 2012",
        "year": 2012,
        "mileage": "91000 KM",
        "gear": "Automatic",
        "color": "PEARL",
        "price_jpy": "¥678,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/9965-20260515130640-263413.jpg"
    },
    {
        "title": "NISSAN NOTE 2014",
        "year": 2014,
        "mileage": "97000 KM",
        "gear": "Automatic",
        "color": "BLUE",
        "price_jpy": "¥270,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/9964-20260515134118-390581.jpg"
    },
    {
        "title": "HONDA FIT 2012",
        "year": 2012,
        "mileage": "97000 KM",
        "gear": "Automatic",
        "color": "BLUE",
        "price_jpy": "¥296,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/9959-20260515125916-048587.jpg"
    },
    {
        "title": "TOYOTA VITZ 2014",
        "year": 2014,
        "mileage": "115000 KM",
        "gear": "Automatic",
        "color": "WHITE",
        "price_jpy": "¥400,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/9946-20260516083356-087558.jpg"
    },
    {
        "title": "VOLKSWAGEN GOLF GTI 2015",
        "year": 2015,
        "mileage": "86000 KM",
        "gear": "Automatic",
        "color": "SILVER",
        "price_jpy": "¥1,475,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/9902-20260513104814-357995.jpg"
    },
    {
        "title": "NISSAN NOTE 2015",
        "year": 2015,
        "mileage": "84000 KM",
        "gear": "Automatic",
        "color": "SILVER",
        "price_jpy": "¥310,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/9900-20260513164603-562185.jpg"
    },
    {
        "title": "TOYOTA PRIUS 2017",
        "year": 2017,
        "mileage": "146000 KM",
        "gear": "Automatic",
        "color": "SILVER",
        "price_jpy": "¥811,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/9890-20260513145004-815226.jpg"
    },
    {
        "title": "AUDI Q3 4WD 2015",
        "year": 2015,
        "mileage": "75000 KM",
        "gear": "Automatic",
        "color": "WHITE",
        "price_jpy": "¥785,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/9875-20260512171104-743874.jpg"
    },
    {
        "title": "AUDI Q5 2014",
        "year": 2014,
        "mileage": "97000 KM",
        "gear": "Automatic",
        "color": "SILVER",
        "price_jpy": "¥649,000",
        "image_url": "https://app.nobukojapan.com/assets/gallery/9861-20260512132237-345548.jpg"
    }
];

const JPY_TO_USD = 158.91;

async function main() {
    console.log("Cleaning existing vehicles...");
    await prisma.vehicle.deleteMany();

    console.log("Seeding Nobuko Japan data...");

    for (const item of NOBUKO_DATA) {
        const titleParts = item.title.split(" ");
        const make = titleParts[0];
        const year = item.year;
        const model = titleParts.slice(1, titleParts.length - 1).join(" ");

        // Clean price
        const jpyValue = parseInt(item.price_jpy.replace(/¥|,/g, ""), 10);
        const usdPrice = Math.round(jpyValue / JPY_TO_USD);

        // Clean mileage
        const mileage = parseInt(item.mileage.replace(/ KM|,/g, ""), 10);

        const stockId = `DVM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        await prisma.vehicle.create({
            data: {
                stockId,
                make,
                model,
                year,
                price: usdPrice,
                priceCif: usdPrice + 1500, // Approximate shipping
                currency: "USD",
                mileage,
                fuelType: "Petrol", // Default
                transmission: item.gear,
                color: item.color,
                location: "Japan",
                condition: "Used",
                images: JSON.stringify([item.image_url]),
                description: `${item.title} from Nobuko Japan inventory. Fully inspected and ready for export.`,
                features: JSON.stringify(["Automatic", item.color, "Japan Export"]),
                status: "available",
                featured: Math.random() > 0.7,
            }
        });

        console.log(`Added: ${item.title} - $${usdPrice}`);
    }

    console.log("Seeding complete! 🚀");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
