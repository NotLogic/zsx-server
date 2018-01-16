<template>
  <div class="work-matter">
    办事事项
    <Button type="primary" @click="addRow" size="small">添加行</Button>
    <mainTable :columns="columns1" :data="data1"></mainTable>
    <paging :total="myTotal"></paging>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  export default {
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        myTotal: 200,
        columns1: [],
        data1: []
      }
    },
    methods: {
      addRow () {
        console.log('添加行')
      }
    },
    // 生命周期钩子函数VNode替换原始dom时触发，不是对象，切记
    mounted () {
      console.log('原始DOM被VNode替换')
    }
  }
</script>

<style scoped>

</style>
