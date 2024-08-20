const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('node:path')
const { VueLoaderPlugin } = require('vue-loader')
const { ModuleFederationPlugin } = require('webpack').container;
// 按需导入
const { default: Components } = require('unplugin-vue-components/webpack')
const { default: AutoImport } = require('unplugin-auto-import/webpack')
const { ElementPlusResolver, TDesignResolver } = require('unplugin-vue-components/resolvers')
const { default: Icons } = require('unplugin-icons/webpack')
const { default: IconsResolver } = require('unplugin-icons/resolver')
const { VxeResolver } = require('@vxecli/import-unplugin-vue-components')
module.exports = {
  entry: path.resolve(__dirname, '../src/main.ts'),
  output: {
    clean: true,
    chunkLoadingGlobal: 'webpackJsonp_micro-app',
    library: 'micro-app',
    libraryTarget: 'umd',
    publicPath: '//localhost:8081/'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src/'),
    },
    extensions: ['.js', '.ts', '.vue', '.scss', '.css', '.d.ts']
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'vue-demi': 'VueDemi',
    pinia: 'Pinia',
    'xe-utils': 'XEUtils',
    'vxe-table': 'VXETable'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true
        }
      },
      {
        test: /\.vue/,
        loader: 'vue-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name].[contenthash:8].[ext]'
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[contenthash:8].[ext]'
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.html'),
    }),
    new VueLoaderPlugin(),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: true
        }),
        IconsResolver({
          enabledCollections: ['ep']
        }),
        VxeResolver({
          libraryName: 'vxe-table',
          importStyle: true
        }),
        TDesignResolver({
          library: 'vue-next'
        })
      ]
    }),
    AutoImport({
      resolvers: [
        ElementPlusResolver(),
        TDesignResolver({
          library: 'vue-next'
        }),
        IconsResolver({
          prefix: 'Icon',
        }),
      ]
    }),
    Icons({
      autoInstall: true
    }),
    new ModuleFederationPlugin({
      name: 'federation_consumer',
      filename: 'remoteEntry.js',
      remotes: {
        federation_provider: 'federation_provider@http://localhost:8080/remoteEntry.js'
      }
    })
  ],
}
