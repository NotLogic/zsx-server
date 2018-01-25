import Vue from 'vue'
import Vuex from 'vuex'
import {mainRoutes, appRoutes} from '@/router/routes'
import util from '@/libs/util'
// import state from './state'
// import * as getters from './getters'
// import * as mutations from './mutations'

window.Vuex || Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    label: {
      'edit': '编辑',
      'add': '添加',
      'clear': '清空',
      'submit': '提交',
      'delete': '删除',
      'search': '搜索'
    },
    currDialog: 'add',
    pager: {
      url: '',
      currPage: 1,
      order: '',
      pagesize: 10,
      sort: '',
      total: 100,
      data: []
    },
    // 1
    routers: [
      mainRoutes,
      ...appRoutes
    ],
    menuList: [],
    tagsList: [...mainRoutes.children], // 标签（点击跳转的）路由都在里边 ，左侧菜单中的路由在main.vue中push进去
    pageTagsList: [{
      title: '首页',
      path: '/',
      name: 'main'
    }], // 打开的页面对象
    pageOpenedList: [{
      title: '首页',
      path: '/',
      name: 'main'
    }],
    accessArr: [], // 带有页面权限数据的数组 实例： [{pageName: 'main', access: 1}, {pageName: 'member_index', access: 0}]  数组中的 pageName 可以改为其他，改过之后下边也要相应的去改
    cachePage: [], // 要缓存的页面name数组
    currentPageName: '',
    currentPath: [
      {
        title: '首页',
        path: '/',
        name: 'main'
      }
    ],  // 面包屑数组
    openedSubmenuArr: []  // 要展开的菜单数组
  },
  getters: {},
  mutations: {
    resetSearch (state, name) {
      this.resetForm(name)
      // 搜索dispatch
    },
    addRow (state, vm) {
      vm.dialogShow = true
    },
    editRow (state, payload) {
      for (let key in payload.vm.formDialog) {
        // 有些值需要number类型，数据类型不要转换
        // if (typeof payload.data[key] === 'number') {
        //   payload.vm.formDialog[key] = payload.data[key].toString()
        // } else {
        //   payload.vm.formDialog[key] = payload.data[key]
        // }
        payload.vm.formDialog[key] = payload.data[key]
      }
      if (typeof payload.initDialog === 'function') {
        payload.initDialog(payload.data)
      }
      payload.vm.dialogShow = true
    },
    // 重置提交表单 预处理 + reset，公共的只有reset只有一行，就不放到vuex中了吧； 提交成功后要调用，从vuex中调用组件中的函数这样好吗？
    resetDialogForm (state, payload) {
      payload.vm.$refs[payload.name].resetFields()
    },
    // 从路由中初始化左侧菜单数据
    updateMenulist (state) {
      let menuList = []
      let _appRoutes = util.extend(appRoutes)
      _appRoutes.forEach((item, index) => {
        // 根据 accessArr 改变item.meta.access
        if (state.accessArr.length) { // 更改所有的父路由
          state.accessArr.forEach(accessArrItem => {
            if (item.name === accessArrItem.pageName) {
              item.meta.access = accessArrItem.access
            }
          })
        }
        // 父元素access为1
        if (item.meta.access !== 'undefined' && item.meta.access) {
          if (item.children.length && state.accessArr.length) {
            state.accessArr.forEach(accessArrItem => {
              item.children.forEach(child => {
                if (child.name === accessArrItem.pageName) {
                  child.meta.access = accessArrItem.access
                }
              })
            })
          }
          if (item.children.length === 1) {
            if (item.children[0].meta.access) {
              menuList.push(item)
            }
          } else {
            //  子路由不只一个
            let len = menuList.push(item) // 为什么这里的menuList.push(item)===length
            let childrenArr = []
            childrenArr = item.children.filter(child => {
              if (child.meta.access !== 'undefined' && child.meta.access) {
                return child
              }
            })
            menuList[len - 1].children = childrenArr
          }
        }
      })
      state.menuList = menuList
    }
  },
  actions: {
    paging (state, currPage) {
      console.log(currPage)
    },
    submitDialogForm (state, payload) {
      // 成功后重置表单
      state.dialogShow = false
      payload.vm.resetDialogForm(payload.name)
    },
    submitSearch (state, name) {},
    delRow (state, payload) {
      console.log(payload)
    }
  }
})
