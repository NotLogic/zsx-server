import main from '@/pages/main'
// 如果想要更逼真一些，可以在path上加 .html
// 例如登录的path可以写成： path: '/login.html'  在浏览器中显示的就是 www.zsx2017.com/login.html  其他同理
const loginRoute = {
  path: '/login',
  name: 'login',
  meta: {
    title: '登录'
  },
  component: resolve => { require(['@/pages/login'], resolve) }
}
export const mainRoutes = {
  path: '/',
  name: 'main',
  component: main,
  meta: {
    title: '首页',
    icon: ''
  },
  redirect: {
    name: 'home'
  },
  children: [
    {
      path: 'home',
      name: 'home',
      meta: {
        title: '首页',
        icon: ''
      },
      component: resolve => { require(['@/pages/home'], resolve) }
    }
  ]
}
export const appRoutes = [
  // 权限管理
  {
    path: '/authority',
    name: 'authority',
    meta: {
      title: '权限管理',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'resource',
        name: 'resource',
        meta: {
          title: '资源管理',
          icon: ''
        },
        component: resolve => { require(['@/pages/authority/resource'], resolve) }
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          title: '角色管理',
          icon: ''
        },
        component: resolve => { require(['@/pages/authority/role'], resolve) }
      },
      {
        path: 'user',
        name: 'user',
        meta: {
          title: '用户管理',
          icon: ''
        },
        component: resolve => { require(['@/pages/authority/user'], resolve) }
      }
    ]
  },
  // 会员管理
  {
    path: '/member',
    name: 'member',
    meta: {
      title: '会员管理',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'member_index',
        meta: {
          title: '会员管理',
          icon: ''
        },
        component: resolve => { require(['@/pages/member'], resolve) }
      }
    ]
  },
  // 新闻管理
  {
    path: '/news',
    name: 'news',
    component: main,
    meta: {
      title: '新闻管理',
      icon: ''
    },
    children: [
      {
        path: 'index',
        name: 'news_index',
        meta: {
          title: '新闻管理',
          icon: ''
        },
        component: resolve => { require(['@/pages/news'], resolve) }
      }
    ]
  },
  // 帖子管理
  {
    path: '/notes',
    name: 'notes',
    meta: {
      title: '帖子管理',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'notes_index',
        meta: {
          title: '帖子管理',
          icon: ''
        },
        component: resolve => { require(['@/pages/notes'], resolve) }
      }
    ]
  },
  // 评论管理
  {
    path: '/comment',
    name: 'comment',
    meta: {
      title: '评论管理',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'comment_index',
        meta: {
          title: '评论管理',
          icon: ''
        },
        component: resolve => { require(['@/pages/comment'], resolve) }
      }
    ]
  },
  // 广告管理
  {
    path: '/ad',
    name: 'ad',
    meta: {
      title: '广告管理',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'ad_index',
        meta: {
          title: '广告管理',
          icon: ''
        },
        component: resolve => { require(['@/pages/ad'], resolve) }
      }
    ]
  },
  // 群组管理
  {
    path: '/appGroup',
    name: 'appGroup',
    meta: {
      title: '群组管理',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'appGroup_index',
        meta: {
          title: '群组管理',
          icon: ''
        },
        component: resolve => { require(['@/pages/appGroup'], resolve) }
      }
    ]
  },
  // 意见反馈
  {
    path: '/adviceBack',
    name: 'adviceBack',
    meta: {
      title: '意见反馈',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'adviceBack_index',
        meta: {
          title: '意见反馈',
          icon: ''
        },
        component: resolve => { require(['@/pages/adviceBack'], resolve) }
      }
    ]
  },
  // 举报管理
  {
    path: '/complaint',
    name: 'complaint',
    meta: {
      title: '举报管理',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'complaint_index',
        meta: {
          title: '举报管理',
          icon: ''
        },
        component: resolve => { require(['@/pages/complaint'], resolve) }
      }
    ]
  },
  // 办事指南
  {
    path: '/guide',
    name: 'guide',
    meta: {
      title: '办事指南',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'workClass',
        name: 'workClass',
        meta: {
          title: '办事分类',
          icon: ''
        },
        component: resolve => { require(['@/pages/guide/workClass'], resolve) }
      },
      {
        path: 'workMatter',
        name: 'workMatter',
        meta: {
          title: '办事事项',
          icon: ''
        },
        component: resolve => { require(['@/pages/guide/workMatter'], resolve) }
      }
    ]
  },
  // 招商引资
  {
    path: '/policy',
    name: 'policy',
    meta: {
      title: '招商引资',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'policy_index',
        meta: {
          title: '招商引资',
          icon: ''
        },
        component: resolve => { require(['@/pages/policy'], resolve) }
      }
    ]
  },
  // 政务信息
  {
    path: '/gover',
    name: 'gover',
    meta: {
      title: '政务信息',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'gover_index',
        meta: {
          title: '政务信息',
          icon: ''
        },
        component: resolve => { require(['@/pages/gover'], resolve) }
      }
    ]
  },
  // 敏感词库
  {
    path: '/sensitiveWord',
    name: 'sensitiveWord',
    component: main,
    meta: {
      title: '敏感词',
      icon: ''
    },
    children: [
      {
        path: 'sensitiveWords',
        name: 'sensitiveWords',
        meta: {
          title: '敏感词库',
          icon: ''
        },
        component: resolve => { require(['@/pages/sensitiveWord/sensitiveWords.vue'], resolve) }
      }, {
        path: 'sensitiveWordSettting',
        name: 'sensitiveWordSettting',
        meta: {
          title: '匹配规则',
          icon: ''
        },
        component: resolve => { require(['@/pages/sensitiveWord/sensitiveWordSettting.vue'], resolve) }
      }
    ]
  },
  // API管理
  {
    path: '/thirdparty',
    name: 'thirdparty',
    meta: {
      title: 'API管理',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'thirdpartyClass',
        name: 'thirdpartyClass',
        meta: {
          title: 'API分类',
          icon: ''
        },
        component: resolve => { require(['@/pages/thirdparty/thirdpartyClass'], resolve) }
      },
      {
        path: 'thirdpartySetting',
        name: 'thirdpartySetting',
        meta: {
          title: 'API配置',
          icon: ''
        },
        component: resolve => { require(['@/pages/thirdparty/thirdpartySetting'], resolve) }
      }
    ]
  },
  // 基础数据
  {
    path: '/basiceData',
    name: 'basiceData',
    meta: {
      title: '基础数据',
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'province',
        name: 'province',
        meta: {
          title: '省市区',
          icon: ''
        },
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
  mainRoutes,
  ...appRoutes,
  ...errorRoutes
]
export default routes
