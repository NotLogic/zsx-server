<template>
  <div class="role">    
    <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="角色名称" prop="name">
              <Input v-model="formDialog.name" placeholder="请输入角色名称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="排序" prop="seq">
              <InputNumber :min="0" v-model="formDialog.seq"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem label="描述" prop="description">
              <Input type="textarea" v-model="formDialog.description" placeholder="请输入描述" :rows="3"></Input>
          </FormItem>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">清空</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">提交</Button>
      </div>
    </Modal>
    <!-- 授权弹窗 -->
    <Modal v-model="grantShow" title="授权" :mask-closable="false" width="550" @on-cancel="resetGrantForm('grantDialog')">
      <Form :model="grantDialog" ref="grantDialog" :rules="rules">
        <!-- 在组件中操作时会修改从父组件传过去的数据，暂时没有想到解决办法，所以先不做成组件 -->
        <!-- <access-tree style="max-height: 400px;overflow:auto;" :treeData="treeData" :loadDataFn="loadTreeData"></access-tree> -->
        <Tree :data="treeData" :load-data="loadDataFn" show-checkbox empty-text="加载数据中..." @on-check-change="treeCheckChange"></Tree>
      </Form>
      <div slot="footer">
        <template v-if="treeData.length">
          <Button @click="treeExpand">{{opened ? "折叠" : "展开"}}</Button>
          <Button type="primary" @click="treeCheckAll">{{selectAll ? "清空" : "全选"}}</Button>
          <Button type="primary" @click="treeToggle">反选</Button>
        </template>
        <Button type="primary" @click="submitGrantForm('grantDialog')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import accessTree from '@/components/tree'
  import {appRoutes} from '@/router/routes'
  import page from '@/mixins/page'
  export default {
    name: 'role',
    components: {
      mainTable,
      accessTree
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'role/add.do',
          edit: 'role/edit.do',
          delete: 'role/delete.do'
        },
        pager: {
          data: [
            {
              id: '1',
              name: 'admin',
              seq: 0,
              description: '超级管理员'
            }, {
              id: '35',
              name: '网编',
              seq: 0,
              description: '网编角色'
            }, {
              id: '36',
              name: '前端开发',
              seq: 0,
              description: '前端web开发角色'
            }
          ],
          url: 'role/dataGrid.do'
        },
        treeCheckNodeArr: [],
        treeData: [],
        opened: false,
        selectAll: false,
        grantShow: false,
        formDialog: {
          id: '',
          name: '',
          seq: 0,
          description: ''
        },
        grantDialog: {},
        columns: [
          {
            'title': 'id',
            'key': 'id',
            'sortable': true
          }, {
            'title': '名称',
            'key': 'name',
            'sortable': true
          }, {
            'title': '序号',
            'key': 'seq',
            'sortable': true
          }, {
            'title': '描述',
            'key': 'description',
            'sortable': true
          }, {
            'title': '操作',
            'key': 'action',
            'align': 'center',
            'fixed': 'right',
            width: 200,
            render: (create, params) => {
              let vm = this
              let btnArr = []
              if (params.row.id === '1') {
                btnArr = [vm.createEditBtn(create, params.row)]
              } else {
                btnArr = [
                  create('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        // vm.loadTreeData(params.row.id)
                        // vm.getTreeDataByAppRoutes()
                        // vm.selectAll = vm.checkSelectAll() ? true : false
                        vm.grantShow = true
                      }
                    }
                  }, '授权'),
                  vm.createEditBtn(create, params.row),
                  vm.createDelBtn(create, params.row.id)
                ]
              }
              return create('div', btnArr)
            }
          }
        ],
        rules: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      resetDialogForm (name) {
        this.$refs[name].resetFields()
      },
      // 展开/折叠
      treeExpand () {
        let vm = this
        vm.treeData.forEach((item, index) => {
          item.expand = vm.opened ? false : true
        })
        vm.opened = !this.opened
      },
      // 检查是否全选
      checkSelectAll () {
        let vm = this
        for (let i = 0; i < vm.treeData.length; i++) {
          if (!vm.treeData[i].checked) {
            return false
          }
          for (let k = 0; k < vm.treeData[i].children.length; k++) {
            if (!vm.treeData[i].children[k].checked) {
              return false
            }
            return true
          }
        }
      },
      // 选中/取消全部
      treeCheckAll () {
        let vm = this
        vm.treeData.forEach((item, index) => {
          item.checked = vm.selectAll ? false : true
          item.children.forEach(item => {
            item.checked = vm.selectAll ? false : true
          })
        })
        vm.selectAll = !vm.selectAll
      },
      // 反选
      treeToggle () {
        let vm = this
        vm.treeData.forEach((item, index) => {
          item.checked = !item.checked
          item.children.forEach(item => {
            item.checked = !item.checked
          })
        })
        vm.selectAll = vm.checkSelectAll() ? true : false
      },
      loadTreeData (roleId) {
       
      },
      resetGrantForm (name) {
        this.treeData = []
      },
      submitGrantForm (name) {
        let vm = this
        if (vm.treeData.length) {

        } else {
          vm.grantShow = false
        }
      },
      getTreeDataByAppRoutes () {
        let _appRoutes = this.util.extend(appRoutes)
        let treeData = []
        _appRoutes.forEach((item, index) => {
          treeData.push({
            title: item.meta.title,
            name: item.name,
            access: item.meta.access,
            checked: !!item.meta.access,
            expand: false,
            children: []
          })
          if (item.children.length) {
            item.children.forEach(item => {
              treeData[index].children.push({
                title: item.meta.title,
                name: item.name,
                checked: !!item.meta.access,
                expand: false,
                access: item.meta.access
              })
            })
          }
        })
        this.treeData = treeData
      },
      // 权限树形相关
      // 异步加载treeData
      loadDataFn () {

      },
      treeCheckChange (treeCheckNodeArr) {
        let vm = this
        vm.selectAll = vm.checkSelectAll() ? true : false
        console.log('treeCheckNodeArr: ', treeCheckNodeArr)
        vm.treeCheckNodeArr = treeCheckNodeArr
      },
      initData () {}
    },
    computed: {},
    created () {},
    mounted () {
      // this.getTreeDataByAppRoutes()
    },
    watch: {}
  }
</script>
