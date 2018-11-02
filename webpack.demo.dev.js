'use strict'

const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const config = {
    mode: 'development',
    entry: './demo/index.js',
    devtool: 'eval-source-map',
    devServer: {
        host: '0.0.0.0',
    },
    module: {
        rules: [
            {
                test: /\.sass$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[local]-[hash:base64:4]',
                        },
                    },
                    'sass-loader',
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
            'flipping-pages': path.resolve(__dirname, './src/FlippingPages'),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({template: 'demo/index.html'}),
    ],
}

module.exports = config