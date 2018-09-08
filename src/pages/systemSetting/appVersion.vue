<template>
  <div class="app-version">
    <Form :model="formSearch" ref="formSearch" inline :label-width="80">
        
      <!-- <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" :disabled="pageLoading" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" :disabled="pageLoading" size="small">{{label.search}}</Button> -->
      <Button v-if="hasPerm('appVersion:add')" type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data" :loading="pageLoading"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :current="pager.current" :loading="pageLoading"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="90">
        <Row>
          <Col span="12">
            <FormItem label="服务器版本" prop="serverVersion">
              <Input type="text" v-model="formDialog.serverVersion" placeholder="请输入服务器版本"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="APP版本" prop="appVersion">
              <Input type="text" v-model="formDialog.appVersion" placeholder="请输入APP版本"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem  label="手机类型" prop="appType">
              <Select v-model="formDialog.appType">
               <Option v-for="item in appTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem  label="是否在用" prop="isNow">
              <Select v-model="formDialog.isNow" transfer>
               <Option v-for="item in isNowList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
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
    name: 'appVersion',
    mixins: [page],
    components: {
      mainTable,
      paging,
    },
    data(){
      return {
        url: {
          // 增删改查
          add: 'web/appversion/add',
          delete: 'web/appversion/delete',
          edit: 'web/appversion/update',
          search: 'web/appversion/dataSearch',
        },
        pager: {
          // 页面初始化
          url: 'web/appversion/dataGrid',
          // 主区域表格数据
          data: [],
          method: 'get',
          addMethod: 'post',
          editMethod: 'post',
          deleteMethod: 'delete',
          // searchMethod: '',
        },
        // 搜索表单
        formSearch: {

        },
        // 新增/编辑表单
        formDialog: {
          id: "",
          serverVersion:"",
          appVersion:"",
          appType:"",
          isNow:""
        },
        columns: [
        // {
        //   title: "id",
        //   key: "id",
        //   sortable: true
        // },
        {
          title: "服务器版本",
          key: "serverVersion",
          sortable: true
        },
        {
          title: "APP版本",
          key: "appVersion",
          sortable: true
        },
        {
          title: "手机端类型",
          key: "appType",
          sortable: true,
          render:(create,params)=>{
              var appType = params.row.appType ? params.row.appType : ''
              return create('span',this.appTypeMap[appType])
            }
        },
        {
          title: "是否在用",
          key: "isNow",
          sortable: true,
          render: (create, params) => {
              var row = params.row.isNow,map=this.isNowMap
              var key = row.toString()
              var txt = map[key] ? map[key] : key
              return create('span', txt);
            }
        },
        {
          title:"操作",
          key: "action",
          align: "center",
          width: 200,
          fixed: "right",
          render:(create,params)=>{
            let vm = this,arr=[]
            if(vm.hasPerm('appVersion:edit')){
              arr.push(vm.createEditBtn(create, params.row))
            }
            if(vm.hasPerm('appVersion:delete')){
              arr.push(vm.createDelBtn(create, params.row.id))
            }
            return create('div', arr)
          }
        }
        ],
        rules: {
         serverVersion:[{required: true, message: '服务器版本不能为空', trigger: 'blur' }],
         appVersion:[{required:true,message:'客户端版本不能为空',trigger:'blur'}],
        },
        appTypeMap:{
          "1":"Ios",
          "2":"Android"
        },
        isNowMap:{
          "1":"使用中",
          "0":"停用"
        },
        appTypeList:[
          {
            value:1,
            label:"IOS"
          },
          {
            value:2,
            label:"Android"
          }
        ],
        appTypeListMap:{
          1:"IOS",
          2:"Android"
        },
        isNowList:[
          {
            value:0,
            label:"停用"
          },
          {
            value:1,
            label:"使用中"
          }
        ],
        isNowListMap:{
          1:"使用中",
          0:"停用"
        }
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
      },
      
    }
  }
</script>
<style scoped>

</style>
