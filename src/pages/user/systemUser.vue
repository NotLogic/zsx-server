<template>
  <div class="systemUser">
    <div id="search-wrapper">
      <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <template v-if="hasPerm('systemUser:search')">
          <FormItem label="用户">
            <Input v-model="formSearch.key" placeholder="账号/昵称" size="small" @keydown.native.enter.prevent="submitSearch('formSearch')"></Input>
          </FormItem>
          <Button type="default" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" :disabled="pageLoading" size="small">{{label.clear}}</Button>
          <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" :disabled="pageLoading" size="small">{{label.search}}</Button>
        </template>
        <Button v-if="hasPerm('systemUser:add')" type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
        <Button v-if="hasPerm('systemUser:delete')" type="error" :disabled="batchIdArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchDelete" size="small">批量删除</Button>
      </Form>
    </div>

    <!-- <mainTable :columns="columns" :data="pager.data" @updateSelect="updateSelect" :height="tableHeight"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :current="pager.current"></paging> -->

    <main-table :columns="columns" :data="currentPager.data" @updateSelect="updateSelect" :height="tableHeight" :loading="pageLoading"></main-table>
    <paging @changePager="changePager" @paging="paging" :total="currentPager.total" :current="currentPager.current" :loading="pageLoading"></paging>

    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="账号" prop="loginName">
              <Input v-model="formDialog.loginName" placeholder="请输入账号" :disabled="currDialog=='edit'"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <Row>
              <Col :span="8" v-if="currDialog=='edit'">
                <FormItem label="修改密码">
                  <Select v-model="passType" placeholder="请选择" style="width: 100px;">
                    <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :span="passSpan" :offset="passSpan==24 ? 0 : 1" v-if="currDialog=='add' || currDialog=='edit' && passType=='1'">
                <FormItem label="密码" prop="loginPass">
                  <Input v-model="loginPass" placeholder="请输入密码" type="password"></Input>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="昵称" prop="nickName">
              <Input v-model="formDialog.nickName" placeholder="请输入账号"></Input>
            </FormItem>
          </Col>
          <Col span="12" v-if="currDialog=='add'">
            <FormItem label="角色" prop="roles">
              <Select v-model="roles" placeholder="请选择" multiple>
                <Option v-for="item in role" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="代理类型" prop="areaType">
              <Select v-model="formDialog.areaType" placeholder="请选择">
                <Option v-for="item in areaType" :key="item.value" :value="item.value">{{item.label}}</Option>
              </Select>
              </FormItem>
          </Col>
          <Col span="12" v-if="formDialog.areaType">
            <FormItem label="代理地区">
              <Cascader :data="derail_address_arr" v-model="derail_address_obj" placeholder="请选择地区" :clearabled="false" transfer></Cascader>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
    <!-- 查看角色 -->
    <Modal v-model="roleShow" title="角色" :mask-closable="false" width="300">
      <div v-for="(val,key) in roleMap" style="margin-bottom: 15px;">
        <span>{{val}}</span>
        <span style="float: right">
          <Button v-if="currRoles[key]" type="error" size='small' @click="resultRole('delete',currRoles[key])">{{label.delete}}</Button>
          <Button v-else size='small' type="primary" @click="resultRole('add',key)">{{label.add}}</Button>
        </span>
      </div>
      <div slot="footer">
        <Button @click="roleShow=false">{{label.close}}</Button>
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
          edit: 'web/sys/user/update',
          search: 'web/sys/user/search',
          role: 'web/sys/role/dataGrid',
          // 根据用户id查角色
          getRole: 'web/sys/user/role/search/user',
          bindRole: 'web/sys/user/role/add',
          deleteRole: 'web/sys/user/role/delete'
        },
        pager: {
          // 页面初始化
          url: 'web/sys/user/dataGrid',
          // 主区域表格数据
          data: [],
        },
        searchPager: {
          url: 'web/sys/user/search'
        },
        // 选择的id
        roles: [],
        role: [],
        roleMap: {},
        roleShow: false,
        // 当前查询用户的角色id、userRoleId——数据表对应的行id 
        currRoles: {},
        currUserId: '',
        batchIdArr: [],
        derail_address_arr: [],
        derail_address_obj: [1],
        typeMap:{
          "0":"否",
          "1":"是"
        },
        type:[
          {
            value: '0',
            label:"否"
          },
          {
            value: '1',
            label:"是"
          }
        ],
        // 搜索表单
        formSearch: {
          key: ''
        },
        loginPass: '',
        passType:"0",
        // 新增/编辑表单
        formDialog: {
          id: '',
          loginName: '',
          loginPass: '',
          nickName: '',
          areaType: 0,
          areaCode: 0,
        },
        areaType: [
          {
            value: 0,
            label: '非代理商'
          }, {
            value: 1,
            label: '全国'
          }, {
            value: 2,
            label: '省级'
          }, {
            value: 3,
            label: '市级'
          }, {
            value: 4,
            label: '区级'
          }
        ],
        chinaJson: {},
        provinceData: [],
        cityData: [],
        areaData: [],
        countryData: [{label: "中国", value: 1, children: []}],
        columns: [
          {
            "type": 'selection',
            "fixed": 'left',
            "width": 80,
            "align": 'center'
          },
          //  {
          //   title: 'ID',
          //   key: 'id',
          //   sortable: true,
          // },
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
            title: '代理地区',
            key: 'areaCode',
            sortable: true,
            render:(create,params)=>{
              var vm = this,arr=[]
              var map = {
                1: '', 2: ' (省)', 3: ' (市)', 4: ' (区)'
              }
              var txt = ''
              var areaCode=params.row.areaCode
              var areaType=params.row.areaType
              if(areaType==0){
                txt = '非代理用户'
              }else if(areaType==1){
                txt = '全国'
              }else{
                if(areaType==2){
                  var provincesId=areaCode;
                  arr = [provincesId]
                }else if(areaType==3){
                    var provincesId = parseInt(areaCode/10000)*10000;
                    var cityId=areaCode
                    arr = [provincesId,cityId]
                  }
                else if(areaType==4){
                    var provincesId = parseInt(areaCode/10000)*10000;
                    var cityId = parseInt(areaCode/100)*100
                    var areaId = areaCode
                    arr = [provincesId,cityId,areaId]   
                }
                txt = vm.util.getProvinceCityArea(arr,vm.chinaJson,true)
              }
              var _txt = map[areaType] ? map[areaType] : ''
              return create('span', txt + _txt)
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this,arr = []
              if(vm.hasPerm('systemUser:role')){
                arr.push(create('Button',{
                  props: {
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    'margin-right': '5px'
                  },
                  on: {
                    click: function(){
                      vm.previewPerm(params.row.id)
                    }
                  }
                },'角色'))
              }
              if(vm.hasPerm('systemUser:edit')){
                arr.push(vm.createEditBtn(create, params.row))
              }
              if(vm.hasPerm('systemUser:delete')){
                arr.push(vm.createDelBtn(create, params.row.id))
              }
              return create('div',arr)
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
      submitDialogForm (name) {
        let vm = this
        vm.$refs[name].validate(function (valid) {
          if (valid) {
            if (vm.initPostDialog) {
              vm.initPostDialog(vm.formDialog)
            }
            var pager = vm.pager,currDialog=vm.currDialog
            let ajaxUrl = vm.url[currDialog]
            if(vm.currDialog=='edit'){
              ajaxUrl += '?type=' + vm.passType
            }
            var method =  pager.method
            if(currDialog=='add' && typeof pager.addMethod != 'undefined'){
              method = pager.addMethod
            }
            if(currDialog=='edit' && typeof pager.editMethod != 'undefined'){
              method = pager.editMethod
            }
            let ajaxData = vm.editAddAjaxData(vm.currDialog)          
            var params = {
              url: ajaxUrl,
              method: method,
            }
            if(method=='get'|| method=='delete'){
              params.params = ajaxData
            }else{
              params.data = ajaxData
            }
            vm.dialogSubmitLoading = true
            vm.$http(params).then(res => {
              vm.dialogSubmitLoading = false
              var resData = res.data
              if(resData.code==1){
                vm.$Message.success(vm.label[vm.currDialog]+'成功!')
                if(vm.currDialog=='add'){
                  vm.paging(1);
                }else{
                  vm.paging();
                }
                vm.dialogShow = false
                if(typeof vm.resetDialogForm == 'function'){
                  vm.resetDialogForm(name)
                }
                // 新增/编辑数据后更新某些数据
                if(typeof vm.updateOther == 'function'){
                  vm.updateOther()
                }
              }else{
                vm.$Message.error(vm.label[vm.currDialog]+'失败: ' + resData.message)
              }
            }).catch(err=>{
      
            })
          }
        })
      },
      updateSelect(selection){
        var vm = this,batchIdArr = [],len=selection.length;
        if(len){
          for(var i=0;i<len;i++){
            batchIdArr.push(selection[i].id)
          }
        }
        vm.batchIdArr = batchIdArr
      },
      // 查看角色
      previewPerm(id){
        var vm=this
        vm.currUserId = id
        var params = {
          url: vm.url.getRole,
          method: 'post',
          data:{
            id: id
          }
        }
        vm.$http2(params).then(res=>{
          if(res&&res.data){
            var resData = res.data
            if(resData.code==1){
              var roles = resData.data.roles,currRoles={},i
              for(i=0;i<roles.length;i++){
                currRoles[roles[i].id] = roles[i].userRoleId
              }
              vm.currRoles = currRoles
            }
          }
          vm.roleShow = true
        })
      },
      resultRole(addOrDelete,id){
        var vm = this
        var isAdd = !!(addOrDelete == 'add')
        vm.$Modal.confirm({
          title: '确定操作',
          content: '确定' + (isAdd ? '添加' : '删除') + '这个角色吗？',
          onOk: function(){
            var url = isAdd ? vm.url.bindRole : vm.url.deleteRole
            var method = isAdd ? 'post' : 'delete'
            var ajaxData = isAdd ? {
              roleId: id,
              sysUserId: vm.currUserId
            } : {
              id: id
            }
            var params = {
              url: url,
              method: method
            }
            if(method=='get' || method=='delete'){
              params.params = ajaxData
            }else{
              params.data = ajaxData
            }
            vm.$http(params).then(res=>{
              if(res&&res.data){
                var resData = res.data
                if(resData.code==1){
                  vm.$Message.success((isAdd? '新增' : '删除') + '成功')
                  vm.previewPerm(vm.currUserId)
                }
              }
            })
          }
        })
      },
      // 重置搜索表单
      resetSearch(name){
        name = name || 'formSearch'
        var vm = this
        vm.$refs[name].resetFields()
        vm.paging(1)
      },
      resetDialogForm (name) {
        name = name || 'formDialog'
        let vm = this
        vm.formDialog.areaType=0
        vm.passType='0'
        vm.derail_address_arr = vm.countryData 
        vm.formDialog.id=''
        vm.formDialog.nickName = ''
        vm.formDialog.loginName = ''
        vm.roles = []
        vm.loginPass = ''
        // vm.$refs[name].resetFields()
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
      initRole(){
        var vm = this
        var params = {
          url: vm.url.role,
          method: 'get'
        }
        vm.$http2(params).then(res=>{
          if(res&&res.status==200){
            var data = res.data&&res.data.records || [],role=[],item,roleMap={}
            for(var i=0;i<data.length;i++){
              item=data[i]
              role.push({
                value: item.id,
                label: item.roleName || item.roleValue
              })
              roleMap[item.id] = item.roleName || item.roleValue
            }
            vm.role = role
            vm.roleMap = roleMap
          }
        })
      },
      initDialog(data){
        var vm=this,arr = []
        var areaType=data.areaType
        var areaCode=data.areaCode
        vm.passType="0"
        if(areaType==1){
          arr=[1]
        }else if (areaType==2){
          var provincesId=parseInt(areaCode/10000)*10000
          arr=[provincesId]
        }else if(areaType==3){
          var provincesId=parseInt(areaCode/10000)*10000
          var cityId=parseInt(areaCode/100)*100
          arr=[provincesId,cityId]
        }else{
          var provincesId=parseInt(areaCode/10000)*10000
          var cityId=parseInt(areaCode/100)*100
          var areaId=areaCode
          arr=[provincesId,cityId,areaId]
        }
        vm.$nextTick(function(){
          vm.derail_address_obj = arr
        })
      },
      initData () {
        let vm = this
        vm.initRole()
        if(sessionStorage.chinaData){
          var chinaData = JSON.parse(sessionStorage.chinaData)
          vm.chinaJson = JSON.parse(sessionStorage.chinaJson)
          vm.areaData = chinaData
          vm.cityData = vm.util.getCityDataByData(chinaData)
          vm.provinceData = vm.util.getProvinceDataByData(chinaData)
          vm.derail_address_arr = vm.countryData
        }
      }
    },
    computed:{
      passSpan(){
        return this.currDialog=='add' ? 24 : 15
      }
    },
    watch: {
      loginPass(val){
        var vm = this
        if(vm.currDialog == 'add'&&val||vm.passType=="1"){
          // 添加用户是进行md5加密，编辑时不用
          vm.formDialog.loginPass = hex_md5(val)
        }else{
           vm.formDialog.loginPass = val
          }
      },
      roles(val){
        var len = val.length,i,arr=[]
        for(i=0;i<len;i++){
          arr.push({
            id: val[i]
          })
        }
        this.formDialog.roles = arr
      },
      derail_address_obj (val) {
        var vm = this,len= val.length
        if(len){
          vm.formDialog.areaCode = val[len-1]
        }else{
          vm.formDialog.areaCode = ''
        }
      },
      'formDialog.areaType': function(val) {
        let vm = this
        if(val==0){
          vm.formDialog.areaCode = 0
        }else if (val==1) {
          vm.derail_address_arr = vm.countryData
          vm.derail_address_obj = [1]
        }else{
          if (val==2) {
            vm.derail_address_arr = vm.provinceData
          } else if (val==3) {
            vm.derail_address_arr = vm.cityData
          } else if (val==4) {
            vm.derail_address_arr = vm.areaData
          }
          vm.derail_address_obj = [] 
        }
      },
    }
  }
</script>
<style scoped>

</style>
