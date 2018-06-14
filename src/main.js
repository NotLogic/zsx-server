import Vue from 'vue'
import App from './App'
import router from './router'
import {Message} from 'iview'
import iView from 'iview'
// 引入'babel-polyfill' 兼容ie 9-11 ie不支持Promise方法
import 'babel-polyfill'
import store from './vuex'
import http from './libs/http' // 经过封装的axios 发送数据为对象
import http2 from './libs/http2' // 经过封装的axios 发送数据为url参数
import util from './plugins/util'
import './styles/common.css'
Vue.config.productionTip = false
Vue.use(iView)
Vue.prototype.$http = http
Vue.prototype.$http2 = http2
// 将扩展方法挂在到Vue上
Vue.prototype.util = util
/* eslint-disable no-new */
// 新的权限控制应该是在登陆之后动态添加当前用户可以访问的侧边栏菜单，按钮级别的权限控制需要用到mixin
// 可编辑的权限控制这个要怎么做
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
    vm.$store.dispatch('getAccessData')
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
    vm.$store.commit('setTagsList', tagsList)
  },
  created () {},
  methods: {}
})
// 初始化时将地址数据存入 sessionStorage
if (!sessionStorage.chinaJson || !sessionStorage.chinaData) {
  http.post('area/areas').then(res => {
    if(res){
      let chinaData = res.data.data
      let chinaJson = util.getChinaJsonByData(chinaData)
      sessionStorage.chinaJson = JSON.stringify(chinaJson)
      sessionStorage.chinaData = JSON.stringify(chinaData)
    }else{
      Message.error('省市区基础数据获取失败，请在需要使用前刷新页面重试')
    }
  })
}
