const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

const VPS_HOST = '187.77.152.99';
const VPS_USER = 'root';
const VPS_PASS = 'Honstinger.Pakistan@1245';
const REMOTE_DIR = '/var/www/dvmjapan';

// Files & folders that have changed since last deploy
const CHANGED_FILES = [
    // Core changed source files
    { local: 'components/vehicles/VehicleDetailPage.tsx', remote: `${REMOTE_DIR}/components/vehicles/VehicleDetailPage.tsx` },
    { local: 'components/vehicles/VehicleCard.tsx', remote: `${REMOTE_DIR}/components/vehicles/VehicleCard.tsx` },
    { local: 'components/vehicles/CompareBar.tsx', remote: `${REMOTE_DIR}/components/vehicles/CompareBar.tsx` },
    { local: 'components/vehicles/ShippingCalculator.tsx', remote: `${REMOTE_DIR}/components/vehicles/ShippingCalculator.tsx` },
    { local: 'components/layout/FloatingWidgets.tsx', remote: `${REMOTE_DIR}/components/layout/FloatingWidgets.tsx` },
    { local: 'components/layout/Footer.tsx', remote: `${REMOTE_DIR}/components/layout/Footer.tsx` },
    { local: 'components/home/VisualGallerySection.tsx', remote: `${REMOTE_DIR}/components/home/VisualGallerySection.tsx` },
    { local: 'context/CompareContext.tsx', remote: `${REMOTE_DIR}/context/CompareContext.tsx` },
    { local: 'context/CurrencyContext.tsx', remote: `${REMOTE_DIR}/context/CurrencyContext.tsx` },
    { local: 'config/navigation.ts', remote: `${REMOTE_DIR}/config/navigation.ts` },
    { local: 'config/routes.ts', remote: `${REMOTE_DIR}/config/routes.ts` },
    { local: 'app/compare/page.tsx', remote: `${REMOTE_DIR}/app/compare/page.tsx` },
    { local: 'app/track-vehicle/page.tsx', remote: `${REMOTE_DIR}/app/track-vehicle/page.tsx` },
    { local: 'app/layout.tsx', remote: `${REMOTE_DIR}/app/layout.tsx` },
    { local: 'app/about/gallery/page.tsx', remote: `${REMOTE_DIR}/app/about/gallery/page.tsx` },
    { local: '.env', remote: `${REMOTE_DIR}/.env` },
    { local: '.env', remote: `${REMOTE_DIR}/.env.local` },
    { local: 'scripts/scrape-mdk-full.ts', remote: `${REMOTE_DIR}/scripts/scrape-mdk-full.ts` },
    { local: 'scripts/clean-images.ts', remote: `${REMOTE_DIR}/scripts/clean-images.ts` },
];

async function hotDeploy() {
    console.log('='.repeat(60));
    console.log('  DVM JAPAN - HOT DEPLOY (Changed Files Only)');
    console.log('='.repeat(60));

    console.log('\n[1/4] Connecting to VPS...');
    await ssh.connect({ host: VPS_HOST, username: VPS_USER, password: VPS_PASS });
    console.log('✓ Connected to', VPS_HOST);

    // Ensure compare app directory exists on remote
    console.log('\n[2/4] Ensuring remote directories exist...');
    await ssh.execCommand(`mkdir -p ${REMOTE_DIR}/app/compare`);
    await ssh.execCommand(`mkdir -p ${REMOTE_DIR}/app/track-vehicle`);
    console.log('✓ Directories ready');

    console.log('\n[3/4] Uploading changed files...');
    let uploaded = 0;
    for (const file of CHANGED_FILES) {
        if (!fs.existsSync(file.local)) {
            console.log(`  ⚠ Skipping (not found locally): ${file.local}`);
            continue;
        }
        try {
            await ssh.putFile(file.local, file.remote);
            console.log(`  ✓ ${file.local}`);
            uploaded++;
        } catch (err) {
            console.error(`  ✗ Failed: ${file.local} → ${err.message}`);
        }
    }
    console.log(`✓ Uploaded ${uploaded}/${CHANGED_FILES.length} files`);

    console.log('\n[4/4] Rebuilding & restarting on VPS...');

    // Run the clean-images script to fix existing data
    console.log('  → Cleaning images in DB...');
    const clean = await ssh.execCommand('npx ts-node scripts/clean-images.ts', { cwd: REMOTE_DIR });
    console.log('  ', clean.stdout.slice(-100) || clean.stderr.slice(-100));

    // Rebuild Next.js
    console.log('  → Building Next.js (please wait 3-5 min)...');
    const build = await ssh.execCommand('npm run build', { cwd: REMOTE_DIR });
    if (build.code !== 0) {
        console.error('  ✗ BUILD FAILED:\n', (build.stderr || build.stdout).slice(-500));
        ssh.dispose();
        process.exit(1);
    }
    console.log('  ✓ Build complete');

    // Restart PM2
    console.log('  → Restarting PM2...');
    const restart = await ssh.execCommand(
        'pm2 describe dvmjapan > /dev/null 2>&1 && pm2 restart dvmjapan || pm2 start "npm start" --name dvmjapan',
        { cwd: REMOTE_DIR }
    );
    console.log('  ', restart.stdout || 'PM2 restarted');
    await ssh.execCommand('pm2 save');

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ HOT DEPLOY COMPLETE!');
    console.log(`  🌐 Website: http://${VPS_HOST}`);
    console.log(`  🔐 Admin: http://${VPS_HOST}/admin`);
    console.log('='.repeat(60));

    ssh.dispose();
    process.exit(0);
}

hotDeploy().catch(err => {
    console.error('\n✗ DEPLOYMENT FAILED:', err.message || err);
    ssh.dispose();
    process.exit(1);
});
