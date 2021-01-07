const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;

const DumpVueEnvVarsWebpackPlugin = require("./vue-config/DumpVueEnvVarsWebpackPlugin.js");

module.exports = {
  pwa: {
    iconPaths: {
      favicon32: "img/icons/favicon.ico"
    }
  },
  configureWebpack: {
    plugins: [new DumpVueEnvVarsWebpackPlugin({ filename: "env-vars.js" })]
  }
};

if (process.env.NODE_ENV === "development") {
  module.exports.configureWebpack.plugins.push(new BundleAnalyzerPlugin());
}
