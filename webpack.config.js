const path = require("path"),
  HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');

const html = ["index", "details"];

module.exports = {
  mode: 'none',
  entry: html.reduce((config, page) => {
    config[page] = `./src/${page}.js`;
    return config;
  }, {}),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new Dotenv(),
  ].concat(
    html.map(
      (page) =>
        new HtmlWebpackPlugin({
          inject: true,
          template: `./${page}.html`,
          filename: `${page}.html`,
          favicon: './assets/favicon.ico',
          chunks: [page],
        })
    )
  ),
};