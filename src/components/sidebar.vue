<style scoped>

</style>
<template>
  <Menu :theme="theme" :accordion="accordion" @on-select="menuSelect" width="auto">
    <template v-for="item in sidebarData">
      <MenuItem v-if="item.children.length<1" :name="item.key">
        <Icon type="item.icon"></Icon>
        {{item.title}}
      </MenuItem>
      <Submenu v-if="item.children.length>=1" :name="item.key">
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
        theme: 'dark',
        accordion: false, // 是否开启手风琴模式
        message: 'hellow'
        // sidebarData: sidebarData.data,
        // sidebarData2: sidebarData.data2
      }
    },
    methods: {
      menuSelect (name) {
        console.log(name)
        // name和路由绑定好不好？是不是太死板了
        this.$router.push({name: name})
      }
    }
  }
</script>
