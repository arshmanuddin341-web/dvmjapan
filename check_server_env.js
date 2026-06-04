const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkEnv() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        console.log('--- Server Tool Versions ---');
        const nodeVer = await ssh.execCommand('node -v');
        console.log('Node:', nodeVer.stdout || 'Not installed');
        const npmVer = await ssh.execCommand('npm -v');
        console.log('NPM:', npmVer.stdout || 'Not installed');
        const pm2Ver = await ssh.execCommand('pm2 -v');
        console.log('PM2:', pm2Ver.stdout || 'Not installed');
        const nginxVer = await ssh.execCommand('nginx -v');
        console.log('Nginx:', nginxVer.stderr || nginxVer.stdout || 'Not installed');

        console.log('\n--- /var/www/dvmjapan Content ---');
        const content = await ssh.execCommand('ls -la /var/www/dvmjapan');
        console.log(content.stdout);

        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

checkEnv();
