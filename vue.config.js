const RemarkHTML = require('remark-html');
const {GenerateSW} = require('workbox-webpack-plugin');

module.exports = {
  chainWebpack: config => {
    config.module.rule('markdown').test(/\.md$/)
      .use('html-loader').loader('html-loader').end()
      .use('remark-loader').loader('remark-loader').options({ remarkOptions: { plugins: [RemarkHTML] } }).end()
  },
  configureWebpack: {
    plugins: [
      new GenerateSW()
    ]
  }
}
