import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router'
// 导入全局样式表
import '@/assets/css/global.css'
// 引入字体 icon 图标
import '@/assets/font/iconfont.css'
// 导入 api
import * as requests from '@/api'

Vue.use(ElementUI)
Vue.config.productionTip = false
// 将全局 api 挂载到 Vue 原型上
Vue.prototype.$http = requests

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
