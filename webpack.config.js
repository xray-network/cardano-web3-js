const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  mode: 'production',
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      title: 'cardano-web3.js',
      template: './test/minterr.html',
      minify: false,
    }),
    new webpack.ContextReplacementPlugin(/@emurgo\/cardano-serialization-lib-browser/),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
  output: {
    webassemblyModuleFilename: "[hash].wasm",
    filename: 'cardano-web3.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'cardano-web3.js',
    libraryTarget: 'umd',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  experiments: {
    asyncWebAssembly: true,
  },
  optimization: {
    chunkIds: "deterministic",
    minimize: false,
  },
  performance: {
    hints: false,
  },
  resolve: {
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'webassembly/async',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "entry",
                  corejs: 3,
                  targets: {
                    ie: 10,
                  },
                },
              ],
            ],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-transform-modules-commonjs",
            ],
          },
        },
      },
    ],
  },
}
