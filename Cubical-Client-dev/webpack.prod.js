const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].[contenthash].js",
    clean: true
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "public", globOptions: { ignore: ["**/index.html"] } }]
    })
  ]
});
