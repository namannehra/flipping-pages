'use strict'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const {resolve} = require('path')

const config = {
    mode: 'development',
    entry: './demo/index.js',
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[local]-[hash:base64:4]',
                        },
                    },
                ],
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            }, {
                test: /\.svg$/,
                use: 'url-loader',
            },
        ],
    },
    resolve: {
        alias: {
            'flipping-pages': resolve(__dirname, './src/FlippingPages'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({template: 'demo/index.html'}),
    ],
}

module.exports = config