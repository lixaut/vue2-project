
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes.js'

Vue.use(Router)

const router = new Router(routes)

// 路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router