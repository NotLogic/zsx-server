import axios from 'axios'
// import config from '@/config'
import qs from 'querystring'
const TIME_OUT = 5000
let baseUrl = process.env.NODE_ENV === 'production' ? '' : '/api'
let http = axios.create({
  // baseURL: config.api,
  baseURL: baseUrl, // 和config/index.js下的proxyTable有关
  timeout: TIME_OUT
})
http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
// http.defaults.headers.post['Accept'] = 'application/json, text/javascript, */*; q=0.01'
// 添加请求拦截器
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  // get请求请求的是本地地址json文件
  if (config.method === 'get') {
    config.baseURL = ''
  }
  console.log('config: ', config)
  return config
}, function (error) {
  // 对请求错误做些什么
  console.log('请求error: ', error)
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log('response: ', response)
  return response
}, function (error) {
  // 对响应错误做点什么
  console.log('返回error: ', error)
  return Promise.reject(error)
})
export default http
// application/json;charset=UTF-8
// 这个header对应提交的数据必须是json字符串