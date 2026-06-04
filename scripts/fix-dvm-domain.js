const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        console.log('✓ Connected to VPS');

        // This is the CRITICAL fix for DVM Japan. Points to Port 3000.
        const nginxConfig = `server {
    listen 80;
    server_name dvmjapan.com www.dvmjapan.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`;

        // Ensure we ARE using port 3000 for dvmjapan
        await ssh.execCommand(`echo '${nginxConfig}' > /etc/nginx/sites-available/dvmjapan`);

        // Remove ANY existing symbolic links that might be conflicting
        await ssh.execCommand('rm -f /etc/nginx/sites-enabled/dvmjapan');
        await ssh.execCommand('ln -s /etc/nginx/sites-available/dvmjapan /etc/nginx/sites-enabled/dvmjapan');

        // Restart nginx
        await ssh.execCommand('systemctl restart nginx');

        console.log('✓ DVM Japan Nginx FIX applied!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

run();
