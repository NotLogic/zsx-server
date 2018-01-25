import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
// 引入'babel-polyfill' 兼容ie 9-11 ie不支持Promise方法
import store from './vuex'
import http from './libs/http.js' // 经过封装的axios
// import utils from './libs/utils.js'
import 'iview/dist/styles/iview.css'
import './styles/common.css'
Vue.config.productionTip = false
Vue.use(iView)
Vue.prototype.$http = http
// router.beforeEach((to, from, next) => {})
// router.afterEach(() => {})
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
    setTimeout(function () {
      vm.$store.commit('updateMenulist')
    }, 100)
  },
  created () {},
  methods: {}
})
