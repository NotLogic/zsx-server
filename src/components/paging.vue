<template>
  <div class="wrapper-pagination">
    <Button shape="circle" icon="ios-refresh-empty" style="margin-right: 10px;" @click="paging"></Button>
    <Page :total="pager.total" show-sizer show-elevator :current="pager.currPage" :page-size="pagesize" placement="top" :page-size-opts="pageSizeOpts" @on-change="pagingNumChange" @on-page-size-change="pagingSizeChange"></Page>
  </div>
</template>

<script>
  // import $ from 'jquery'
  export default {
    name: 'paging',
    props: {
      pagesize: {
        type: Number,
        default: 10
      },
      pageSizeOpts: {
        type: Array,
        default: function () {
          return [10, 20, 30, 40]
        }
      }
    },
    computed: {
      pager () {
        return this.$store.state.pager
      }
    },
    methods: {
      pagingNumChange (currPage) {
        console.log('当前页： ', currPage)
        this.paging('currPage', currPage)
      },
      pagingSizeChange (pageSize) {
        console.log('每页几个： ', pageSize)
        this.paging('pageSize', pageSize)
      },
      paging (key, value) {
        let vm = this
        let payload = {}
        let payloadKey = '"' + key + '"'
        payload[payloadKey] = value
        vm.$store.dispatch('paging', payload)
      }
    },
    mounted () {}
  }
</script>

<style scoped>
  .wrapper-pagination{
    text-align: right;
    padding: 15px 0;
  }
  .wrapper-pagination .ivu-page{
    float: right;
  }
</style>
