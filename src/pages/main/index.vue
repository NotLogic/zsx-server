<template>
  <div class="zsx-main main" id="main">
    <div class="side-menu" v-show="!hideMenuText">
      <div class="logo">
        <img src="/static/images/logo.jpg" alt="">
      </div>
      <sidebar :sidebarData="sidebarData.data"></sidebar>
    </div>
    <div class="right" :style="{paddingLeft: hideMenuText ? '0' : '200px'}">
      <div class="header">
        <Button type="text" @click="toggleClick" :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}">
          <Icon type="navicon" size="32"></Icon>
        </Button>
        <Button type="text" style="float: right;margin-right: 15px;margin-top: 5px;" class="btn-logout" icon="log-out" size="large" @click="exitToLogin">
          注销
        </Button>
      </div>
      <div class="open-page-wrapper">
        <!-- <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened> -->
        中间快捷导航按钮组
      </div>
      <div class="single-page" :style="{left:hideMenuText?0:'200px'}">
        <div class="single-box">
          <router-view></router-view>
        </div>
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
  import sidebarData from '@/assets/data/sidebar.js'
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
    // computed: {},
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
  .main .side-menu{
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 200px;
    background: rgb(73, 80, 96);
    z-index: 1;
  }
  .side-menu .logo{
    padding: 10px 0;
    text-align: center;
  }
  .side-menu .logo img{
    max-width: 80%;
  }
  .main .right{
    box-sizing: border-box;
    position: absolute;
    padding-left: 200px;
    top: 0;
    width: 100%;
    height: 100%;
    /*transition: padding-left .3s;*/
  }
  .main .right .header{
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #eee;
  }
  .main .right .open-page-wrapper{
    height: 40px;
  }
  .main .right .single-page{
    box-sizing: border-box;
    position: absolute;
    top:100px;
    left: 200px;
    right: 0;
    bottom: 60px;
    background: #f5f7f9;
    overflow: auto;
    padding: 10px;
    /*transition: left .3s;*/
    overflow: auto;
  }
  .single-box{
    background-color: #fff;
    padding: 10px;
    height: 100%;
    border: 1px solid #eee;
    /* background: url('../../assets/images/welcome.jpg') no-repeat center;
    background-size: cover; */
  }
  .main .right .copyright{
    position: absolute;
    height: 60px;
    bottom: 0;
    right: 0;
    left: 200px;
    text-align: center;
    line-height: 60px;
    background: #f5f7f9;
    /*transition: left .3s;*/
  }
</style>
