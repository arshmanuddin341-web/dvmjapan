const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function uploadScripts() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        console.log('CONNECTED');

        console.log('Uploading scripts folder...');
        await ssh.putDirectory('c:\\Users\\Administrator\\Desktop\\DVMJapan\\scripts', '/var/www/dvmjapan/scripts', {
            recursive: true
        });
        console.log('Scripts uploaded.');

        console.log('Running Nobuko Seed...');
        const res = await ssh.execCommand('npx tsx scripts/seed-nobuko.ts', { cwd: '/var/www/dvmjapan' });
        console.log('STDOUT:', res.stdout);
        console.log('STDERR:', res.stderr);

        ssh.dispose();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

uploadScripts();
