'use strict';

const fs = require('fs');

const nodeVersion = fs.readFileSync('./.nvmrc', { encoding: 'utf-8' }).trim();

module.exports = {
    presets: [
        ['@babel/preset-env', { targets: { node: nodeVersion } }],
        '@babel/preset-typescript',
    ],
};
