
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
      component: () => import('@/pages/Home.vue'),
      children: [
        {
          path: 'welcome',
          component: () => import('@/components/Welcome.vue')
        },
        {
          path: 'users',
          component: () => import('@/components/User.vue')
        }
      ],
      redirect: '/home/welcome'
    }
  ]
}