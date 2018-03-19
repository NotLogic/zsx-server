import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes.js'
import {commonRoutes} from './routes.js'
import iView from 'iview'
Vue.use(iView)
Vue.use(Router)
let map = {}
routes.forEach(item => {
  if (item.children) {
    item.children.forEach(child => {
      if (child.meta) {
        map[child.name] = child.meta.title
      }
    })
  } else {
    if (item.meta) {
      map[item.name] = item.meta.title
    }
  }
})
const router = new Router({
  // mode: 'history',
  // routes: commonRoutes,
  routes: routes
})
router.beforeEach((to, from, next) => {
  window.document.title = map[to.name] + ' - 众善行后台管理系统'
  iView.LoadingBar.start()
  // 如果没有登录，且前往的不是登录页
  if (!sessionStorage.user && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
  iView.LoadingBar.finish()
})
router.afterEach((to, from) => {
  iView.LoadingBar.finish()
})
export default router
