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
    plugins: [
      new BundleAnalyzerPlugin(),
      new DumpVueEnvVarsWebpackPlugin({ filename: "env-vars.js" })
    ]
  }
};
