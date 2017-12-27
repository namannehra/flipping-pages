'use strict'

const path = require('path')

const config = {
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '../src')]
  },
  module: {
    rules: [
      {
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
      }, {
        test: /\.svg$/,
        use: {
          loader:'file-loader',
        }
      },
    ]
  },
}

module.exports = config