<template>
  <div class="systemUser">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="用户">
        <Input v-model="formSearch.key" placeholder="账号/昵称" size="small"></Input>
      </FormItem>
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
      <Button type="error" :disabled="batchIdArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchDelete" size="small">批量删除</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data" @updateSelect="updateSelect"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="900" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="账号" prop="loginName">
              <Input v-model="formDialog.loginName" placeholder="请输入账号"></Input>
            </FormItem>
          </Col>
          <Col span="12" >
            <FormItem label="密码" prop="loginPass">
              <Input v-model="loginPass" placeholder="请输入密码" type="password"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="昵称" prop="nickName">
              <Input v-model="formDialog.nickName" placeholder="请输入账号"></Input>
            </FormItem>
          </Col>
        </Row>
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
    name: 'systemUser',
    mixins: [page],
    components: {
      mainTable,
      paging,
    },
    data(){
      return {
        url: {
          // 增删改查
          add: 'web/sys/user/add',
          delete: 'web/sys/user/delete',
          edit: '',
          search: 'web/sys/user/search',
        },
        pager: {
          // 页面初始化
          url: 'web/sys/user/dataGrid',
          // 主区域表格数据
          data: [],
        },
        batchIdArr: [],
        // 搜索表单
        formSearch: {
          key: ''
        },
        loginPass: '',
        // 新增/编辑表单
        formDialog: {
          loginName: '',
          loginPass: '',
          nickName: '',
        },
        columns: [
          {
            "type": 'selection',
            "fixed": 'left',
            "width": 80,
            "align": 'center'
          },
          {
            title: '账号',
            key: 'loginName',
            sortable: true,
          },
          {
            title: '昵称',
            key: 'nickName',
            sortable: true,
          },
          {
            title: '操作',
            key: 'action',
            width: 100,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this
              return vm.createDelBtn(create, params.row.id)
            }
          },
        ],
        rules: {
          loginName: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          loginPass: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      updateSelect(selection){
        var vm = this,batchIdArr = [],len=selection.length;
        if(len){
          for(var i=0;i<len;i++){
            batchIdArr.push(selection[i].id)
          }
        }
        vm.batchIdArr = batchIdArr
      },
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
      },
      delRow (data) {
        var vm = this;
        if(!data.id){
          vm.$Message.error('id获取失败')
          return
        }
        var parmas = {
          method: 'post',
          url: vm.url.delete,
          data: {
            ids: [data.id]
          }
        }
        vm.batchoperation(parmas,vm.paging)
      },
      batchDelete(){
        var vm = this
        vm.$Modal.confirm({
          title: '确认',
          content: '确认删除这些系统用户吗？请考虑清楚，谨慎操作！！！',
          onOk: function () {
            var parmas = {
              method: 'post',
              url: vm.url.delete,
              data: {
                ids: vm.batchIdArr
              }
            }
            vm.batchoperation(parmas)
          }
        })
      },
      batchoperation(parmas,refresh){
        var vm = this
        if(typeof parmas != 'object'){
          vm.$Message.error('传参错误')
          return
        }
        parmas.method = parmas.method || 'post'
        vm.$http2(parmas).then(res=>{
          var resData = res.data
          if(resData.code==1){
            vm.$Message.success('操作成功');
            vm.batchIdArr = []
            vm.paging()
          }else{
            vm.$Message.error(resData.message);
          }
        }).catch(err=>{})
      },
    },
    watch: {
      loginPass(val){
        var vm = this
        if(vm.currDialog == 'add'){
          // 添加用户是进行md5加密，编辑时不用
          vm.formDialog.loginPass = hex_md5(val)
        }else{
          vm.formDialog.loginPass = val
        }
      }
    }
  }
</script>
<style scoped>

</style>
