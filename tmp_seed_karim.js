const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seedAdmin() {
    try {
        const email = 'adminkarim@gmail.com';
        const name = 'Admin Karim';
        const password = 'admin123'; // Default password
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                role: 'admin',
                status: 'active',
                passwordHash
            },
            create: {
                email,
                name,
                passwordHash,
                role: 'admin',
                status: 'active'
            }
        });

        console.log('✓ Admin user seeded:', user.email);
        console.log('  Password is set to: admin123');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
