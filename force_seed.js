const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function forceSeed() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        console.log('CONNECTED');

        console.log('Modifying seed.ts to remove guard...');
        await ssh.execCommand("sed -i 's/if (vehicleCount === 0) {/if (true) {/g' prisma/seed.ts", { cwd: '/var/www/dvmjapan' });

        console.log('Running Prisma Seed...');
        const res = await ssh.execCommand('npx tsx prisma/seed.ts', { cwd: '/var/www/dvmjapan' });
        console.log('PRISMA STDOUT:', res.stdout);

        console.log('Restoring seed.ts...');
        await ssh.execCommand("sed -i 's/if (true) {/if (vehicleCount === 0) {/g' prisma/seed.ts", { cwd: '/var/www/dvmjapan' });

        ssh.dispose();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

forceSeed();
