'use strict'

const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const {resolve} = require('path')

const config = {
    mode: 'production',
    entry: './demo/index.js',
    output: {
        filename: '[hash].js',
        path: resolve(__dirname, 'build/demo'),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
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
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin(),
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['build/demo']),
        new MiniCssExtractPlugin({
            filename: '[hash].css',
        }),
        new MinifyPlugin({}, {comments: false}),
        new HtmlWebpackPlugin({
            template: 'demo/index.html',
            minify: {
                collapseBooleanAttributes: true,
                collapseInlineTagWhitespace: true,
                collapseWhitespace: true,
                decodeEntities: true,
                removeAttributeQuotes: true,
                removeComments: true,
            },
        }),
    ],
}

module.exports = config