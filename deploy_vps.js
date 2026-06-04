const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const path = require('path');
const fs = require('fs');

const VPS_HOST = '187.77.152.99';
const VPS_USER = 'root';
const VPS_PASS = 'Honstinger.Pakistan@1245';
const REMOTE_DIR = '/var/www/dvmjapan';

async function deploy() {
    console.log('='.repeat(60));
    console.log('  DVM JAPAN - VPS DEPLOYMENT');
    console.log('='.repeat(60));

    // Step 1: Connect to VPS
    console.log('\n[1/7] Connecting to VPS...');
    await ssh.connect({ host: VPS_HOST, username: VPS_USER, password: VPS_PASS });
    console.log('✓ Connected to', VPS_HOST);

    // Step 2: Check if tar file exists
    console.log('\n[2/7] Checking local build archive...');
    if (!fs.existsSync('deploy_dvm.tar.gz')) {
        console.error('✗ deploy_dvm.tar.gz not found! Please run: tar -czf deploy_dvm.tar.gz ... first');
        process.exit(1);
    }
    console.log('✓ Archive found: deploy_dvm.tar.gz');

    // Step 3: Upload archive + env files
    console.log('\n[3/7] Uploading files to VPS (this may take a few minutes)...');
    await ssh.putFile('deploy_dvm.tar.gz', '/var/www/deploy_dvm.tar.gz');
    await ssh.putFile('.env', '/var/www/dvmjapan_new_env');
    console.log('✓ Upload complete');

    // Step 4: Backup old + extract new
    console.log('\n[4/7] Backing up old deployment & extracting new...');
    const timestamp = Date.now();
    const backupDir = `/var/www/dvmjapan_old_${timestamp}`;

    await ssh.execCommand(`cp ${REMOTE_DIR}/.env /var/www/dvmjapan_env_backup_${timestamp}`).catch(() => { });
    await ssh.execCommand(`mv ${REMOTE_DIR} ${backupDir}`).catch(() => { });
    await ssh.execCommand(`mkdir -p ${REMOTE_DIR}`);
    await ssh.execCommand(`tar -xzf /var/www/deploy_dvm.tar.gz -C ${REMOTE_DIR}`);

    // Handle nested folder (in case tar wraps in a subfolder)
    const checkRoot = await ssh.execCommand(`ls ${REMOTE_DIR}/package.json`);
    if (checkRoot.code !== 0) {
        console.log('  Detected nested folder, fixing...');
        const findSub = await ssh.execCommand(`ls -d ${REMOTE_DIR}/*/`).catch(() => ({ stdout: '' }));
        if (findSub.stdout.trim()) {
            const subPath = findSub.stdout.trim().split('\n')[0].trim();
            await ssh.execCommand(`mv ${subPath}* ${REMOTE_DIR}/`).catch(() => { });
            await ssh.execCommand(`mv ${subPath}.* ${REMOTE_DIR}/`).catch(() => { });
        }
    }

    // Copy env files
    await ssh.execCommand(`cp /var/www/dvmjapan_new_env ${REMOTE_DIR}/.env`);
    await ssh.execCommand(`cp ${REMOTE_DIR}/.env ${REMOTE_DIR}/.env.local`);
    console.log('✓ Files extracted & env configured');

    // Step 5: Install dependencies
    console.log('\n[5/7] Installing dependencies on VPS...');
    const install = await ssh.execCommand('npm install --production=false', { cwd: REMOTE_DIR });
    if (install.code !== 0) {
        console.error('✗ npm install failed:\n', install.stderr);
        process.exit(1);
    }

    // Generate Prisma client
    const prismaGen = await ssh.execCommand('npx prisma generate', { cwd: REMOTE_DIR });
    if (prismaGen.code !== 0) {
        console.error('✗ Prisma generate failed:\n', prismaGen.stderr);
        process.exit(1);
    }
    console.log('✓ Dependencies installed & Prisma client generated');

    // Step 6: Build Next.js
    console.log('\n[6/7] Building Next.js app (this takes 2-5 minutes)...');
    const build = await ssh.execCommand('npm run build', { cwd: REMOTE_DIR });
    if (build.code !== 0) {
        console.error('✗ BUILD FAILED!');
        console.error(build.stderr || build.stdout);
        process.exit(1);
    }
    console.log('✓ Build successful');

    // Step 7: Fix admin + Restart PM2
    console.log('\n[7/7] Ensuring admin user & restarting PM2...');
    await ssh.execCommand('npx tsx scripts/fix-admin.ts', { cwd: REMOTE_DIR }).catch(() => { });

    // Restart frontend
    const pm2Front = await ssh.execCommand(
        'pm2 describe dvmjapan > /dev/null 2>&1 && pm2 restart dvmjapan || pm2 start "npm start" --name dvmjapan',
        { cwd: REMOTE_DIR }
    );
    console.log('  Frontend PM2:', pm2Front.stdout || pm2Front.stderr || 'started');

    // Save PM2 list
    await ssh.execCommand('pm2 save');

    // Cleanup old tar on server
    await ssh.execCommand('rm -f /var/www/deploy_dvm.tar.gz');

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ DEPLOYMENT COMPLETE!');
    console.log('  🌐 Website: http://' + VPS_HOST);
    console.log('  🔐 Admin Panel: http://' + VPS_HOST + '/admin');
    console.log('='.repeat(60));

    ssh.dispose();
    process.exit(0);
}

deploy().catch(err => {
    console.error('\n✗ DEPLOYMENT FAILED:', err.message || err);
    ssh.dispose();
    process.exit(1);
});
