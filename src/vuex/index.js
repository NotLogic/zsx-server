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
      'add': '新增'
    },
    currDialog: 'add',
    pager: {
      url: '',
      currPage: '',
      order: '',
      pagesize: '',
      sort: '',
      total: 100,
      data: [
        // 模拟数据
        {
          id: 123,
          className: '分类1',
          cityCode: 111112,
          classStatus: 1,
          classIcon: 'http://fanyi.bdstatic.com/static/translation/img/header/logo_cbfea26.png',
          classType: 0
        }
      ]
    },
    // 1
    routers: [
      ...mainRoutes,
      ...appRoutes
    ],
    menuList: [],
    tagsList: [],
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
    pagingFiltData (state, obj) {
      for (let key in obj) {
        if (typeof obj[key] !== 'string') {
          continue
        }
        if (obj[key].trim() === '') {
          delete obj[key]
        }
      }
      delete obj.data
      return obj
    },
    resetSearch (state, name) {
      this.resetForm(name)
      // 搜索dispatch
    },
    addRow (state, payload) {
      payload.vm.dialogShow = true
    },
    editRow (state, payload) {
      for (let key in payload.vm.formDialog) {
        if (typeof payload.params.row[key] === 'number') {
          payload.vm.formDialog[key] = payload.params.row[key].toString()
        } else {
          payload.vm.formDialog[key] = payload.params.row[key]
        }
      }
      if (typeof payload.initDialog === 'function') {
        payload.initDialog(payload.params.row)
      }
      payload.vm.dialogShow = true
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
    paging (state, currePage) {},
    submitDialog (state, name, formDialog) {
      var vm = this
      // 成功后重置表单
      vm.dialogShow = false
      vm.resetDialogForm(name)
    },
    submitSearch (state, name) {},
    delRow (state, payload) {
      console.log(payload)
    }
  }
})
