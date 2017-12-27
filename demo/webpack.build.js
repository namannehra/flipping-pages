'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./webpack.common.js')

const config = merge(common, {
  entry: {
    demo1: './src/demo1',
    demo2: './src/demo2',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            options: {
              insertAt: 'top',
              sourceMap: true,
            }
          }, {
            loader: 'css-loader',
            options: {
              minimize: true,              
              modules: true,
              sourceMap: true,
            }
          }
        ]
      }, {
        test: /\.css$/,
        exclude: [/node_modules/, /\.module\.css$/],
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            }
          }, {
            loader: 'css-loader',
            options: {
              minimize: true,
              sourceMap: true,
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common'
    }),
    new UglifyJsPlugin({
      sourceMap: true
    }),
    new HtmlWebpackPlugin({
      chunks: ['common', 'demo1'],
      template: 'src/index.html',
      filename: 'demo1.html',
    }),
    new HtmlWebpackPlugin({
      chunks: ['common', 'demo2'],
      template: 'src/index.html',
      filename: 'demo2.html',
    }),
  ],
})

module.exports = config