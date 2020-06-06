const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  pwa: {
    iconPaths: {
      favicon32: "img/icons/favicon.ico"
    }
  },
  configureWebpack: {
    plugins: [new BundleAnalyzerPlugin()]
  }
};
