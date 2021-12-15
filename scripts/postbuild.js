const { copyFileSync, existsSync, writeFileSync } = require('fs');
const { join, resolve } = require('path');
const pkg = require('../package.json');

const rootPath = resolve(__dirname, '../');
const distPath = resolve(__dirname, '../dist');

writeFileSync(join(distPath, 'package.json'), JSON.stringify({
    ...pkg,
    private: false
}, null, 4));
copyFileSync(join(rootPath, 'README.md'), join(distPath, 'README.md'));
if (existsSync(join(rootPath, '.npmrc'))) copyFileSync(join(rootPath, '.npmrc'), join(distPath, '.npmrc'));
