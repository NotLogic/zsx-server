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
          <Button type="text" class="btn-logout" icon="log-out" size="large" @click="exitToLogin">注销</Button>
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
  import util from '@/libs/util'
  import sidebar from '@/components/sidebar'
  import tagsPageOpened from '@/components/tagsPageOpened'
  import breadcrumbNav from '@/components/breadcrumbNav'
  export default {
    name: 'main',
    components: {
      sidebar,
      tagsPageOpened,
      breadcrumbNav
    },
    data () {
      return {
        hideMenuText: false
      }
    },
    // 计算属性 引入vuex进行状态管理，从store实例中读取状态最简单的方法就是在计算属性中返回某个状态
    computed: {
      menuList () {
        return this.$store.state.menuList
      },
      // 所有打开的页面
      pageTagsList () {
        return this.$store.state.pageOpenedList
      },
      // 面包屑数组
      currentPath () {
        return this.$store.state.currentPath
      },
      cachePage () {
        return this.$store.state.cachePage
      }
    },        
    methods: {
      exitToLogin () {
        let vm = this
        vm.$Modal.confirm({
          title: '确认退出',
          content: '点击“取消”将留在当前页，点击“确定”将转向登录页。',
          onOk: function () {
            if (sessionStorage.user) {sessionStorage.removeItem('user')}
            vm.$router.push({name: 'login'})
            // 清空左侧菜单
            vm.$store.commit('clearOpenedSubmenu')
            // 清空快捷导航菜单数组
            vm.$store.commit('clearPageOpenedList')
            // 清空面包屑
            vm.$store.commit('clearCurrentPath')
            // 清空左侧展开菜单数据
            sessionStorage.removeItem('currentPageName')
            sessionStorage.removeItem('currentPath')
            sessionStorage.removeItem('pageOpenedList')
          }
        })
      },
      toggleClick () {
        this.hideMenuText = !this.hideMenuText
      },
      init () {}
    },
    mounted () {
      let vm = this
      vm.init()
      // 解决刷新时已打开快捷导航状态丢失
      if (sessionStorage.pageOpenedList) {
        let arr = [].concat(JSON.parse(sessionStorage.pageOpenedList))
        let myArr = []
        if (sessionStorage.currentPageName !== 'home') {
          let arr2 = arr.filter(item => {
            return item.name === sessionStorage.currentPageName
          })
          myArr = [arr[0]].concat(arr2)
        } else {
          myArr = [arr[0]]
        }
        vm.$store.commit('setPageOpenedList', myArr)
      }
      // 刷新更新面包屑
      if (sessionStorage.currentPath) {
        vm.$store.commit('setCurrentPath', JSON.parse(sessionStorage.currentPath))
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
    overflow: auto;
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
