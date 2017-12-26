'use strict'

const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  entry: './src/script.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'flipping-pages.js',
  },
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
              sourceMap: true
            }
          }, {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true
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
              sourceMap: true
            }
          }, {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }, {
        test: /\.svg$/,
        use: 'file-loader'
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
  plugins: [new HtmlWebpackPlugin({
    template: './src/index.html'
  })]
}

module.exports = config