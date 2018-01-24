<template>
  <Tree :data="treeData" :load-data="loadDataFn" show-checkbox empty-text="加载数据中..." @on-select-change="treeSelectChange" @on-check-change="treeCheckChange" @on-toggle-expand="treeToggleExpand"></Tree>
</template>

<script>
// import util from '@/libs/util'
export default {
  name: 'tree',
  props: {
    treeData: Array,
    loadDataFn: Function
  },
  data () {
    return {
      data: []
    }
  },
  methods: {
    // 这些操作直接修改了 treeData
    treeSelectChange (treeSelectNodeArr) {
      console.log('treeSelectNodeArr: ', treeSelectNodeArr)
    },
    treeCheckChange (treeCheckNodeArr) {
      console.log('treeCheckNodeArr: ', treeCheckNodeArr)
    },
    treeToggleExpand (nowNode) {
      console.log('nowNode: ', nowNode)
    }
  },
  mounted () {}
}
</script>

<style scoped>

</style>
