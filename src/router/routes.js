import main from '@/pages/main'
const loginRoute = {
  path: '/login',
  name: 'login',
  // component: require('@/pages/login')
  component: resolve => { require(['@/pages/login'], resolve) }
}
const mainRoute = {
  path: '/',
  name: 'main',
  component: main
}
const appRoutes = [
  {
    path: '/authority',
    name: 'authority',
    component: main,
    children: [
      {
        path: 'resource',
        name: 'resource',
        // component: require('@/pages/authority/resource.vue')
        component: resolve => { require(['@/pages/authority/resource'], resolve) }
      },
      {
        path: 'role',
        name: 'role',
        // component: require('@/pages/authority/role.vue')
        component: resolve => { require(['@/pages/authority/role'], resolve) }
      },
      {
        path: 'user',
        name: 'user',
        // component: require('@/pages/authority/user.vue')
        component: resolve => { require(['@/pages/authority/user'], resolve) }
      }
    ]
  },
  {
    path: '/guide',
    name: 'guide',
    component: main,
    children: [
      {
        path: 'workClass',
        name: 'workClass',
        // component: require('@/pages/guide/workClass.vue')
        component: resolve => { require(['@/pages/guide/workClass'], resolve) }
      },
      {
        path: 'workMatter',
        name: 'workMatter',
        // component: require('@/pages/guide/workMatter.vue')
        component: resolve => { require(['@/pages/guide/workMatter'], resolve) }
      }
    ]
  },
  {
    path: '/policy',
    name: 'policy',
    component: main,
    children: [
      {
        path: 'policy_child',
        name: 'policy_child',
        // component: require('@/pages/policy')
        component: resolve => { require(['@/pages/policy'], resolve) }
      }
    ]
  },
  {
    path: '/gover',
    name: 'gover',
    component: main,
    children: [
      {
        path: 'gover_child',
        name: 'gover_child',
        // component: require('@/pages/gover')
        component: resolve => { require(['@/pages/gover'], resolve) }
      }
    ]
  }
]
const errorRoutes = [
  {
    path: '/*',
    name: 'error_404',
    component: require('@/pages/error/404.vue')
  }
]
const routes = [
  loginRoute,
  mainRoute,
  ...appRoutes,
  ...errorRoutes
]
export default routes
