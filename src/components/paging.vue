<template>
  <div class="wrapper-pagination">
    <Button shape="circle" icon="ios-refresh-empty" style="margin-right: 10px;" @click="paging"></Button>
    <div class="pager-wrapper">
      <Page :total="total" show-sizer show-elevator show-total :current="current" :page-size="size" :placement="placement" :page-size-opts="pageSizeOpts" @on-change="pagingNumChange" @on-page-size-change="pagingSizeChange"></Page>
    </div>
  </div>
</template>

<script>
  // import $ from 'jquery'
  export default {
    name: 'paging',
    props: {
      total: [Number, String],
      current: {
        type: [Number, String],
        // default: 1
      },
      placement: {
        type: String,
        default: 'top'
      },
      size: {
        type: [Number, String],
        // default: 10
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
        this.paging('current', currPage)
      },
      pagingSizeChange (pageSize) {
        // 更改每页显示数量时会发两次请求：因为 pageSize吧变化的同时 currPage 变为1
        this.paging('size', pageSize)
      },
      paging (key, value) {
        let vm = this
        if (key) {
          let data = {}
          data[key] = value
          vm.$emit('changePager', data)
        } else {
          vm.$emit('paging')
        }
      }
    }
  }
</script>

<style scoped>
  .wrapper-pagination{
    text-align: right;
    height: 62px;
    padding: 15px 0;
  }
  .wrapper-pagination .pager-wrapper{
    float: right;
  }
</style>
