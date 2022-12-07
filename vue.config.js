const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/css/theme.scss";`
      }
    }
  },
  devServer: {
    host: 'localhost',
    port: 8080,
  }
})
