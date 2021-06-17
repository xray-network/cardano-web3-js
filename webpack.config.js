const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  mode: 'production',
  plugins: [
    new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      title: 'Cardano-Web3.js',
      template: './test/ui.ejs',
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: '[file].map',
    // }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.ContextReplacementPlugin(/@emurgo\/cardano-serialization-lib-browser/),
  ],
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Cardano-Web3.js',
    libraryTarget: 'umd',
  },
  performance: {
    hints: false,
    maxEntrypointSize: 1024000,
    maxAssetSize: 1024000,
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  resolve: {
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'webassembly/sync',
      },
    ],
  },
  experiments: {
    syncWebAssembly: true,
  },
}
