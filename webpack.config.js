const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Cardano-Web3.js',
      template: './test/ui.ejs',
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Cardano-Web3.js',
    libraryTarget: 'umd',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
  },
  resolve: {
    modules: ['node_modules'],
  }
  // module: {
  //   rules: [
  //     {
  //       test: /\.m?js$/,
  //       use: {
  //         loader: 'babel-loader',
  //         options: {
  //           presets: [
  //             [
  //               '@babel/preset-env',
  //               {
  //                 useBuiltIns: 'entry',
  //                 corejs: 3,
  //                 targets: {
  //                   ie: 10,
  //                 },
  //               },
  //             ],
  //           ],
  //           plugins: [
  //             '@babel/plugin-transform-runtime',
  //             '@babel/plugin-transform-modules-commonjs',
  //           ],
  //         },
  //       },
  //     },
  //   ],
  // },
}
