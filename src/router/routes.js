
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
          component: () => import('@/components/user/User.vue')
        },
        {
          path: 'rights',
          component: () => import('@/components/rights/Rights.vue')
        },
        {
          path: 'roles',
          component: () => import('@/components/rights/Roles.vue')
        }
      ],
      redirect: '/home/welcome'
    }
  ]
}