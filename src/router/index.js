import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes.js'
import {commonRoutes} from './routes.js'
import {getCookie} from '@/libs/util'
import {Message,LoadingBar} from 'iview'
import store from '@/vuex'
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
  routes: commonRoutes,
  // routes: routes
})
var ak = 'JSESSIONID'
router.beforeEach((to, from, next) => {
  LoadingBar.start()
  // 为什么这段代码会导致侧边栏组件重新渲染
  var name = to.name
  var currentPageName = sessionStorage.currentPageName
  if(name=='login'){
    next()
  }else if(getCookie(ak)){
    // 已登录
    var len = store.state.permissionList.length
    if(len){
      // 已授权
      next()
      if(store.state.permissionMenuNames.indexOf(name)){
        sessionStorage.currentPageName = name
        store.dispatch('setCurrentPath',name)
      }
    }else{
      // 未授权
      store.dispatch('getAuth').then(()=>{
        if(name){
          // 正常跳转时出现权限信息丢失，获取权限后正常跳转
          if(name=='error_404'){
            next({name: currentPageName})
          }else{
            next()
          }
        }else{
          // 刷新页面会导致权限和路由跳转name丢失，从sessionStorage获取name,刷新页面相应的组件会自动从sessionStorage中获取数据
          next({'name': currentPageName})
        }
      }).catch(()=>{
        Message.info('授权失败，请重新登录')
        next({'name': 'login'})
        store.dispatch('exitLogin')
      })
    }
  }else{
    // 未登录
    next({ 'name': 'login' })
  }
  // 如果没有登录，且前往的不是登录页
  // if (!sessionStorage.user && to.name !== 'login') {
  //   next({ name: 'login' })
  // }else{
  //   next()
  // }
  var title = map[to.name] ? map[to.name] + ' - 众善行后台管理系统' : '众善行后台管理系统'
  window.document.title = title
  LoadingBar.finish()
})
router.afterEach((to, from) => {
  LoadingBar.finish()
})
export default router
