<template>
  <div class="tags-page-opened-outer">
    <div class="close-tag">
      <Dropdown @on-click="clickDropdown">
        <Button type="primary">
            菜单选项
            <Icon type="ios-arrow-down"></Icon>
        </Button>
        <DropdownMenu slot="list">
            <DropdownItem name="closeAll">关闭所有</DropdownItem>
            <DropdownItem name="closeOther">关闭其他</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
    <div class="tags-page-opened" id="scroll-wrapper">
      <Tag
        v-for="item in pageOpenedList"
        :key="item.name"
        type="dot"
        :closable="item.name==='home' ? false : true"
        :color="currentPageName===item.name ? 'primary' : 'default'"
        :name="item.name"
        @click.native="openPage(item.name)"
        @on-close="closeTag">{{item.meta.title}}</Tag>
      <!-- <ul id="scroller" :style="'width:' + scrollerWidth + 'px'">
        <li v-for="item in pageOpenedList" :key="item.name" class="scroll-item">
          <Tag
            type="dot"
            :closable="item.name==='home' ? false : true"
            :color="currentPageName===item.name ? 'primary' : 'default'"
            :name="item.name"
            @click.native="openPage(item.name)"
            @on-close="closeTag">{{item.meta.title}}</Tag>
        </li>
      </ul> -->
    </div>
  </div>
</template>

<script>
  import {getParentRouterNameByName} from '@/libs/util'
  export default {
    name: 'tagsPageOpened',
    props: {
      pageOpenedList: Array
    },
    data () {
      return {
        // currentPageName: this.$route.name,
        scrollerWidth: 500,
        myScroll: null,
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
          // 处理左侧菜单展示
          vm.$store.commit('clearOpenedSubmenuArr')
          vm.$router.push({name: 'home'})
        } else if (name === 'closeOther') {
          vm.$store.commit('closeOtherPage', vm.currentPageName)
          let parentName = getParentRouterNameByName(vm.currentPageName)
          if (parentName) {
            vm.$store.commit('clearOtherOpenedSubmenuArr', parentName)
          }
        }
      },
      initIScroll: function(){
        var vm = this;
        vm.$nextTick(function(){
          var myScroll = new IScroll('#scroll-wrapper', { scrollX: true, scrollY: false, mouseWheel: true });
          window.addEventListener('resize',myScroll.refresh())
          vm.myScroll = myScroll
        })
      },
      iScrollRefresh: function(){
        var vm = this
        vm.myScroll && vm.myScroll.refresh();
      },
      updateScrollWidth(){
       var vm = this
       vm.$nextTick(function(){
          var len = $('.scroll-item').length,i;
          var width = 0,w=0;
          for(i=0;i<len;i++){
            w = $('.scroll-item').eq(i).width()
            width += w
          }
          vm.scrollerWidth = Math.ceil(width);
          vm.iScrollRefresh()
       })
      }
    },
    // watch: {
    //   pageOpenedList(val){
    //     if(val.length){
    //       this.updateScrollWidth()
    //     }
    //   }
    // },
    // mounted(){
    //   this.initIScroll()
    // },
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
    /* background-color: aqua; */
    overflow: hidden;
  }
  /* 滚动设置 */
  #scroll-wrapper{

  }
  #scroller{
    width: 5000px;
  }
  #scroller ul{
    height: 100%;
  }
  .scroll-item{
    float: left;
  }
</style>
