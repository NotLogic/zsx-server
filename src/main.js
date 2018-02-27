import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
// 引入'babel-polyfill' 兼容ie 9-11 ie不支持Promise方法
import 'babel-polyfill'
import store from './vuex'
import http from './libs/http.js' // 经过封装的axios
import util from './libs/util.js'
import 'iview/dist/styles/iview.css'
import './styles/common.css'
Vue.config.productionTip = false
Vue.use(iView)
Vue.prototype.$http = http
// 将扩展方法挂在到Vue上
Vue.prototype.util = util
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  computed: {},
  mounted () {
    let vm = this
    this.$store.commit('getAccessData')
    // 初始化 vm.$store.state.menuList
    vm.$store.commit('updateMenulist')
    let tagsList = []
    vm.$store.state.menuList.forEach(item => {
      if (item.children.length === 0) {
        tagsList.push(item)
      } else {
        tagsList.push(...item.children)
      }
    })
    // 设置当前用户有权访问的页面
    this.$store.commit('setTagsList', tagsList)
  },
  created () {},
  methods: {}
})
// 初始化时将地址数据存入sessionStorage
util.initChinaDataAndJson()
