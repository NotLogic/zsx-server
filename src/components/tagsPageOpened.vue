<template>
  <div class="tagsPageOpened">
    先不考虑样式问题
    <Tag 
      v-for="item in pageTagsList"
      :key="item.name"
      type="dot"
      closable
      color="blue"
      @click.native="openPage(item.name)"
      @on-close="closePage">{{item.title}}</Tag>
    pageTagsList : {{pageTagsList}}
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
        console.log(name)
        this.$router.push({name: name})
      }
    }
  }
</script>

<style scoped>
  .tagsPageOpened{
    padding: 0 15px;
    overflow: hidden;
    height: 40px;
    line-height: 40px;
  }
</style>
