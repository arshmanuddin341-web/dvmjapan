const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function runFullSync() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        console.log('CONNECTED');

        console.log('Uploading data files...');
        await ssh.putFile('c:\\Users\\Administrator\\Desktop\\DVMJapan\\data\\vehicles-extended.ts', '/var/www/dvmjapan/data/vehicles-extended.ts');
        await ssh.putFile('c:\\Users\\Administrator\\Desktop\\DVMJapan\\data\\vehicles.ts', '/var/www/dvmjapan/data/vehicles.ts');
        console.log('Files uploaded.');

        console.log('1. Running Nobuko Seed (Wipes DB first)...');
        const res1 = await ssh.execCommand('npx tsx scripts/seed-nobuko.ts', { cwd: '/var/www/dvmjapan' });
        console.log('NOBUKO STDOUT:', res1.stdout);

        console.log('2. Running Prisma Seed (Adds extended data)...');
        const res2 = await ssh.execCommand('npx tsx prisma/seed.ts', { cwd: '/var/www/dvmjapan' });
        console.log('PRISMA STDOUT:', res2.stdout);

        console.log('3. Running Mitsubishi Seed...');
        const res3 = await ssh.execCommand('npx tsx prisma/add-car-mitsubishi.ts', { cwd: '/var/www/dvmjapan' });
        console.log('MITSUBISHI STDOUT:', res3.stdout);

        ssh.dispose();
        console.log('DONE! Database populated with Nobuko + Local + Mitsubishi data.');
    } catch (err) {
        console.error('ERROR:', err);
    }
}

runFullSync();
