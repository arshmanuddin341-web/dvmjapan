const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

const VPS_HOST = '187.77.152.99';
const VPS_USER = 'root';
const VPS_PASS = 'Honstinger.Pakistan@1245';
const REMOTE_DIR = '/var/www/dvmjapan';

async function forceRestart() {
    await ssh.connect({ host: VPS_HOST, username: VPS_USER, password: VPS_PASS });
    console.log('✓ Connected');

    // Check current PM2 status
    const status = await ssh.execCommand('pm2 list');
    console.log('\n--- PM2 Current Status ---');
    console.log(status.stdout);

    // Check .next build time to confirm new build is there
    const nextCheck = await ssh.execCommand('ls -la /var/www/dvmjapan/.next/ | head -5');
    console.log('\n--- .next folder ---');
    console.log(nextCheck.stdout);

    // Force stop + delete + restart fresh
    console.log('\n--- Force Restarting ---');
    await ssh.execCommand('pm2 delete dvmjapan').catch(() => { });
    await new Promise(r => setTimeout(r, 2000));
    const start = await ssh.execCommand('pm2 start "npm start" --name dvmjapan', { cwd: REMOTE_DIR });
    console.log(start.stdout || start.stderr);

    await ssh.execCommand('pm2 save');
    console.log('✓ PM2 save done');

    // Wait a moment and check logs
    await new Promise(r => setTimeout(r, 3000));
    const logs = await ssh.execCommand('pm2 logs dvmjapan --lines 20 --nostream');
    console.log('\n--- Latest Logs ---');
    console.log(logs.stdout || logs.stderr);

    ssh.dispose();
    process.exit(0);
}

forceRestart().catch(err => {
    console.error('FAILED:', err.message);
    ssh.dispose();
    process.exit(1);
});
