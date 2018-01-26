<template>
  <div class="tags-page-opened">
    <Tag
      v-for="item in pageTagsList"
      :key="item.name"
      type="dot"
      :closable="item.name==='home' ? true : false"
      color="default"
      @click.native="openPage(item.name)"
      @on-close="closePage">{{item.title}}</Tag>
      <!-- 选中的菜单color值改为blue -->
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
        checked: false
      }
    },
    methods: {
      closePage (name) {},
      openPage (name) {
        this.$router.push({name: name})
      }
    }
  }
</script>

<style scoped>
  .tags-page-opened{
    margin: 0 15px;
    overflow: hidden;
    height: 40px;
    line-height: 40px;
    background: aqua;
  }
</style>
