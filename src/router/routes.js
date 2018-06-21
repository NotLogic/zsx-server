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
    access: 1,
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
        access: 1,
        icon: ''
      },
      component: resolve => { require(['@/pages/home'], resolve) }
    }
  ]
}
export const appRoutes = [
  // 模板
  // {
  //   path: '/template',
  //   name: 'template',
  //   meta: {
  //     title: '模板',
  //     access: 1,
  //     icon: ''
  //   },
  //   component: main,
  //   children: [
  //     {
  //       path: 'template_index',
  //       name: 'template_index',
  //       meta: {
  //         title: '模板',
  //         access: 1,
  //         icon: ''
  //       },
  //       component: resolve => { require(['@/pages/pageTemplate'], resolve) }
  //     }
  //   ]
  // },
  // 用户
  {
    path: '/user',
    name: 'user',
    meta: {
      title: '用户管理',
      access: 1,
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'app',
        name: 'app',
        meta: {
          title: 'APP用户',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/authority/user'], resolve) }
      },
      {
        path: 'systemUser',
        name: 'systemUser',
        meta: {
          title: '系统用户',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/authority/systemUser'], resolve) }
      },
    ]
  },
  // 广告管理
  {
    path: '/ad',
    name: 'ad',
    meta: {
      title: '广告管理',
      access: 1,
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'ad_index',
        meta: {
          title: '广告管理',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/ad'], resolve) }
      }
    ]
  },
  // 意见反馈
  {
    path: '/adviceBack',
    name: 'adviceBack',
    meta: {
      title: '意见反馈',
      access: 1,
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'index',
        name: 'adviceBack_index',
        meta: {
          title: '意见反馈',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/adviceBack'], resolve) }
      }
    ]
  },
  {
    path: '/content',
    name: 'content',
    component: main,
    meta: {
      title: '资讯管理',
      access: 1,
      icon: ''
    },
    children: [
      {
        path: 'news',
        name: 'news',
        meta: {
          title: '新闻管理',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/content/news'], resolve) }
      },
      {
        path: 'gover',
        name: 'gover',
        meta: {
          title: '政务信息',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/content/gover'], resolve) }
      },
      {
        path: 'policy',
        name: 'policy',
        meta: {
          title: '招商引资',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/content/policy'], resolve) }
      },
      {
        path: 'workClass',
        name: 'workClass',
        meta: {
          title: '办事分类',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/content/workClass'], resolve) }
      },
      {
        path: 'workMatter',
        name: 'workMatter',
        meta: {
          title: '办事事项',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/content/workMatter'], resolve) }
      }
    ]
  },
  // 权限
  {
    path: '/authority',
    name: 'authority',
    meta: {
      title: '权限管理',
      access: 1,
      icon: 'key'
    },
    component: main,
    children: []
  },
  // 系统配置
  {
    path: '/systemSetting',
    name: 'systemSetting',
    component: main,
    meta: {
      title: '系统配置',
      access: 1,
      icon: ''
    },
    children: [
      {
        path: 'article',
        name: 'article',
        meta: {
          title: '推送',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/content/article'], resolve) }
      },
      {
        path: 'message',
        name: 'message',
        meta: {
          title: '系统消息',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/content/message'], resolve) }
      },
      {
        path: 'sensitiveWords',
        name: 'sensitiveWords',
        meta: {
          title: '敏感词库',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/sensitiveWord/sensitiveWords.vue'], resolve) }
      }, {
        path: 'sensitiveWordSettting',
        name: 'sensitiveWordSettting',
        meta: {
          title: '匹配规则',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/sensitiveWord/sensitiveWordSettting.vue'], resolve) }
      }
    ]
  },
  // 基础数据
  {
    path: '/basiceData',
    name: 'basiceData',
    meta: {
      title: '基础数据',
      access: 1,
      icon: ''
    },
    component: main,
    children: [
      {
        path: 'province',
        name: 'province',
        meta: {
          title: '省市区',
          access: 1,
          icon: ''
        },
        component: resolve => { require(['@/pages/basiceData/province'], resolve) }
      }
    ]
  }
]
const errorRoutes = [
  {
    path: '404',
    name: 'error_404',
    component: require('@/pages/error/404.vue')
  },
  // {
  //   path: '*',
  //   redirect: {name: 'error_404'}
  // }
]

const routes = [
  loginRoute,
  mainRoutes,
  ...appRoutes,
  ...errorRoutes
]
export const commonRoutes = [loginRoute, mainRoutes, errorRoutes]
export default routes
