const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkPM2() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        const result = await ssh.execCommand('pm2 status');
        console.log(result.stdout);
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

checkPM2();
