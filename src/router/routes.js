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
  // 帖子管理
  {
    path: '/notes',
    name: 'notes',
    component: main,
    children: [
      {
        path: 'notes_child',
        name: 'notes_child',
        component: resolve => { require(['@/pages/notes'], resolve) }
      }
    ]
  },
  // 评论管理
  {
    path: '/comment',
    name: 'comment',
    component: main,
    children: [
      {
        path: 'comment_child',
        name: 'comment_child',
        component: resolve => { require(['@/pages/comment'], resolve) }
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
  // 群组管理
  {
    path: '/appGroup',
    name: 'appGroup',
    component: main,
    children: [
      {
        path: 'appGroup_child',
        name: 'appGroup_child',
        component: resolve => { require(['@/pages/appGroup'], resolve) }
      }
    ]
  },
  // 意见反馈
  {
    path: '/adviceBack',
    name: 'adviceBack',
    component: main,
    children: [
      {
        path: 'adviceBack_child',
        name: 'adviceBack_child',
        component: resolve => { require(['@/pages/adviceBack'], resolve) }
      }
    ]
  },
  // 举报管理
  {
    path: '/complaint',
    name: 'complaint',
    component: main,
    children: [
      {
        path: 'complaint_child',
        name: 'complaint_child',
        component: resolve => { require(['@/pages/complaint'], resolve) }
      }
    ]
  },
  // 办事指南
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
  // 招商引资
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
  // 政务信息
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
  },
  // 敏感词库
  {
    path: '/sensitiveWord',
    name: 'sensitiveWord',
    component: main,
    children: [
      {
        path: 'sensitiveWords',
        name: 'sensitiveWords',
        component: resolve => { require(['@/pages/sensitiveWord/sensitiveWords.vue'], resolve) }
      }, {
        path: 'sensitiveWordSettting',
        name: 'sensitiveWordSettting',
        component: resolve => { require(['@/pages/sensitiveWord/sensitiveWordSettting.vue'], resolve) }
      }
    ]
  },
  // API管理
  {
    path: '/thirdparty',
    name: 'thirdparty',
    component: main,
    children: [
      {
        path: 'thirdpartyClass',
        name: 'thirdpartyClass',
        component: resolve => { require(['@/pages/thirdparty/thirdpartyClass'], resolve) }
      },
      {
        path: 'thirdpartySetting',
        name: 'thirdpartySetting',
        component: resolve => { require(['@/pages/thirdparty/thirdpartySetting'], resolve) }
      }
    ]
  },
  // 基础数据
  {
    path: '/basiceData',
    name: 'basiceData',
    component: main,
    children: [
      {
        path: 'province',
        name: 'province',
        component: resolve => { require(['@/pages/basiceData/province'], resolve) }
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
