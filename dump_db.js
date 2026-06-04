const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./prisma/dev.db');

db.all("SELECT * FROM Vehicle", [], (err, rows) => {
    if (err) {
        console.error('ERROR:', err);
        return;
    }
    console.log(JSON.stringify(rows, null, 2));
    db.close();
});
