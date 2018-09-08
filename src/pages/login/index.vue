<template>
  <div class="zsx-login" @keydown.enter="handleSubmit" style="background: url('static/images/login-bg.jpg') no-repeat center;background-size:cover;">
    <div class="zsx-system">SNS后台管理系统</div>
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="login-form">
          <Form ref="loginForm" :model="loginForm" :rules="rules">
            <FormItem prop="loginName">
              <Input v-model="loginForm.loginName" type="text" placeholder="请输入账号">
                <span slot="prepend">
                  <Icon :size="16" type="md-person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="loginPass">
              <Input v-model="loginPass" type="password" placeholder="请输入密码">
                <span slot="prepend">
                  <Icon :size="16" type="ios-lock"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Checkbox v-model="rememberMe">记住密码</Checkbox>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
          </Form>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  import jsCookie from 'js-cookie'
  export default {
    name: 'login',
    data () {
      return {
        loginErrTxt: '您的用户名或密码输入错误，请重新输入',
        noAuthTxt: '对不起，您暂时无权访问本系统，请联系管理员给您进行授权',
        loginUrl: 'web/sys/user/login',
        // getAuth: 'web/sys/perm/shiro/vue/',
        getAuth: 'web/sys/perm/shiro/vue',
        rememberMe: true,
        loginPass: '',
        loginForm: {
          "loginName": "",
          "loginPass": "",
        },
        rules: {
          loginName: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          loginPass: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit () {
        let vm = this
        vm.$refs.loginForm.validate((valid) => {
          if (valid) {
            var params = {
              method: 'post',
              url: vm.loginUrl
            }
            var method = params.method
            if(method=='get'){
              params.params = vm.loginForm
            }else{
              params.data = vm.loginForm
            }

            vm.$store.dispatch('Login',params).then(data=>{
              if (data.code == 1) {
                // 登录成功的流程
                // vm.loginFun2(data.data)
                var sysUser = {}
                if(data){
                  sysUser = data.data.sysUser
                  jsCookie.set('JSESSIONID',data.data.sessionId,{ path: '' })
                  // jsCookie.set('JSESSIONID',data.data,{ path: '' })
                }
                sessionStorage.sysUser = JSON.stringify(sysUser)
                var authParams = {
                  url: vm.getAuth,
                  method: 'post'
                }
                vm.$store.dispatch('getAuth',authParams).then(res=>{
                  vm.loginSuccess()
                  vm.$router.push({name: 'home'})
                  vm.$Message.success('登录成功')
                }).catch(err=>{
                  vm.$Message.info(vm.noAuthTxt)
                })
              }else{
                vm.$Message.error(vm.loginErrTxt)
              }
            })
            return
            
            vm.$http2(params).then(function (res) {
              if(res&&res.data){
                var resData = res.data
                if (resData.code == 1) {
                  vm.loginFun(resData)
                }else{
                  vm.$Message.error(vm.loginErrTxt)
                }
              }
            })
          }
        })
      },
      loginSuccess(){
        var vm = this
        vm.initChinaDataAndJson()
        vm.initImageHost()
        var user = {
          loginName: vm.loginForm.loginName,
          loginPass: vm.loginForm.loginPass,
        }
        var userString = JSON.stringify(user)
        sessionStorage.user = userString
        if (vm.rememberMe) {
          localStorage.user = userString
        } else {
          if (localStorage.user) {
            localStorage.removeItem('user')
          }
        }
      },
      loginFun2(data){
        var vm=this,userId= data.userId || 5
        var params = {
          // url: vm.getAuth + userId,
          url: vm.getAuth,
          method: 'post'
        }
        if(data){
          jsCookie.set('JSESSIONID',data,{ path: '' })
        }
        vm.$http(params).then(res=>{
          if(res&&res.data){
            var resData = res.data
            if(resData.code==1){
              vm.initChinaDataAndJson()
              vm.initImageHost()
              // 根据返回的权限相关信息，进行页面至按钮级别的显示设置
              vm.$store.dispatch('authRouter',resData.data).then(()=>{
                vm.$Message.success('登陆成功')
                vm.$router.push({name: 'home'})
              }).catch(err=>{
                vm.$Message.error(vm.noAuthTxt)
              })
              // vuex只进行内部状态维护，不进行其他操作
              // vm.$store.dispatch('initChinaDataAndJson')
              // vm.$store.dispatch('initImageHost')
              var user = {
                loginName: vm.loginForm.loginName,
                loginPass: vm.loginForm.loginPass,
                nickName: '',
                userId: userId,
                token: '',
              }
              var userString = JSON.stringify(user)
              sessionStorage.user = userString
              if (vm.rememberMe) {
                localStorage.user = userString
              } else {
                if (localStorage.user) {
                  localStorage.removeItem('user')
                }
              }
            }else{
              vm.$Message.info('用户授权获取失败，请重新登录')
            }
          }
        })
      },
      loginFun (resData) {
        let vm = this,sysUser = resData.sysUser && resData.sysUser.length ? resData.sysUser[0] : {}
        // 设置cookie
        // JSESSIONID    rememberMe
        // 登录成功存储的数据
        var user = {
          loginName: vm.loginForm.loginName,
          loginPass: vm.loginForm.loginPass,
          nickName: sysUser.nickName,
          userId: sysUser.id,
          token: resData.token,
          // JSESSIONID: resData.data
        }
        if(resData.data){
          jsCookie.set('JSESSIONID',resData.data,{ path: '' })
        }
        var userString = JSON.stringify(user)
        if (vm.rememberMe) {
          localStorage.user = userString
        } else {
          if (localStorage.user) {
            localStorage.removeItem('user')
          }
        }
        vm.initChinaDataAndJson()
        vm.initImageHost()
        sessionStorage.user = userString
        vm.$Message.success('登陆成功')
        vm.$router.push({name: 'home'})
      },
      initChinaDataAndJson(){
        var vm = this
        // 初始化时将地址数据存入 sessionStorage
        if (!sessionStorage.chinaJson || !sessionStorage.chinaData) {
          vm.$http.post('area/areas').then(res => {
            if(!res){
              vm.$Message.error('省市区基础数据获取失败，请在需要使用前按F5刷新页面重试')
            }else{
              var resData = res && res.data
              if(resData.code==1){
                let chinaData = resData.data
                let chinaJson = vm.util.getChinaJsonByData(chinaData)
                sessionStorage.chinaJson = JSON.stringify(chinaJson)
                sessionStorage.chinaData = JSON.stringify(chinaData)
              }
            }
          })
        }
      },
      initImageHost(){
        var vm = this
        var imageHost = sessionStorage.imageHost
        if(!imageHost){
          vm.$http({
            url: 'web/server/get',
            method: 'get'
          }).then(res=>{
            sessionStorage.imageHost = res.data
          }).catch(error=>{})
        }
      },
    },
    watch: {
      loginPass(val){
        if(!val)return
        this.loginForm.loginPass = hex_md5(val)
      },
    },
    mounted () {
      if (localStorage.user) {
        var vm = this
        let user = JSON.parse(localStorage.user)
        vm.loginForm.loginName = user.loginName
        vm.loginPass = user.loginPass
        vm.rememberMe = true
        setTimeout(function(){
          // 延时给密码赋值，否则loginPass改变时会重写loginForm.loginPass
          vm.loginForm.loginPass = user.loginPass
        },50)
      }
    }
  }
</script>

<style scoped>
  .zsx-login{
    width: 100%;
    height: 100%;
    background-size: cover;
  }
  .zsx-system{
    text-align: center;
    padding-top: 10%;
    color: #fff;
    font-size: 45px;
  }
  .login-con{
    /* position:absolute;
    left: 50%;
    top: 50%;
    margin-left: -150px;*/
    width: 300px;
    padding-top: 5%;
    margin: 0 auto;
  }
</style>
