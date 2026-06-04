const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function uploadAndRun() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        console.log('CONNECTED');

        console.log('Uploading clean_readd_mitsubishi.js...');
        await ssh.putFile('c:\\Users\\Administrator\\Desktop\\DVMJapan\\clean_readd_mitsubishi.js', '/var/www/dvmjapan/clean_readd_mitsubishi.js');

        console.log('Running script...');
        const res = await ssh.execCommand('node clean_readd_mitsubishi.js', { cwd: '/var/www/dvmjapan' });
        console.log('STDOUT:', res.stdout);
        console.log('STDERR:', res.stderr);

        ssh.dispose();
    } catch (err) {
        console.error('ERROR:', err);
    }
}

uploadAndRun();
