import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function reset() {
    const email = "admin@dvmjapan.com";
    const password = "admin123";
    const hash = hashSync(password, 12);

    console.log(`Setting up admin: ${email}...`);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            passwordHash: hash,
            role: "admin",
            status: "active"
        },
        create: {
            email,
            name: "Admin",
            passwordHash: hash,
            role: "admin",
            status: "active"
        }
    });

    console.log("Admin setup complete!");
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${password}`);
}

reset()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
