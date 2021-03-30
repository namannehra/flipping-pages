'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const packageJson = require('./package.json')
delete packageJson.private
delete packageJson.scripts
delete packageJson.devDependencies

const externals = {}

for (const name of Object.keys(Object.assign({}, packageJson.dependencies, packageJson.peerDependencies))) {
    externals[name] = name
}

const config = {
    mode: 'production',
    entry: './src/FlippingPages.js',
    output: {
        filename: 'FlippingPages.js',
        path: path.resolve(__dirname, 'build/flipping-pages'),
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.sass$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                indentWidth: 4,
                            },
                        },
                    },
                ],
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    externals,
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin(),
            new TerserPlugin(),
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['build/flipping-pages']),
        new MiniCssExtractPlugin({
            filename: 'FlippingPages.css',
        }),
        new GenerateJsonPlugin('package.json', packageJson, undefined, 4),
        new CopyWebpackPlugin({
            patterns: [
                'LICENSE',
                'README.md',
            ],
        }),
    ],
}

module.exports = config
