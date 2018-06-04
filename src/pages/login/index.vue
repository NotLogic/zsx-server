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
            <FormItem prop="username">
              <Input v-model="loginForm.username" type="text" placeholder="请输入用户名">
                <span slot="prepend">
                  <Icon :size="16" type="person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input v-model="loginForm.password" type="password" placeholder="请输入密码">
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
        loginUrl: 'login2Index.do',
        rememberMe: true,
        loginForm: {
          "username": "",
          "password": "",
          "rememberMe": 1
        },
        rules: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          password: [
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
            // 先跳过登录请求
            vm.fn()
            return

            vm.$http.post(vm.loginUrl, vm.loginForm).then(function (res) {
              if (res.data.code == 1) {
                vm.fn()
              } else {
                vm.$Message.error(res.data.message)
                vm.loginForm.username = ''
                vm.loginForm.password = ''
              }
            })
          }
        })
      },
      fn () {
        let vm = this
        if (vm.rememberMe) {
          // 或者存后台返回的用户信息
          localStorage.user = JSON.stringify(vm.loginForm)
        } else {
          if (localStorage.user) {
            localStorage.removeItem('user')
          }
        }
        // 登陆之后保存用户信息到sessionStorage
        sessionStorage.user = JSON.stringify(vm.loginForm)
        vm.$Message.success('登陆成功')
        vm.$router.push({name: 'home'})
      }
    },
    watch: {
      rememberMe (val) {
        if (val) {
          this.loginForm.rememberMe = 1
        } else {
          this.loginForm.rememberMe = 0
        }
      }
    },
    mounted () {
      if (localStorage.user) {
        let obj = JSON.parse(localStorage.user)
        for (let key in this.loginForm) {
          this.loginForm[key] = obj[key]
        }
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
