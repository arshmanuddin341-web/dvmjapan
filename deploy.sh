#!/bin/bash
mv -f /var/www/tradeware/temp_route.ts /var/www/tradeware/app/api/vehicles/\[id\]/route.ts
cd /var/www/tradeware
npm run build
pm2 restart tradeware-web
pm2 restart tradeware-api
