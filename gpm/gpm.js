#!/usr/bin/env node

import process from 'process';
import https from 'https';
import path from 'path';
import fs from 'fs';

const { writeFile } = fs.promises;

const config = 'gpmc.js';
const origin = 'https://raw.githubusercontent.com/';

const get = function (url) {
    return new Promise((resolve, reject) => {
        https.get(url, context => {
            const result = {};
            result.body = '';
            result.code = context.statusCode;
            context.setEncoding('utf8');
            context.on('error', reject);
            context.on('data', data => result.body += data);
            context.on('end', () => resolve(result));
        }).on('error', reject);
    });
};

const install = async function () {
    const configPath = path.resolve(config);
    const modules = (await import(configPath)).default;

    for (let [ from, to ] of modules) {
        to = path.normalize(to);
        from = path.normalize(from);

        const parts = from.split('/');

        parts.splice(-1, 0, 'master');

        const { code, body } = await get(`${origin}${parts.join('/')}`);

        await writeFile(`${to}/${parts[parts.length-1]}`, body);

    }
};

const help = async function () {
    console.log(`
    Commands:
        install
    `);
};

console.log('Git Package Manager');

const [,, command ] = process.argv;

switch (command) {
   case 'help': help().catch(console.error); break;
   case 'install': install().catch(console.error); break;
}
