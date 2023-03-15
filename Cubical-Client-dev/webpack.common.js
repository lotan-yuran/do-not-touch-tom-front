const path = require("path");
const DotenvWebpackPlugin = require("dotenv-webpack");
const TerserPlugin = require("terser-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MAX_CACHE_SIZE = 20 * 1024 * 1024;

module.exports = {
  entry: ["react-hot-loader/patch", path.join(__dirname, "src", "index.js")],
  resolve: {
    alias: {
      "@Config": path.resolve(__dirname, "src/config/"),
      "@Constants": path.resolve(__dirname, "src/constants/"),
      "@Context": path.resolve(__dirname, "src/context/"),
      "@Hooks": path.resolve(__dirname, "src/hooks/"),
      "@Icons": path.resolve(__dirname, "src/icons/"),
      "@Pages": path.resolve(__dirname, "src/pages"),
      "@Services": path.resolve(__dirname, "src/services/"),
      "@Stories": path.resolve(__dirname, "src/stories/"),
      "@Styles": path.resolve(__dirname, "src/styles/"),
      "@Utilities": path.resolve(__dirname, "src/utilities/")
    },
    extensions: ["", ".json", ".js", ".jsx", ".wasm"]
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    new DotenvWebpackPlugin({ systemvars: true }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      inject: "head"
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      maximumFileSizeToCacheInBytes: MAX_CACHE_SIZE
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    // The minimums target versions
                    node: "12"
                  }
                }
              ],
              ["@babel/preset-react", { runtime: "automatic" }]
            ]
          }
        }
      },
      { test: /\.s[ac]ss$/i, use: ["style-loader", "css-loader", "sass-loader"] },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: ["file-loader"]
      }
    ]
  }
};
