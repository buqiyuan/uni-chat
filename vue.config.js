const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()

const resolve = (dir) => require('path').join(__dirname, dir)

const isProd = process.env.NODE_ENV == 'production'

module.exports = {
  publicPath: isProd ? '/uni-chat/' : '',
  productionSourceMap: false, // 生产打包时不输出map文件，增加打包速度
  css: {
    // requireModuleExtension: true, // 是否开启CSSmodule并保留xxx.module.css后缀
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
      scss: {
        additionalData: `@import "~@/styles/func.scss";
                  @import "~@/styles/vars.scss";`,
      },
    },
  },
  chainWebpack: (config) => {
    // 配置相关loader，支持修改，添加和替换相关的loader
    config.resolve.alias.set('@', resolve('src'))
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
    }
    config.plugins.push(
      new webpack.DefinePlugin({
        ROUTES: webpack.DefinePlugin.runtimeValue(() => {
          const tfPages = new TransformPages({
            includes: ['path', 'name', 'aliasPath'],
          })
          return JSON.stringify(tfPages.routes)
        }, true),
      })
    )
  },
}
