const { NodeSSH } = require('node-ssh');
const ssh = new NodeSSH();

async function run() {
    try {
        await ssh.connect({
            host: '187.77.152.99',
            username: 'root',
            password: 'Honstinger.Pakistan@1245'
        });
        console.log('Connected.');

        console.log('Running scrape...');
        const result = await ssh.execCommand('export SCRAPE_LIMIT=100 && npx tsx scripts/scrape-mdk-full.ts', {
            cwd: '/var/www/dvmjapan',
            onStdout(chunk) {
                process.stdout.write(chunk.toString());
            },
            onStderr(chunk) {
                process.stderr.write(chunk.toString());
            }
        });

        console.log('\nFinished with code:', result.code);
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

run();
