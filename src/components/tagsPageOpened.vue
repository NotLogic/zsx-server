<template>
  <div class="tags-page-opened-outer">
    <div class="close-tag">
      <Dropdown @on-click="clickDropdown">
        <Button type="primary">
            菜单选项
            <Icon type="arrow-down-b"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem name="closeAll">关闭所有</DropdownItem>
            <DropdownItem name="closeOther">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="tags-page-opened">
      <Tag
        v-for="item in pageTagsList"
        :key="item.name"
        type="dot"
        :closable="item.name==='home' ? false : true"
        :color="currentPageName===item.name ? 'blue' : 'default'"
        :name="item.name"
        @click.native="openPage(item.name)"
        @on-close="closeTag">{{item.meta.title}}</Tag>
        <!-- 选中的菜单color值改为blue -->
    </div>
  </div>
</template>

<script>
  import {getParentRouterNameByName} from '@/libs/util'
  export default {
    name: 'tagsPageOpened',
    props: {
      pageTagsList: Array
    },
    data () {
      return {
        // currentPageName: this.$route.name
      }
    },
    computed: {
      currentPageName () {
        return this.$route.name
      }
    },
    methods: {
      closeTag (event, name) {
        let vm = this
        // 移除标签  会修改 pageOpenedList 
        vm.$store.commit('removeTag', name)
        // 从缓存中移除
        vm.$store.commit('closePage', name)
        // 如果关闭的是当前页 展示最先打开的那个页面
        if (name === vm.currentPageName) {
          let lastPageName = ''
          if (vm.$store.state.pageOpenedList.length > 1) {
            lastPageName = vm.$store.state.pageOpenedList[1].name
          } else {
            lastPageName = vm.$store.state.pageOpenedList[0].name
          }
          vm.$router.push({name: lastPageName})
        }
      },
      openPage (name) {
        let vm = this
        let parentName = getParentRouterNameByName(name)
        if (parentName) {
          let parentNameInOpenedSubmenuArr = false
          vm.$store.state.openedSubmenuArr.forEach((item, index) => {
            if (item === parentName) {
              parentNameInOpenedSubmenuArr = true
            }
          })
          if (!parentNameInOpenedSubmenuArr) {
            vm.$store.commit('setOpenedSubmenuArr', parentName)
          }
        }
        vm.$router.push({name: name})
      },
      // 菜单选项
      clickDropdown (name) {
        let vm = this
        if (name ==='closeAll') {
          // 清空标签
          vm.$store.commit('closeAllPage')
          // 清空左侧展开的菜单（效果暂未实现）    这个效果会操控侧边栏组件，形成耦合
          // vm.$store.commit('clearAllOpenedSubmenuArr')
          vm.$router.push({name: 'home'})
        } else if (name === 'closeOther') {
          vm.$store.commit('closeOtherPage', vm.currentPageName)
          // 清空其他，只剩一个展开（效果暂未实现）  这个效果会操控侧边栏组件，形成耦合
          // let parentName = getParentRouterNameByName(vm.currentPageName)
          // if (parentName) {
          //   vm.$store.commit('clearOtherOpenedSubmenuArr', parentName)
          // }
        }
      }
    },
    beforeCreate () {
      // if (sessionStorage.pageOpenedList && sessionStorage.currentPageName) {
      //   let homeObj = JSON.parse(sessionStorage.pageOpenedList)[0]
      //   console.log(sessionStorage.pageOpenedList)
      //   let currPageArr = JSON.parse(sessionStorage.pageOpenedList).filter(item => {
      //     if (sessionStorage.currentPageName === 'home') {
      //       return []
      //     }
      //     return item.name === sessionStorage.currentPageName
      //   })
      //   this.$store.commit('updatePageOpenedList', [homeObj].concat(currPageArr))
      // }
    }
  }
</script>

<style scoped>
  .tags-page-opened-outer{
    position: relative;
    padding: 0 15px;
    height: 40px;
    line-height: 40px;
    background: #f0f0f0;
  }
  .close-tag{
    position: absolute;
    right: 0;
    top: 0;
    width: 120px;
    height: 40px;
    text-align: center;
    background: #fff;
    z-index: 10;
  }
  .tags-page-opened{
    margin-right: 110px;
    height: 40px;
    overflow: hidden;
  }
</style>
