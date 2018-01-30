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
        this.$store.commit('removeTag', name)
        this.$store.commit('closePage', name)
        // 如果关闭的是当前页，需要额外的操作
      },
      openPage (name) {        
        this.$store.commit('openPage', name)
        this.$router.push({name: name})
      },
      closeAllPage () {
        this.$store.commit('closeAllPage')
        this.$router.push({name: 'home'})
      },
      closeOtherPage () {
        this.$store.commit('closeOtherPage', sessionStorage.currentPageName)
      },
      clickDropdown (name) {
        let vm = this
        if (name ==='closeAll') {
          vm.closeAllPage()
        } else if (name === 'closeOther') {
          vm.closeOtherPage()
        }
      }
    },
    beforeCreate () {
      if (sessionStorage.pageOpenedList && sessionStorage.currentPageName) {
        let homeObj = JSON.parse(sessionStorage.pageOpenedList)[0]
        let currPageArr = JSON.parse(sessionStorage.pageOpenedList).filter(item => {
          return item.name === sessionStorage.currentPageName
        })
        this.$store.commit('updatePageOpenedList', [homeObj].concat(currPageArr))
      }
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
