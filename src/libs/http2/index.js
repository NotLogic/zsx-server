import axios from 'axios'
import router from '@/router'
import {Message,Modal} from 'iview'
import store from '@/vuex'
// import config from '@/config'
import qs from 'querystring'
const TIME_OUT = 10000
let baseUrl = process.env.NODE_ENV === 'production' ? 'fwmp/api' : 'api/fwmp/api'
let http = axios.create({
  // baseURL: config.api,
  baseURL: baseUrl, // 和config/index.js下的proxyTable有关
  timeout: TIME_OUT,
  withCredentials: true
})
// http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
// http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01'
// http.defaults.headers.common['Content-Type'] = 'multipart/form-data'
// http.defaults.headers.post['Content-Type'] = 'multipart/form-data'
// 添加请求拦截器
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // if(config.method=='post' && typeof config.data == 'undefined'){
  //   config.data = {}
  // }
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  // console.log('config: ', config)
  return config
}, function (error) {
  // 对请求错误做些什么
  // console.log('请求error: ', error)
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log('http2  response: ', response)
  if(response.status==200){
    var resData = response.data
    if(resData.code==-1){
      Modal.confirm({
        title: resData.message || '登录超时请重新登录',
        content: '点击“取消”将留在当前页，点击“确定”将转向登录页。',
        onOk: function(){
          router.push({name: 'login'})
          store.dispatch('exitLogin')
        }
      })
    }
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  var errRes = error.response
  if(errRes){
    if(typeof(errRes.data) == 'object'){
      Message.info(errRes.data.message)
    }else{
      if(errRes.status==403){
        Message.info('权限不足，切换拥有相关权限的用户')
      }else if(errRes.status==504){
        Message.info('服务器网络异常，请稍后重试')
      }
    } 
  }
  return 
  // return Promise.reject(error)
})
export default http
// application/json;charset=UTF-8
// 这个header对应提交的数据必须是json字符串