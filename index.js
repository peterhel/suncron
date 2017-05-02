const generateCron = require('./generateCron.js');
const spawn = require('child_process').spawn;
const readline = require('readline');

async function writeCron(content) {
    return await new Promise((resolve, reject) => {
        const cron = spawn('crontab', ['-u', process.env.USER, '-']);
        cron.stdin.write(content, 'utf8');
        cron.stdin.end();

        cron.stderr.pipe(process.stderr);

        resolve();
    });
}

async function readCron(exclution) {
    return await new Promise((resolve, reject) => {
        const lines = [];
        const cron = spawn('crontab', ['-l']);
        const rl = readline.createInterface({
            input: cron.stdout
        });
        rl.on('line', line => {
            if (/^\s*$/.test(line)) {
                return;
            }

            if (/^#/.test(line)) {
                return;
            }

            if (new RegExp(`${exclution}\\s*$`).test(line)) {
                return;
            }

            lines.push(line);
        });

        rl.on('close', () => {
            resolve(lines);
        });
    });
}

(async () => {
    const command = process.argv[2];

    if(!command) {
        console.error('No command given.');
        process.exit(1);
    }

    const cronData = await generateCron(command);

    const oldCron = await readCron(command);

    for (let i = 0; i < cronData.length; i++) {
        oldCron.push(cronData[i]);
    }

    oldCron.push('\n');

    await writeCron(oldCron.join('\n'));
})();