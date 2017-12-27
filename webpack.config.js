'use strict'

const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = {
  entry: './src/flipping-pages',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'flipping-pages.js',
    library: 'flipping-pages',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  externals: [/node_modules/],
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-react', 'babel-preset-env'].map(require.resolve),
            plugins: [
              ['babel-plugin-transform-object-rest-spread'],
              ['babel-plugin-react-css-modules', {
                generateScopedName: '[hash:base64]'
              }]
            ].map(plugin => {
              plugin[0] = require.resolve(plugin[0])
              return plugin
            })
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CleanWebpackPlugin(['build']),
    new UglifyJsPlugin({
      sourceMap: true
    }),
  ]
}

module.exports = config