<template>
  <div class="role">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      
      <!-- <Button type="default" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" :disabled="pageLoading" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" :disabled="pageLoading" size="small">{{label.search}}</Button> -->
      <Button v-if="hasPerm('role:add')" type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data" :loading="pageLoading"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :current="pager.current" :loading="pageLoading"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="角色编码" prop="roleValue">
              <Select v-if="currDialog=='edit'" v-model="formDialog.roleValue" placeholder="请选择">
                <Option v-for="item in role" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
              <Input v-else v-model="formDialog.roleValue" placeholder="请输入角色值"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="角色名称" prop="roleName">
              <Input v-model="formDialog.roleName" placeholder="请输入角色名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="角色描述" prop="roleDesc">
              <Input v-model="formDialog.roleDesc" placeholder="请输入角色描述"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>

    <!-- 查看权限 -->
    <Modal v-model="permShow" title="权限" @on-cancle="resetPerm">
      <!-- <p>
         <Checkbox
          :indeterminate="indeterminate"
          :value="checkAll"
          @click.prevent.native="handleCheckAll">全选</Checkbox>
      </p> -->
      <!-- <Tree ref="permTree" :data="permTreeData" show-checkbox @on-check-change="permCheckChange"></Tree> -->
      
      <p>
        <el-checkbox :indeterminate="indeterminate" v-model="checkAll" @change="handleCheckAll">全选</el-checkbox>
      </p>
      <el-tree
        :data="permTreeData"
        show-checkbox
        node-key="id"
        ref="permTree"
        @check-change="permCheckChange2"
        highlight-current>
      </el-tree>

      <div slot="footer">
        <Button @click="resetPerm()">清空</Button>
        <Button type="primary" @click="submitPerm()" :loading="permSubmitLoading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import page from '@/mixins/page'
  export default {
    name: 'role',
    mixins: [page],
    components: {
      mainTable,
      paging,
    },
    data(){
      return {
        url: {
          // 增删改查
          add: 'web/sys/role/add',
          delete: 'web/sys/role/delete',
          edit: 'web/sys/role/update',
          search: '',
          allRole: 'web/sys/role/dataAllGrid',
          // 根据角色id查权限
          perm: 'web/sys/role/perm/searchByRole',
          // 角色修改该权限 传选中的id数组，后端会先删除角色的权限，再新增此次传的所有id的权限
          addPerm: 'web/sys/role/perm/add',
          allPerm: 'web/sys/perm/dataAllGrid',
        },
        pager: {
          // 页面初始化
          url: 'web/sys/role/dataGrid',
          // 主区域表格数据
          data: [],
          method: 'get',
          addMethod: 'post',
          editMethod: 'post',
          deleteMethod: 'delete',
        },
        currRoleId: '',
        // 权限选择
        allPermIds: [],
        checkAll: false,
        indeterminate: false,
        permsArr: [], //选中的权限id数组
        permTreeData: [],
        permSubmitLoading:false,
        // 权限选择end
        needId: true,
        permShow: false,
        allPermData: [],
        permMap: {
          add: '添加',
          edit: '编辑',
          delete: '删除',
          search: '搜索',
          dataGrid: '列表',
        },
        // 搜索表单
        formSearch: {
          
        },
        // 新增/编辑表单
        formDialog: {
          id: '',
          roleName: ''
        },
        role: [],
        roleMap: {},
        columns: [
          // {
          //   title: 'ID',
          //   key: 'id',
          // },
          {
            title: '角色编码',
            key: 'roleValue',
          },
          {
            title: '角色名称',
            key: 'roleName',
          },
          {
            title: '角色描述',
            key: 'roleDesc',
          },
          {
            title: '创建时间',
            key: 'createTime',
          },
          {
            title: '修改时间',
            key: 'modifyTime',
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this,arr=[],permBtn = create('Button',{
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                  'margin-right': '5px'
                },
                on: {
                  click: function(){
                    var roleId = params.row.id
                    vm.currRoleId = roleId
                    vm.previewPerm(roleId)
                  }
                }
              },'权限')
              if(vm.hasPerm('role:perm')){
                arr.push(permBtn)
              }
              if(vm.hasPerm('role:edit')){
                arr.push(vm.createEditBtn(create, params.row))
              }
              if(vm.hasPerm('role:delete')){
                arr.push(vm.createDelBtn(create, params.row.id))
              }
              return create('div',arr)
            }
          },
        ],
        rules: {
          roleName: [
            { required: true, message: "角色名称不能为空", trigger: "blur" }
          ],
          roleValue: [
            { required: true, message: "角色值不能为空", trigger: "blur" }
          ]
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
      // 全选权限
      handleCheckAll(){
        var vm = this
        var len = vm.permsArr.length,len2=vm.allPermIds.length,_arr=[]
        if(len==len2){
          vm.checkAll = false
          _arr = []
        }else{
          vm.checkAll = true
          _arr = vm.allPermIds
        }
        vm.permsArr = _arr
        vm.$refs['permTree'].setCheckedKeys(_arr)
        vm.indeterminate = false
      },
      // 查看权限
      previewPerm(id){
        var vm=this
        var params = {
          url: vm.url.perm,
          method: 'post',
          data:{
            id: id
          }
        }
        vm.$http2(params).then(res=>{
          if(res&&res.data){
            var resData = res.data
            if(resData.code==1){
              var data = resData.data,arr=[]
              data.forEach(item=>{
                if(typeof item.permId != 'undefined'){
                  arr.push(item.permId)
                }
              })
              var len = arr.length,len2=vm.allPermIds.length
              if(len==len2){
                vm.checkAll = true
                vm.indeterminate = false
              }else if(len==0){
                vm.checkAll = false
                vm.indeterminate = false
              }else{
                vm.checkAll = false
                vm.indeterminate = true
              }
              vm.$refs['permTree'].setCheckedKeys(arr)
              vm.permsArr = arr
              vm.permShow = true
            }
          }
        })
      },
      // 权限选择变化
      permCheckChange(data){
        var idsArr=[]
        data.forEach(item=>{
          idsArr.push(item.id)
        })
        this.permsArr = idsArr
      },
      permCheckChange2(data){
        var vm = this,arr=[]
        arr = vm.$refs['permTree'].getCheckedKeys()
        var len = arr.length,len2=vm.allPermIds.length
        if(len==len2){
          vm.checkAll = true
          vm.indeterminate = false
        }else if(len==0){
          vm.checkAll = false
          vm.indeterminate = false
        }else{
          vm.checkAll = false
          vm.indeterminate = true
        }
        vm.permsArr = arr
      },
      resetPerm(){
        var vm = this
        vm.permsArr = []
        vm.$refs['permTree'].setCheckedKeys([])
      },
      // 提交选中权限
      submitPerm(){
        var vm = this
        var ajaxData = {
          roleId: vm.currRoleId,
          permIds: vm.permsArr
        }
        var params = {
          url: vm.url.addPerm,
          method: 'post',
          data: ajaxData
        }
        vm.permSubmitLoading = true
        vm.$http2(params).then(res=>{
          if(res&&res.status==200){
            var resData = res.data
            if(resData.code==1){
              vm.permSubmitLoading = false
              vm.$Message.success('权限修改成功！')
              vm.permShow = false
            }
          }
        })
      },
      initOther(data){
        if(!data) return
        var vm = this
        var item,len=data.length,i,role=[],roleMap={},arr=[]
        for(i=0;i<len;i++){
          item = data[i]
          arr.push(item.roleValue)
        }
        arr = Array.from(new Set(arr))
        for(i=0;i<arr.length;i++){
          role.push({
            value: arr[i],
            label: arr[i]
          })
        }
        // 对相同的value值怎么去处理
        vm.role = role
        // vm.roleMap = roleMap
      },
      resultPermData(data){
        var vm = this,arr=[],map={},parentMenuArr=[],childrenMenuArr=[],otherArr=[],allPermIds=[]
        // permType 1  菜单  2  按钮
        data.forEach(item=>{
          allPermIds.push(item.id)
          if(item.permType==1){
            if(item.isLeaf==0){
              parentMenuArr.push({
                id: item.id,
                permValue: item.permValue,
                permName: item.permName,
                title:item.permName,
                label:item.permName,
                parentValue: item.parentValue,
                parentName: item.parentName,
                children: []
              })
            }else{
              childrenMenuArr.push({
                id: item.id,
                permValue: item.permValue,
                permName: item.permName,
                title:item.permName,
                label:item.permName,
                parentValue: item.parentValue,
                parentName: item.parentName,
                children: []
              })
            }
          }else{
            otherArr.push({
              id: item.id,
              permValue: item.permValue,
              permName: item.permName,
              title:item.permName,
              label:item.permName,
              parentValue: item.parentValue,
              parentName: item.parentName,
              children: []
            })
          }
        })
        var treeData = [],treeChildrenData=[]
        childrenMenuArr.forEach(item=>{
          otherArr.forEach(child=>{
            if(child.parentValue==item.permValue){
              item.children.push(child)
            }
          })
        })
        parentMenuArr.forEach(item=>{
          childrenMenuArr.forEach(child=>{
            if(child.parentValue==item.permValue){
              item.children.push(child)
            }
          })
        })
        vm.allPermIds = allPermIds
        vm.permTreeData = parentMenuArr
      },
      initAllPerm(){
        var vm = this
        var params = {
          url: vm.url.allPerm,
          method: 'get'
        }
        vm.$http2(params).then(res=>{
          if(res&&res.status==200){
            var resData = res.data
            if(resData.code==1){
              var allPermData = resData.data
              vm.allPermData = allPermData
              vm.resultPermData(allPermData)
            }
          }
        })
      },
      initData(){
        this.initAllPerm()
      }
    }
  }
</script>
<style scoped>

</style>
