'use strict'

const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = require('./webpack.common.js')

const config = merge(common, {
  devServer: {
    host: '0.0.0.0'
  },
  entry: './src/demo2',
  devtool: 'eval-source-map',
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
              sourceMap: true,
            }
          }
        ]
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
})

module.exports = config