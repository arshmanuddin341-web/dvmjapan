const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();
const fs = require('fs');

const VPS_HOST = '187.77.152.99';
const VPS_USER = 'root';
const VPS_PASS = 'Honstinger.Pakistan@1245';
const REMOTE_DIR = '/var/www/dvmjapan';

// All files including lib files that may have been missed
const EXTRA_FILES = [
    { local: 'lib/site-config.ts', remote: `${REMOTE_DIR}/lib/site-config.ts` },
    { local: 'context/SiteConfigContext.tsx', remote: `${REMOTE_DIR}/context/SiteConfigContext.tsx` },
];

async function fixAndRebuild() {
    console.log('='.repeat(60));
    console.log('  DVM JAPAN - FIX & REBUILD');
    console.log('='.repeat(60));

    console.log('\n[1/3] Connecting to VPS...');
    await ssh.connect({ host: VPS_HOST, username: VPS_USER, password: VPS_PASS });
    console.log('✓ Connected');

    console.log('\n[2/3] Uploading missing/updated files...');
    for (const file of EXTRA_FILES) {
        if (!fs.existsSync(file.local)) {
            console.log(`  ⚠ Not found: ${file.local}`);
            continue;
        }
        await ssh.putFile(file.local, file.remote);
        console.log(`  ✓ ${file.local}`);
    }

    // Also upload the SiteConfigContext if it exists
    const siteCtxLocal = 'context/SiteConfigContext.tsx';

    console.log('\n[3/3] Rebuilding Next.js on VPS (3-5 mins)...');
    const build = await ssh.execCommand('npm run build', { cwd: REMOTE_DIR });
    if (build.code !== 0) {
        const errSnippet = (build.stderr || build.stdout || '').split('\n').slice(-30).join('\n');
        console.error('✗ BUILD FAILED:\n', errSnippet);
        ssh.dispose();
        process.exit(1);
    }
    console.log('✓ Build successful!');

    console.log('  → Restarting PM2...');
    const restart = await ssh.execCommand(
        'pm2 describe dvmjapan > /dev/null 2>&1 && pm2 restart dvmjapan || pm2 start "npm start" --name dvmjapan',
        { cwd: REMOTE_DIR }
    );
    await ssh.execCommand('pm2 save');
    console.log('✓ PM2 restarted');

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ DONE!');
    console.log(`  🌐 http://${VPS_HOST}`);
    console.log(`  🔐 http://${VPS_HOST}/admin`);
    console.log('='.repeat(60));

    ssh.dispose();
    process.exit(0);
}

fixAndRebuild().catch(err => {
    console.error('FAILED:', err.message || err);
    ssh.dispose();
    process.exit(1);
});
