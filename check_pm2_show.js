const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkPM2Show() {
    try {
        await ssh.connect({ host: '187.77.152.99', username: 'root', password: 'Honstinger.Pakistan@1245' });
        const appNames = ['dvmjapan', 'thezoja', 'tradewaregroup'];
        for (const name of appNames) {
            console.log(`--- PM2 SHOW ${name} ---`);
            const result = await ssh.execCommand(`pm2 show ${name}`);
            console.log(result.stdout);
        }
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

checkPM2Show();
