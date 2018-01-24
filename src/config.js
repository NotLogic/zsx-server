const isProduction = process.env.NODE_ENV === "production" && process.env.NODE_RUN === "production"
// 环境配置
const host = {
  // 本地
  localUrl: "http://localhost:8282/zsx-upms-web-server",
  // 服务端
  serviceUrl: "http://web.2017zsx.com/upms-web"
}
// api baseURL
const api = isProduction ? host.serviceUrl : host.localUrl
// cnd
const cdn = ''
export default {
  api,
  cdn
}
