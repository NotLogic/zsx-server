// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iView from 'iview'
// import axios from 'axios'

import 'iview/dist/styles/iview.css'
import './styles/common.css'
Vue.config.productionTip = false
// Vue.use(axios)
Vue.use(iView)

// router.beforeEach((to, from, next) => {})
// router.afterEach(() => {})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  methods: {}
})
