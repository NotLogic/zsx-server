<style scoped>

</style>
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
  import {setCurrentPath, openNewPage, getParentRouterNameByName} from '@/libs/util'
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
        // 更新面包屑
        setCurrentPath(vm, name)
        // 更新快捷导航
        openNewPage(vm, name)
        vm.$router.push({name: name})
      }
    },
    watch: {
      $route (to) {
        let vm = this
        sessionStorage.currentPageName = to.name
        setCurrentPath(vm, to.name)
      },
      // openedSubmenuArr () {
      //   this.$nextTick(() => {
      //     this.$refs.sideMenu.updateOpened()
      //   })
      // },
      currentPageName () {
        this.$nextTick(() => {
          this.$refs.sideMenu.updateOpened()
        })
      }
    },
    updated () {
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened()
        }
      })
    },
    mounted () {
      if (sessionStorage.currentPageName) {
        let parentName = getParentRouterNameByName(sessionStorage.currentPageName)
        // 只展开一个
        this.$store.commit('oneOpenedSubmenuArr', parentName)
      }
    }
  }
</script>
