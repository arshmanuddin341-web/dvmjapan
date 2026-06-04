const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkUnzip() {
    try {
        await ssh.connect({ host: '187.77.152.99', username: 'root', password: 'Honstinger.Pakistan@1245' });
        const result = await ssh.execCommand('unzip -v');
        if (result.code === 0) {
            console.log('unzip is installed');
        } else {
            console.log('unzip is NOT installed. Installing...');
            await ssh.execCommand('apt-get update && apt-get install -y unzip');
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

checkUnzip();
