const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        console.log('✓ Connected to VPS with Password');

        const nginxConfig = `server {
    listen 80;
    server_name dvmjapan.com www.dvmjapan.com 187.77.152.99;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`;

        // Update nginx config and restart
        await ssh.execCommand(`echo '${nginxConfig}' > /etc/nginx/sites-available/dvmjapan`);
        await ssh.execCommand('ln -sf /etc/nginx/sites-available/dvmjapan /etc/nginx/sites-enabled/dvmjapan');
        await ssh.execCommand('systemctl restart nginx');

        console.log('✓ Nginx Reconfigured to Port 3000 & Restarted');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
}

run();
