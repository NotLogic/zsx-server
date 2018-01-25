<template>
  <div class="wrapper-pagination">
    <Button shape="circle" icon="ios-refresh-empty" style="margin-right: 10px;" @click="paging"></Button>
    <Page :total="total" show-sizer show-elevator :current="currPage" :page-size="pagesize" :page-size-opts="pageSizeOpts" @on-change="pagingNumChange" @on-page-size-change="pagingSizeChange"></Page>
  </div>
</template>

<script>
  // import $ from 'jquery'
  export default {
    name: 'paging',
    props: {
      pageSizeOpts: {
        type: Array,
        default: function () {
          return [10, 20, 30, 40]
        }
      }
    },
    computed: {
      pagesize () {
        return this.$store.state.pager.pagesize
      },
      total () {
        return this.$store.state.pager.total
      },
      currPage () {
        return this.$store.state.pager.currPage
      }
    },
    methods: {
      pagingNumChange (currPage) {
        console.log('当前页： ', currPage)
        this.paging(currPage)
      },
      pagingSizeChange (pageSize) {
        console.log('每页几个： ', pageSize)
      },
      paging (currPage) {
        let vm = this
        vm.$store.dispatch('paging', {
          'vm': vm,
          'currPage': currPage
        })
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
