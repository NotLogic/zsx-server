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
        @on-close="closeTag">{{item.title}}</Tag>
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
        currentPageName: this.$route.name
      }
    },
    methods: {
      closeTag (event, name) {
        this.$store.commit('removeTag', name)
        this.$store.commit('closePage', name)
      },
      openPage (name) {        
        this.$store.commit('openPage', name)
      },
      closeAllPage () {
        console.log('关闭所有')
      },
      closeOtherPage () {
        console.log('关闭其他')
      },
      clickDropdown (name) {
        let vm = this
        if (name ==='closeAll') {
          vm.closeAllPage()
        } else if (name === 'closeOther') {
          vm.closeOtherPage()
        }
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
