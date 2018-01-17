<style scoped>

</style>
<template>
  <Menu :theme="theme" :active-name="currentPageName" :open-names="openedSubmenuArr" :accordion="accordion" @on-select="menuSelect" width="auto">
    <template v-for="item in sidebarData">
      <MenuItem v-if="item.children.length<1" :name="item.key">
        <Icon type="item.icon"></Icon>
        {{item.title}}
      </MenuItem>
      <Submenu v-else :name="item.key">
        <template slot="title">
          <Icon type="item.icon"></Icon>
          {{item.title}}
        </template>
        <template v-for="child in item.children">
          <MenuItem :name="child.key">
            <Icon type="child.icon"></Icon>
            {{child.text}}
          </MenuItem>
        </template>
      </Submenu>
    </template>
  </Menu>
</template>

<script>
  export default {
    name: 'sidebar',
    props: {
      sidebarData: Array
    },
    data () {
      return {
        // currentPageName: this.$route.name,
        // openedSubmenuArr: this.$store.state.openedSubmenuArr,
        currentPageName: '',
        openedSubmenuArr: [],
        theme: 'dark',
        accordion: false // 是否开启手风琴模式
      }
    },
    methods: {
      menuSelect (name) {
        // name和路由绑定好不好？是不是太死板了
        this.$router.push({name: name})
      }
    }
  }
</script>
