import main from '@/pages/main'
const loginRoute = {
  path: '/login',
  name: 'login',
  component: resolve => { require(['@/pages/login'], resolve) }
}
const mainRoute = {
  path: '/',
  name: 'main',
  component: main
}
const appRoutes = [
  // 权限管理
  {
    path: '/authority',
    name: 'authority',
    component: main,
    children: [
      {
        path: 'resource',
        name: 'resource',
        component: resolve => { require(['@/pages/authority/resource'], resolve) }
      },
      {
        path: 'role',
        name: 'role',
        component: resolve => { require(['@/pages/authority/role'], resolve) }
      },
      {
        path: 'user',
        name: 'user',
        component: resolve => { require(['@/pages/authority/user'], resolve) }
      }
    ]
  },
  // 会员管理
  {
    path: '/member',
    name: 'member',
    component: main,
    children: [
      {
        path: 'member_child',
        name: 'member_child',
        component: resolve => { require(['@/pages/member'], resolve) }
      }
    ]
  },
  // 新闻管理
  {
    path: '/news',
    name: 'news',
    component: main,
    children: [
      {
        path: 'news_child',
        name: 'news_child',
        component: resolve => { require(['@/pages/news'], resolve) }
      }
    ]
  },
  // 广告管理
  {
    path: '/ad',
    name: 'ad',
    component: main,
    children: [
      {
        path: 'ad_child',
        name: 'ad_child',
        component: resolve => { require(['@/pages/ad'], resolve) }
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
        component: resolve => { require(['@/pages/guide/workClass'], resolve) }
      },
      {
        path: 'workMatter',
        name: 'workMatter',
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
