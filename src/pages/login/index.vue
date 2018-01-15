<template>
  <div class="zsx-login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登录
        </p>
        <div class="login-form">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="userName">
              <Input v-model="form.userName" type="text" placeholder="请输入用户名">
              <span slot="prepend">
                  <Icon :size="16" type="person"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input v-model="form.password" type="password" placeholder="请输入密码">
              <span slot="prepend">
                  <Icon :size="16" type="locked"></Icon>
                </span>
              </Input>
            </FormItem>
            <FormItem>
              <Button @click="handleSubmit" type="primary" long>登录</Button>
            </FormItem>
            <!--<router-link :to="{name: 'main',query: {name:1},params: {aa:1,bb:2}}">传数据到main</router-link>-->
            <!-- 带查询参数 -->
            <!--<router-link :to="{name: 'main',query: {name:1}}">传数据到main</router-link>-->
            <!--<router-link :to="{path: '/',query: {name:1}}">传数据到main</router-link>-->
          </Form>
          <p>输入任意内容跳转主页</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
  // import Cookies from 'cookie'
  export default {
    name: 'login',
    data () {
      return {
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
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
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            // Cookies.set('userName', this.form.userName)
            // Cookies.set('password', this.form.password)
            // console.log(Cookies.get('userName'))
            this.$Message.success('登陆成功')
            this.$router.push({
              name: 'main'
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .zsx-login{
    width: 100%;
    height: 100%;
    background: url("../../assets/images/login-bg.jpg");
    background-size: cover;
  }
  .login-con{
    position:absolute;
    right: 160px;
    top: 50%;
    width: 300px;
  }
</style>
