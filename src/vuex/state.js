import { mainRoutes, appRoutes } from '@/router/routes'
export default {
  label: {
    'edit': '编辑',
    'add': '添加',
    'clear': '清空',
    'submit': '提交',
    'delete': '删除',
    'search': '搜索',
    'debugging': '调试',
    'sure': '确定',
    'cancle': '取消'
  },
  pager: {
    'url': '',
    'currPage': 1,
    'order': '',
    'pagesize': 10,
    'sort': '',
    'total': 100,
    'data': []
  },
  map: {
    'sex': {
      '1': '男',
      '2': '女',
      '3': '保密'
    },
    'userType': {
      '1': '管理员',
      '2': '用户'
    },
    'status': {
      '1': '正常',
      '2': '停用'
    },
    'openClose': {
      '1': '打开',
      '2': '关闭'
    }
  },
  routers: [
    mainRoutes,
    ...appRoutes
  ],
  // mainRoutes 所有用户都有的  +  当前根据当前用户权限可以访问的
  tagsList: [...mainRoutes.children], // 标签（点击跳转的）路由都在里边 ，左侧菜单中的路由在main.js中created时 push进去
  pageTagsList: [
    {
      title: '首页',
      // path: '/',
      name: 'home'
    }
  ], // 打开的页面对象
  // 已经打开的页面列表数据
  pageOpenedList: [
    {
      meta: {
        title: '首页'
      },
      path: '/',
      name: 'home'
    }
  ],
  // 带有页面权限数据的数组 实例： [{pageName: 'main', access: 1}, {pageName: 'member_index', access: 0}]  数组中的 pageName 可以改为其他，改过之后mutations中的updateMenulist函数中也要改也要相应的去改
  accessArr: [],
  // 要缓存的页面name数组
  cachePage: [],
  currentPageName: '',
  // 面包屑数组
  currentPath: [
    {
      title: '首页',
      path: '/',
      name: 'home'
    }
  ],
  // 要展示的左侧菜单
  menuList: [],
  // 要展开的菜单数组
  openedSubmenuArr: []
}
