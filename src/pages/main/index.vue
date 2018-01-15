<template>
  <div class="zsx-main main" id="main">
    <div class="left" v-show="!hideMenuText">
      <div class="logo">
        <img src="/static/images/logo.jpg" alt="">
      </div>
      <sidebar :sidebarData="sidebarData.data"></sidebar>
    </div>
    <div class="right" :style="{paddingLeft: hideMenuText ? '0' : '200px'}">
      <div class="top">
        <Button type="text" @click="toggleClick" :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}">
          <Icon type="navicon" size="32"></Icon>
        </Button>
        <Button @click="exitToLogin">注销账号</Button>
      </div>
      <div class="middle">中间</div>
      <div class="single-page" :style="{left:hideMenuText?0:'200px'}">
        <router-view></router-view>
      </div>
      <div class="copyright" :style="{left:hideMenuText?0:'200px'}">
        Copyright © 阿斯蒂芬规划局版权所有
      </div>
    </div>
  </div>
</template>

<script>
  // import Cookies from 'js-cookie'
  import sidebar from '@/components/sidebar'
  import sidebarData from '@/data/sidebar.js'
  export default {
    components: {
      sidebar
    },
    data () {
      return {
        hideMenuText: false,
        sidebarData: sidebarData
      }
    },
    // 计算属性 引入vuex进行状态管理，从store实例中读取状态最简单的方法就是在计算属性中返回某个状态
    computed: {},
    mounted () {
      // console.log(this.$route)
    },
    methods: {
      exitToLogin () {
        // 注销去登录页
        // Cookies.remove('userName')
        // Cookies.remove('password')
        this.$router.push({
          name: 'login'
        })
      },
      delCookie () {
        // Cookies.remove('userName')
        // Cookies.remove('password')
      },
      toggleClick () {
        this.hideMenuText = !this.hideMenuText
      }
    }
  }
</script>

<style scoped>
  .main .left{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 200px;
    background: rgb(73, 80, 96);
    z-index: 1;
  }
  .left .logo{
    padding: 10px 0;
    text-align: center;
  }
  .left .logo img{
    max-width: 80%;
  }
  .main .right{
    box-sizing: border-box;
    position: absolute;
    padding-left: 200px;
    top: 0;
    width: 100%;
    height: 100%;
    transition: padding-left .3s;
  }
  .main .right .top{
    height: 60px;
    background: antiquewhite;
  }
  .main .right .middle{
    height: 40px;
  }
  .main .right .single-page{
    box-sizing: border-box;
    position: absolute;
    top:100px;
    left: 200px;
    right: 0;
    bottom: 60px;
    background: aqua;
    overflow: auto;
    padding: 10px;
    transition: left .3s;
    overflow: auto;
  }
  .main .right .copyright{
    position: absolute;
    height: 60px;
    bottom: 0;
    right: 0;
    left: 200px;
    text-align: center;
    line-height: 60px;
    background: beige;
    transition: left .3s;
  }
</style>
