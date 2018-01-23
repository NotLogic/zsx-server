<template>
  <div class="zsx-main main" id="main">
    <div class="side-menu" :style="{left: hideMenuText ? '-200px' : '0'}">
      <div class="logo">
        <img src="/static/images/logo.jpg" alt="">
      </div>
      <sidebar :menuList="menuList"></sidebar>
    </div>
    <div class="all-right" :style="{paddingLeft: hideMenuText ? '0' : '200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button type="text" @click="toggleClick" :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}">
            <Icon type="navicon" size="32"></Icon>
          </Button>
        </div>        
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <Button type="text" class="btn-logout" icon="log-out" size="large" @click="exitToLogin">
            注销
          </Button>
        </div>
      </div>
      <!-- 已打开过页面的快捷导航 -->
      <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      <!-- 单页内容展示区域 -->
      <div class="single-page" :style="{left:hideMenuText?0:'200px'}">
        <div class="single-box">
          <keep-alive :include="cachePage">
            <router-view></router-view>
          </keep-alive>          
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
  import tagsPageOpened from '@/components/tagsPageOpened'
  import breadcrumbNav from '@/components/breadcrumbNav'
  // import sidebarData from '@/assets/data/sidebar.js'
  export default {
    components: {
      sidebar,
      tagsPageOpened,
      breadcrumbNav
    },
    data () {
      return {
        hideMenuText: false
        // pageTagsList: [],
        // currentPath: [],
        // sidebarData: []
      }
    },
    computed: {
      menuList () {
        return this.$store.state.menuList
      },
      pageTagsList () {
        return this.$store.state.pageTagsList
      },
      currentPath () {
        return this.$store.state.currentPath  // 当前面包屑数组
      },
      cachePage () {
        return this.$store.state.cachePage
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
    top: 0;
    height: 100%;
    width: 200px;
    background: rgb(73, 80, 96);
    z-index: 1;
    /* overflow: auto; */
    overflow: hidden;
    transition: left .3s;
  }
  .side-menu .logo{
    padding: 10px 0;
    text-align: center;
  }
  .side-menu .logo img{
    max-width: 80%;
  }
  .main .all-right{
    box-sizing: border-box;
    position: absolute;
    padding-left: 200px;
    top: 0;
    width: 100%;
    height: 100%;
    transition: padding-left .3s;
  }
  .main .all-right .main-header{
    height: 60px;
    line-height: 60px;
    background: #fff;
    border-bottom: 1px solid #eee;
  }
  .navicon-con{float: left}
  .header-middle-con{float: left}
  .header-avator-con{float: right}
  .main .all-right .single-page{
    box-sizing: border-box;
    position: absolute;
    top:100px;
    left: 200px;
    right: 0;
    bottom: 60px;
    background: #f5f7f9;
    overflow: auto;
    padding: 10px;
    transition: left .3s;
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
  .main .all-right .copyright{
    position: absolute;
    height: 60px;
    bottom: 0;
    right: 0;
    left: 200px;
    text-align: center;
    line-height: 60px;
    background: #f5f7f9;
    transition: left .3s;
  }
</style>
