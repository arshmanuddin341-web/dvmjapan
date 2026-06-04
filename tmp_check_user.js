const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUser() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'adminkarim@gmail.com' }
        });
        if (user) {
            console.log('User found:', user.email);
            console.log('Role:', user.role);
        } else {
            console.log('User NOT found');

            // List some users to see what's there
            const users = await prisma.user.findMany({ take: 5 });
            console.log('Sample users:', users.map(u => u.email));
        }
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkUser();
