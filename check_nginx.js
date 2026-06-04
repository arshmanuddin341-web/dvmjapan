const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function checkNginx() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        const result = await ssh.execCommand('ls /etc/nginx/sites-enabled');
        console.log('Sites Enabled:\n' + result.stdout);

        // Read dvmjapan config if it exists
        const dvmConfig = await ssh.execCommand('cat /etc/nginx/sites-enabled/dvmjapan.com');
        if (dvmConfig.code === 0) {
            console.log('\ndvmjapan.com Nginx Config:\n' + dvmConfig.stdout);
        } else {
            const defaultDvm = await ssh.execCommand('cat /etc/nginx/sites-enabled/dvmjapan');
            if (defaultDvm.code === 0) {
                console.log('\ndvmjapan Nginx Config:\n' + defaultDvm.stdout);
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

checkNginx();
