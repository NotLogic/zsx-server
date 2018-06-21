<template>
  <div class="template">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="900" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import page from '@/mixins/page'
  export default {
    name: 'template',
    mixins: [page],
    components: {
      mainTable,
      paging,
    },
    data(){
      return {
        url: {
          // 增删改查
          add: '',
          delete: '',
          edit: '',
          search: '',
        },
        pager: {
          // 页面初始化
          url: '',
          // 主区域表格数据
          data: [],
        },
        // 搜索表单
        formSearch: {
          
        },
        // 新增/编辑表单
        formDialog: {

        },
        columns: [],
        rules: {}
      }
    },
    methods: {
      // 重置搜索表单
      resetSearch(name){
        name = name || 'formSearch'
        var vm = this
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
      },
      // 重置新增/编辑表单
      resetDialogForm(name){
        name = name || 'formDialog'
        var vm = this
        vm.$refs[name].resetFields()
      }
    }
  }
</script>
<style scoped>

</style>
