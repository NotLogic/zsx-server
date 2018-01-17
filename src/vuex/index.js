import Vue from 'vue'
import Vuex from 'vuex'
import {mainRoutes, appRoutes} from '@/router/routes'
// import state from './state'
// import * as getters from './getters'
// import * as mutations from './mutations'

window.Vuex || Vue.use(Vuex)
// 暂时不使用vuex进行管理，等后期或对vuex熟悉后使用
export default new Vuex.Store({
  state: {
    routers: [
      ...mainRoutes,
      ...appRoutes
    ],
    menuList: [],
    tagsList: [],
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
  mutations: {},
  actions: {
    paging () {},
    initData () {},
    submitDialog () {},
    submitSearch () {},
    delRow () {}
  }
})
