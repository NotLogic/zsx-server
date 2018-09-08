<template>
  <div class="authority">
    <Form :model="formSearch" ref="formSearch" inline :label-width="80">
      <template v-if="hasPerm('authority_index:search')">
        <FormItem label="权限编码" prop="permValue">
          <Input v-model="formSearch.permValue" placeholder="权限编码" size="small" @keydown.native.enter.prevent="submitSearch('formSearch')"></Input>
        </FormItem>
        <FormItem label="父权限编码" prop="parentValue">
          <Input v-model="formSearch.parentValue" placeholder="父权限编码" size="small" @keydown.native.enter.prevent="submitSearch('formSearch')"></Input>
        </FormItem>
        <Button type="default" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" :disabled="pageLoading" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" :disabled="pageLoading" size="small">{{label.search}}</Button>
      </template>
      <Button v-if="hasPerm('authority_index:add')" type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    
    <!-- <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :current="pager.current"></paging> -->

    <main-table :columns="columns" :data="currentPager.data" :loading="pageLoading"></main-table>
    <paging @changePager="changePager" @paging="paging" :total="currentPager.total" :current="currentPager.current" :loading="pageLoading"></paging>

    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" @on-cancel="resetDialogForm('formDialog')" width="800">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="90">
        <!-- <div style="margin-bottom:20px;">
          <p>权限说明：</p>
          <p style="text-indent:24px;">权限类型为“菜单”时：如果该菜单是父级菜单选择“不是”子节点，权限值填写此菜单（路由跳转）的name值；如果选择“是”子节点，权限值填写为子菜单（路由跳转）的name值，父权限值填写子菜单对应的父级菜单的name值</p>
          <p style="text-indent:24px;">权限类型为“按钮”时：权限值填写“pageRouterName: add/edit/delete/search/dataGrid”，所属页面的路由name值——和菜单name值对应，增删改查以及列表权限，如果有其他的另说；父权限值填写为页面父级菜单的name值</p>
          <p style="text-indent:24px;"></p>
          <p style="text-indent:24px;"></p>
        </div> -->
        <Row>
          <Col span="12">
            <FormItem label="权限类型" prop="permType">
              <Select  v-model="formDialog.permType" placeholder="请选择">
                <Option v-for="item in permType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="是否子节点" prop="isLeaf">
              <Select  v-model="formDialog.isLeaf" placeholder="请选择" :disabled="formDialog.permType==2">
                <Option v-for="item in isLeaf" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="权限编码" prop="permValue">
              <Input v-model="formDialog.permValue" :placeholder="formDialog.isLeaf=='0' ? '' : 'childRouterName:add'"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="权限介绍" prop="permName">
              <Input v-model="formDialog.permName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="父权限编码" prop="parentValue">
              <Input v-model="formDialog.parentValue" :disabled="formDialog.isLeaf == '0'" :placeholder="formDialog.isLeaf == '0' ? '' : 'parentRouterName'"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="父权限介绍" prop="parentName">
              <Input v-model="formDialog.parentName" :disabled="formDialog.isLeaf == '0'"></Input>
            </FormItem>
          </Col>
        </Row>
        <!-- <Row v-if="formDialog.permType==1">
          <Col span="12">
            <FormItem label="菜单小图标" prop="icon">
              <Input v-model="formDialog.icon" placeholder="iview图标库"></Input>
            </FormItem>
          </Col>
        </Row> -->
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
    name: 'authority',
    mixins: [page],
    components: {
      mainTable,
      paging,
    },
    data(){
      return {
        url: {
          // 增删改查
          add: 'web/sys/perm/add',
          delete: 'web/sys/perm/delete',
          edit: 'web/sys/perm/update',
          search: 'web/sys/perm/search',
          all: 'web/sys/perm/dataAllGrid'
        },
        pager: {
          // 页面初始化
          url: 'web/sys/perm/dataGrid',
          // 主区域表格数据
          data: [],
          method: 'get',
          addMethod: 'post',
          editMethod: 'post',
          deleteMethod: 'delete',
        },
        searchPager: {
          url: 'web/sys/perm/search'
        },
        permType: [
          {
            value: 1,
            label: '菜单'
          },
          {
            value: 2,
            label: '按钮'
          },
          {
            value: 3,
            label: '接口'
          },
          {
            value: 4,
            label: '特殊'
          }
        ],
        permTypeMap: {
          1: '菜单',
          2: '按钮',
          3: '接口',
          4: '特殊',
        },
        isLeaf: [
          {
            value: '0',
            label: '不是'
          },
          {
            value: '1',
            label: '是'
          }
        ],
        isLeafMap: {
          '0': '不是',
          '1': '是'
        },
        // 搜索表单
        formSearch: {
          permValue: '',
          parentValue: ''
        },
        // 新增/编辑表单
        formDialog: {
          id: '',
          permValue: '',
          parentValue: '',
          permType: '',
          isLeaf: '',
          permName: '',
          parentName: '',
          // icon: ''
        },
        columns: [
          // {
          //   title: 'ID',
          //   key: 'id',
          // },
          {
            title: '权限类型',
            key: 'permType',
            render: (create, params) => {
              var key = params.row.permType,map=this.permTypeMap
              var txt = map[key] ? map[key] : key
              return create('span',txt)
            }
          },
          {
            title: '是否子节点',
            key: 'isLeaf',
            render: (create, params) => {
              var key = params.row.isLeaf,map=this.isLeafMap
              var txt = map[key] ? map[key] : key
              return create('span',txt)
            }
          },
          {
            title: '权限编码',
            key: 'permValue',
            // render: function(create,params){
            //   var val = params.row.permValue,val2=params.row.permName
            //   return create('span',val + '   ' + val2)
            // }
          },
          {
            title: '权限介绍',
            key: 'permName',
          },
          {
            title: '父权限编码',
            key: 'parentValue',
            // render: function(create,params){
            //   var val = params.row.parentValue,val2=params.row.parentName
            //   return create('span',val + val2)
            // }
          },
          {
            title: '父权限介绍',
            key: 'parentName',
          },
          {
            title: '创建时间',
            key: 'createTime',
          },
          // {
          //   title: '修改时间',
          //   key: 'modifyTime',
          // },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this,arr=[]
              if(vm.hasPerm('authority_index:edit')){
                arr.push(vm.createEditBtn(create, params.row))
              }
              if(vm.hasPerm('authority_index:delete')){
                arr.push(vm.createDelBtn(create, params.row.id))
              }
              return create('div',arr)
            }
          },
        ],
        rules: {
          // permType: [
          //   { required: true, message: "权限类型不能为空", trigger: "blur" }
          // ],
          permValue: [
            { required: true, message: "权限值不能为空", trigger: "blur" }
          ],
          // isLeaf: [
          //   { required: true, message: "是否子节点不能为空", trigger: "blur" }
          // ]
        }
      }
    },
    methods: {
      // 重置搜索表单
      resetSearch(name){
        name = name || 'formSearch'
        var vm = this
        vm.$refs[name].resetFields()
        // vm.submitSearch(name)
        vm.isSearchStatus = false
        vm.paging(1)
      },
      // 重置新增/编辑表单
      resetDialogForm(name){
        name = name || 'formDialog'
        var vm = this
        vm.$refs[name].resetFields()
      },
      paging (data) {
        let vm = this,config={},requestUrl=''
        // 对象类型的传参为修改此次请求的config;  number类型的传参为翻页翻到第几页
        if(typeof data == 'object'){
          config = data
        }else if (Number(data)) {
          vm.changePager(data)
          return
        }
        vm.pageLoading = true
        var pager = {},method='post',ajaxData = {},params={}
        // 搜索和列表共用分页，通过状态判断是搜索翻页还是列表翻页  点击搜索进入搜索状态，点击清空退出搜索状态
        if(vm.isSearchStatus){
          // 是搜索
          pager = vm.searchPager
          method = pager.method || (typeof(vm.pager.searchMethod) != 'undefined' ? vm.pager.searchMethod : method)
          var _ajaxData = vm.pagingFiltData(pager),formSearch=vm.formSearch
          // var _formSearch={sysPerm:{}}
          var _formSearch={}
          requestUrl = pager.url + '?current=' + _ajaxData.current + '&size=' + _ajaxData.size
          // for(let key in _ajaxData){
          //   _formSearch[key] = _ajaxData[key]
          // }
          for(let key in formSearch){
            if(formSearch[key] != ''){
              // _formSearch.sysPerm[key] = formSearch[key]
              _formSearch[key] = formSearch[key]
            }
          }
          ajaxData = _formSearch
        }else{
          // 不是搜索
          pager = vm.pager
          requestUrl = pager.url
          method = pager.method || method
          ajaxData = vm.pagingFiltData(pager)
        }
        params = {
          // url: pager.url,
          url: requestUrl,
          method: method,
        }
        if(method=='get'){
          params.params = ajaxData
        }else{
          params.data = ajaxData
        }
        (function(){
          if(vm.isSearchStatus){
            return vm.$http(params,config)
          }else{
            return vm.$http2(params,config)
          }
        })().then(res => {
          let resData = res.data,data=[],total=0
          vm.pageLoading = false
          if(resData.records){
            data = resData.records
            total = resData.total
          }else if (resData.code == 1) {
            if(resData.data && typeof(resData.data.records) != 'undefined'){
              data = resData.data.records
              total = resData.data.total
            }else if(resData.data){
              data = resData.data
              total = resData.total
            }
          }
          if(!data)data=[]
          if(!total)total=0
          if (typeof vm.pagerResult == 'function') {
            // 返回数据预处理
            resData.data = vm.pagerResult(data)
          }
          if(typeof vm.initOther == 'function'){
            vm.initOther(data)
          }
          setTimeout(function(){
            pager.total = total
            pager.data = data
            typeof vm.searchPager == 'undefined' ? vm.pager = pager : vm.currentPager = pager
            // vm.pager = pager
            // vm.currentPager = pager
          },50)
        }).catch(err=>{})
      },
      initDialog(data){
        this.formDialog.isLeaf = data.isLeaf.toString()
      },
    },
    watch: {
      'formDialog.permType': function(val){
        var vm = this
        if(val == 1){
          // 菜单
          // vm.formDialog.isLeaf = '0'
        }else if(val==2){
          // 按钮
          vm.formDialog.isLeaf = '1'
        }
        // vm.formDialog.icon = ''
        // 下边的代码会导致回显异常
        // else{
        //   vm.formDialog.isLeaf = ''
        // }
      },
      'formDialog.isLeaf': function(val){
        var vm = this
        // 会导致回显异常
        // if(vm.formDialog.permType==1){
        //   vm.formDialog.parentValue = '0'
        // }
        // 下边的代码会导致回显异常
        // else{
        //   vm.formDialog.parentValue = ''
        // }
      }
    }
  }
</script>
<style scoped>

</style>
