
export default {
  routes: [
    {
      path: '/login',
      component: () => import('@/pages/Login.vue')
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/home',
      component: () => import('@/pages/Home.vue')
    }
  ]
}