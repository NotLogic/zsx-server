import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
import element from 'element-ui'
// 引入'babel-polyfill' 兼容ie 9-11 ie不支持Promise方法
import 'babel-polyfill'
// import 'iview/dist/styles/iview.css'
// import 'element-ui/lib/theme-chalk/index.css'
import store from './vuex'
import http from './libs/http' // 经过封装的axios 发送数据为对象
import http2 from './libs/http2' // 经过封装的axios 发送数据为url参数
import util from './plugins/util'
import './styles/common.css'
Vue.config.productionTip = false
Vue.use(iView)
Vue.use(element)
Vue.prototype.$http = http
Vue.prototype.$http2 = http2
// 将扩展方法挂在到Vue上
Vue.prototype.util = util
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  mounted () {
    // 初始化 vm.$store.state.menuList
    // store.commit('updateMenulist')
    // // store.commit('updateMenulist2')
    // let tagsList = []
    // store.state.menuList.forEach(item => {
    //   if (item.children.length === 0) {
    //     tagsList.push(item)
    //   } else {
    //     tagsList.push(...item.children)
    //   }
    // })
    // // 设置当前用户有权访问的页面
    // store.commit('setTagsList', tagsList)
  },
})
