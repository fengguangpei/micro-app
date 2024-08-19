const { default: merge } = require('webpack-merge')
const base = require('./webpack.config.base')
const { DefinePlugin } = require('webpack')
module.exports = merge(base, {
  mode: 'development',
  // output: {
  //   publicPath: 'http://localhost:8081/'
  // },
  devServer: {
    port: 8081,
    hot: true,
    open: false,
    historyApiFallback: true,
    static: 'dist',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.scss/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ],
  },
  plugins: [
    new DefinePlugin({
      __VUE_PROD_DEVTOOLS__: true,
      __VUE_OPTIONS_API__: true,
      PRODUCTION: false
    }),
  ]
})
