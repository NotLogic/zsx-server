<template>
  <div class="wrapper-pagination">
    <Page :total="total" show-sizer show-elevator :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="pagingNumChange" @on-page-size-change="pagingSizeChange"></Page>
  </div>
</template>

<script>
  // import $ from 'jquery'
  export default {
    name: 'paging',
    props: {
      total: [String, Number],
      pageSize: {
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
    methods: {
      pagingNumChange (currPage) {
        console.log('当前页： ', currPage)
      },
      pagingSizeChange (pageSize) {
        console.log('每页几个： ', pageSize)
      }
    }
  }
</script>

<style scoped>
  .wrapper-pagination{
    text-align: right;
    padding: 15px 0;
  }
</style>
