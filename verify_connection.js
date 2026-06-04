const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function check() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        console.log('SUCCESS: Connected to VPS');
        const result = await ssh.execCommand('ls -lh /var/www/deploy_dvm.tar.gz');
        console.log('TARBALL INFO: ' + result.stdout);

        // Check if dvmjapan directory exists
        const checkDir = await ssh.execCommand('ls -d /var/www/dvmjapan');
        if (checkDir.code === 0) {
            console.log('Directory /var/www/dvmjapan exists');
        } else {
            console.log('Directory /var/www/dvmjapan does NOT exist');
        }

        process.exit(0);
    } catch (err) {
        console.error('ERROR: Failed to connect', err);
        process.exit(1);
    }
}

check();
