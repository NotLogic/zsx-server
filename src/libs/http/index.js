import axios from 'axios'
import {Message} from 'iview'
// Message.info('消息测试')
// import iView from 'iview'
// import config from '@/config'
// import qs from 'querystring'
const TIME_OUT = 5000
let baseUrl = process.env.NODE_ENV === 'production' ? 'fwmp/api' : 'api/fwmp/api'
let http = axios.create({
  // baseURL: config.api,
  baseURL: baseUrl, // 和config/index.js下的proxyTable有关
  timeout: TIME_OUT
})
// http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
// http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01'
// http.defaults.headers.common['Content-Type'] = 'multipart/form-data'
// http.defaults.headers.post['Content-Type'] = 'multipart/form-data'
// 添加请求拦截器
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if(config.method=='post' && typeof config.data == 'undefined'){
    config.data = {}
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
  // console.log('response: ', response)
  return response
}, function (error) {
  // 对响应错误做点什么
  Message.error('请求错误: ',error.message || String(error))
  return 
  // return Promise.reject(error)
})
export default http
// application/json;charset=UTF-8
// 这个header对应提交的数据必须是json字符串