<template>
  <Menu ref="sideMenu" :theme="theme" :active-name="currentPageName" :open-names="openedSubmenuArr" :accordion="accordion" @on-select="menuSelect" width="auto">
    <template v-for="item in menuList">
      <MenuItem v-if="item.children.length<1" :name="item.name" :key="item.name">
        <Icon :type="item.meta.icon"></Icon>
        {{item.meta.title}}
      </MenuItem>
      <Submenu v-else :name="item.name">
        <template slot="title">
          <Icon :type="item.meta.icon"></Icon>
          {{item.meta.title}}
        </template>
        <template v-for="child in item.children" >
          <MenuItem :name="child.name" :key="child.name">
            <Icon :type="child.meta.icon"></Icon>
            {{child.meta.title}}
          </MenuItem>
        </template>
      </Submenu>
    </template>
  </Menu>
</template>

<script>
  import {getParentRouterNameByName} from '@/libs/util'
  export default {
    name: 'sidebar',
    props: {
      menuList: Array
    },
    data () {
      return {
        theme: 'dark',
        accordion: false // 是否开启手风琴模式
      }
    },
    computed: {
      currentPageName () {
        return this.$route.name
      },
      openedSubmenuArr () {
        return this.$store.state.openedSubmenuArr
      }
    },
    methods: {
      menuSelect (name) {
        let vm = this
        // 更新面包屑  在路由跳转中更新了
        // vm.$store.dispatch('setCurrentPath',name)
        // 更新快捷导航
        vm.$store.dispatch('openNewPage',name)
        // 为什么点击另一个菜单的子菜单时,左侧菜单的展开状态变了
        sessionStorage.currentPageName = name
        vm.$router.push({name: name})
      },
    },
    watch: {
      // $route (to) {
      //   // 切换为不同父级的子菜单时没有触发，导致有问题，但是路由确实是改变了的；例如：从用户管理的子菜单切到广告管理的子菜单时没有触发；
      //   var vm = this,name=to.name
      //   sessionStorage.currentPageName = name
      //   vm.$store.dispatch('setCurrentPath',name)
      // },
      // openedSubmenuArr () {
      //   this.$nextTick(() => {
      //     this.$refs.sideMenu.updateOpened()
      //   })
      // },
      // currentPageName () {
      //   this.$nextTick(() => {
      //     this.$refs.sideMenu.updateOpened()
      //   })
      // }
    },
    updated () {
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened()
        }
      })
    },
    mounted () {
      var vm=this
      let parentName = getParentRouterNameByName(sessionStorage.currentPageName)
      if(parentName){
        // 只展开一个
        vm.$store.commit('clearOtherOpenedSubmenuArr', parentName)
      }
    }
  }
</script>
