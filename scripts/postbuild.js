const { copyFileSync, existsSync } = require('fs');
const { join, resolve } = require('path');

const rootPath = resolve(__dirname, '../');
const distPath = resolve(__dirname, '../dist');

copyFileSync(join(rootPath, 'package.json'), join(distPath, 'package.json'));
copyFileSync(join(rootPath, 'README.md'), join(distPath, 'README.md'));
if (existsSync(join(rootPath, '.npmrc'))) copyFileSync(join(rootPath, '.npmrc'), join(distPath, '.npmrc'));
