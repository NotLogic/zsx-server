<template>
  <div class="zsx-login" @keydown.enter="handleSubmit" style="background: url('static/images/login-bg.jpg') no-repeat center">
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
                  <Icon :size="16" type="person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="loginPass">
              <Input v-model="loginPass" type="password" placeholder="请输入密码">
                <span slot="prepend">
                  <Icon :size="16" type="locked"></Icon>
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
  export default {
    name: 'login',
    data () {
      return {
        loginUrl: 'web/sys/user/login',
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
    props: {},
    methods: {
      handleSubmit () {
        let vm = this
        vm.$refs.loginForm.validate((valid) => {
          if (valid) {
            vm.$http.post(vm.loginUrl, vm.loginForm).then(function (res) {
              var resData = res.data
              if (res.data.code == 1) {
                vm.loginFun(resData)
              } else {
                vm.$Message.error(resData.message)
                vm.loginForm.loginName = ''
                vm.loginForm.loginPass = ''
              }
            })
          }
        })
      },
      loginFun (resData) {
        let vm = this,sysUser = resData.sysUser && resData.sysUser.length ? resData.sysUser[0] : {}
        // 登录成功存储的数据
        var user = {
          loginName: vm.loginForm.loginName,
          loginPass: vm.loginForm.loginPass,
          nickName: sysUser.nickName,
          userId: sysUser.id,
          token: resData.token
        }
        var userString = JSON.stringify(user)
        if (vm.rememberMe) {
          localStorage.user = userString
        } else {
          if (localStorage.user) {
            localStorage.removeItem('user')
          }
        }
        sessionStorage.user = userString
        vm.$Message.success('登陆成功')
        vm.$router.push({name: 'home'})
      },
    },
    watch: {
      loginPass(val){
        this.loginForm.loginPass = hex_md5(val)
      },
    },
    mounted () {
      if (localStorage.user) {
        var vm = this
        let obj = JSON.parse(localStorage.user)
        vm.loginForm.loginName = obj.loginForm
        vm.loginForm.loginPass = obj.loginPass
        vm.rememberMe = obj.rememberMe
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
  .login-con{
    position:absolute;
    right: 160px;
    top: 50%;
    width: 300px;
  }
</style>
