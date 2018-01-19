import Vue from 'vue'
import Vuex from 'vuex'
import {mainRoutes, appRoutes} from '@/router/routes'
// import util from '@/libs/util'
// import state from './state'
// import * as getters from './getters'
// import * as mutations from './mutations'

window.Vuex || Vue.use(Vuex)
// 暂时不使用vuex进行管理，等后期或对vuex熟悉后使用
export default new Vuex.Store({
  state: {
    label: {
      'edit': '编辑',
      'add': '新增'
    },
    currDialog: 'add',
    baseUrl: '',
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
      // 搜索commit
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
      console.log(payload.vm.formDialog)
      payload.vm.dialogShow = true
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
