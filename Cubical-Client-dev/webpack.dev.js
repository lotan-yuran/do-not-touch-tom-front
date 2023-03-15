const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "eval",
  cache: true,
  output: {
    publicPath: "/"
  },
  devServer: {
    static: { directory: path.join(__dirname, "public") },
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    client: {
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: ["source-map-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "react-hot-loader/webpack",
          options: {
            cacheDirectory: true,
            plugins: ["react-hot-loader"]
          }
        }
      }
    ]
  }
});
