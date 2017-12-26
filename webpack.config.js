'use strict'

const path = require('path')

const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = {
  entry: './src/flipping-pages.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'flipping-pages.js',
    library: 'flipping-pages',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  externals: [
    'react',
    'prop-types',
  ],
  module: {
    rules: [
      {
        test: /\.module\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
            options: {}
          }, {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              minimize: true,              
              modules: true,
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
    new UglifyJsPlugin({
      exclude: /node_modules/,
      parallel: 4,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
  ]
}

module.exports = config