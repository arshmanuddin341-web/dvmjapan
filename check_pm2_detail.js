const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkPM2Detail() {
    try {
        await ssh.connect({ host: '187.77.152.99', username: 'root', password: 'Honstinger.Pakistan@1245' });
        const result = await ssh.execCommand('pm2 jlist');
        const apps = JSON.parse(result.stdout);
        apps.forEach(app => {
            console.log(`ID: ${app.pm2_env.pm_id}, Name: ${app.name}, Port: ${app.pm2_env.PORT || 'N/A'}, Status: ${app.pm_stat.status}`);
        });
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

checkPM2Detail();
