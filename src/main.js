// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
// import store from './vuex' //暂时不使用vuex进行管理，等后期或者对vuex熟悉后使用
// import axios from './libs/http.js' // 经过封装的axios
// import axios from 'axios'  // 未封装的axios
// import utils from './libs/utils.js'
import 'iview/dist/styles/iview.css'
import './styles/common.css'
Vue.config.productionTip = false
Vue.use(iView)
window.Vue = Vue
// Vue.$axios = axios
// window.$axios = axios
// Vue.$store = store

// router.beforeEach((to, from, next) => {})
// router.afterEach(() => {})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
