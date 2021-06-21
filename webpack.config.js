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
    new webpack.ContextReplacementPlugin(/@emurgo\/cardano-serialization-lib-browser/),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
  output: {
    webassemblyModuleFilename: "[hash].wasm",
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Cardano-Web3.js',
    libraryTarget: 'umd',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  optimization: {
    chunkIds: 'deterministic',
    minimize: false,
  },
  performance: {
    hints: false,
  },
  resolve: {
    modules: ['node_modules'],
  },
  experiments: {
    asyncWebAssembly: true,
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
