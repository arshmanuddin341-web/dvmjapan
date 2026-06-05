const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
let content = fs.readFileSync(envPath, 'utf8');

// Replace IP or localhost with domain
content = content.replace(/NEXT_PUBLIC_APP_URL="http:\/\/.*"/g, 'NEXT_PUBLIC_APP_URL="https://dvmjapan.com"');
content = content.replace(/NEXTAUTH_URL="http:\/\/.*"/g, 'NEXTAUTH_URL="https://dvmjapan.com"');

fs.writeFileSync(envPath, content);
console.log('✓ Updated .env with HTTPS domain.');
