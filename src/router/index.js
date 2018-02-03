import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes.js'
import iView from 'iview'
Vue.use(iView)
Vue.use(Router)
const router = new Router({
  // mode: 'history',
  routes: routes
})
router.beforeEach((to, from, next) => {
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
