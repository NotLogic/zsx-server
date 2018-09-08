<!--
  使用： 
  1.父组件必须有paging方法(点击刷新按钮触发的方法)
  2.父组件必须有changePager方法(分页改变触发的方法)
-->
<template>
  <div class="wrapper-pagination">
    <Button :class="{rotate: loading}" :disabled="loading" shape="circle" icon="md-sync" style="margin-right: 10px;" @click="paging"></Button>
    <div class="pager-wrapper">
      <Page :total="total" transfer show-sizer show-elevator show-total :current="current" :page-size="size" :placement="placement" :page-size-opts="pageSizeOpts" @on-change="pagingNumChange" @on-page-size-change="pagingSizeChange"></Page>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'paging',
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      total: {
        type: [Number, String],
        default: 0
      },
      current: {
        type: [Number, String],
        default: 1
      },
      placement: {
        type: String,
        default: 'bottom'
      },
      size: {
        type: [Number, String]
      },
      // 分页 当前页和每页个数的key不是 current和size时，需要手动传入需要的key
      currPageKey: {
        type: String,
        default: 'current'
      },
      pageSizeKey: {
        type: String,
        default: 'size'
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
        var currPageKey = this.currPageKey
        currPageKey ? this.paging(currPageKey, currPage) : this.paging('current', currPage)
      },
      pagingSizeChange (pageSize) {
        // 更改每页显示数量时会发两次请求：因为 pageSize变化的同时 currPage 变为1
        var pageSizeKey = this.pageSizeKey
        pageSizeKey ? this.paging(pageSizeKey, pageSize) : this.paging('size', pageSize)
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
