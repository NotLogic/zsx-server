<template>
  <div class="resource">
    <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
        <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
          <Row>
            <Col span="12">
              <FormItem label="资源名称" prop="name">
                <Input v-model="formDialog.name" placeholder="请输入资源名称"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="资源类型" prop="resourceType">                    	
                <Select v-model="formDialog.resourceType">
                  <Option v-for="item in resourceType" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="资源路径" prop="url">
                <Input v-model="formDialog.url"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="打开方式" prop="openMode">
                  <Select v-model="formDialog.openMode">
                    <Option v-for="item in openMode" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="菜单图标" prop="icon">
                <Input v-model="formDialog.icon"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="排序" prop="seq">
                <Input v-model="formDialog.seq"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="状态" prop="status">
                <Select v-model="formDialog.status">
                  <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="上级资源" prop="pid">
                <Select v-model="formDialog.pid">
                  <Option v-for="item in pid" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="权限" prop="permission">
                <Input v-model="formDialog.permission" placeholder="格式如下:upms:resource:add"></Input>
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
  import page from '@/mixins/page'
  export default {
    name: 'resource',
    components: {
      mainTable
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'resource/add.do',
          edit: 'resource/edit.do',
          delete: 'resource/delete.do'
        },
        pager: {
          data: [
            {
              id: '1',
              name: '权限管理',
              resourceType: '0',
              url: '',
              openMode: '',
              icon: '',
              level: '0',
              seq: 1,
              status: '1',
              opened: '1',
              pid: [],
              permission: '',
              children: [
                {
                  id: '11',
                  name: '资源管理',
                  resourceType: '0',
                  url: '/resource/main.do',
                  openMode: 'ajax',
                  icon: '',
                  level: '1',
                  seq: 1,
                  status: '1',
                  opened: '1',
                  pid: [],
                  permission: 'upms:resource:main',
                  children: [
                    {
                      id: '111',
                      name: '列表',
                      resourceType: '1',
                      url: '/resource/treeGrid.do',
                      openMode: 'ajax',
                      icon: '',
                      level: '2',
                      seq: 1,
                      status: '1',
                      opened: '1',
                      pid: [],
                      permission: 'upms:resource:treeGrid'
                    }, {
                      id: '112',
                      name: '添加',
                      resourceType: '1',
                      url: '/resource/add.do',
                      openMode: 'ajax',
                      icon: '',
                      level: '2',
                      seq: 1,
                      status: '1',
                      opened: '1',
                      pid: [],
                      permission: 'upms:resource:add'
                    }
                  ]
                }
              ]
            }, {
              id: '11',
              name: '资源管理',
              resourceType: '0',
              url: '/resource/main.do',
              openMode: 'ajax',
              icon: '',
              level: '1',
              seq: 1,
              status: '1',
              opened: '1',
              pid: [],
              permission: 'upms:resource:main'
            }, {
              id: '111',
              name: '列表',
              resourceType: '1',
              url: '/resource/treeGrid.do',
              openMode: 'ajax',
              icon: '',
              level: '2',
              seq: 1,
              status: '1',
              opened: '1',
              pid: [],
              permission: 'upms:resource:treeGrid'
            }, {
              id: '112',
              name: '添加',
              resourceType: '1',
              url: '/resource/add.do',
              openMode: 'ajax',
              icon: '',
              level: '2',
              seq: 1,
              status: '1',
              opened: '1',
              pid: [],
              permission: 'upms:resource:add'
            }, {
              id: '12',
              name: '角色管理',
              resourceType: '0',
              url: '/role/main.do',
              openMode: 'ajax',
              icon: '',
              level: '1',
              seq: 1,
              status: '1',
              opened: '1',
              pid: [],
              permission: 'upms:role:main'
            }, {
              id: '121',
              name: '列表',
              resourceType: '1',
              url: '/role/dataGrid.do',
              openMode: 'ajax',
              icon: '',
              level: '2',
              seq: 1,
              status: '1',
              opened: '1',
              pid: [],
              permission: 'upms:role:dataGrid'
            }, {
              id: '122',
              name: '添加',
              resourceType: '1',
              url: '/role/add.do',
              openMode: 'ajax',
              icon: '',
              level: '2',
              seq: 1,
              status: '1',
              opened: '1',
              pid: [],
              permission: 'upms:role:add'
            }, {
              id: '2',
              name: '会员管理',
              resourceType: '0',
              url: '',
              openMode: '',
              icon: '',
              seq: 1,
              level: '0',
              status: '1',
              opened: '1',
              pid: [],
              permission: ''
            }, {
              id: '3',
              name: '新闻管理',
              resourceType: '0',
              url: '',
              openMode: '',
              icon: '',
              seq: 1,
              level: '0',
              status: '1',
              opened: '1',
              pid: [],
              permission: ''
            }
          ],
          url: 'resource/treeGrid.do'
        },
        dialogShow: false,
        currDialog: 'add',
        dialogSubmitLoading: false,
        resourceType: [
          {
            value: '0',
            label: '菜单'
          },
          {
            value: '1',
            label: '按钮'
          }
        ],
        openMode: [
          {
            value: '',
            label: '无(用于上层菜单)'
          },
          {
            value: 'ajax',
            label: 'ajax'
          },
          {
            value: 'iframe',
            label: 'iframe'
          }
        ],
        status:[
          {
            value: '1',
            label: '正常'
          },
          {
            value: '2',
            label: '关闭'
          }
        ],
        opened: {
          '1': '打开',
          '2': '关闭'
        },
        pid: [{
          value: '',
          label: '',
          children: []
        }],
        formDialog: {
          id: '',
          name: '',
          resourceType: '',
          url: '',
          openMode: '',
          icon: '',
          seq: 1,
          status: '1',
          opened: '1',
          pid: [],
          permission: ''
        },
        columns: [
          {
            "title": "编号",
            "key": "id",
            'fixed': 'left',
            "width": 100
          },
          {
            "title": "资源名称",
            "key": "name",
            "width": 200,
            render: (create, params) => {
              var vm = this
              var icon = {
                  0: 'chevron-right',
                  1: 'ios-arrow-forward',
                  2: 'ios-arrow-right'
              }
              // params.row.level  菜单级别 0 1 2 
              let leftNum = params.row.level * 20
              return  create('Button', {
                props: {
                  type: 'text',
                  icon: icon[params.row.level]
                },
                style: {
                  marginLeft: leftNum + 'px'
                },
                on: {
                  click: function () {
                      vm.editRow(params.row)
                  }
                }
              }, params.row.name)
            }
          },
          {
            "title": "资源路径",
            "key": "url",
            "width": 200
          },
          {
            "title": "权限",
            "key": "permission",
            "width": 200
          },
          {
            "title": "状态",
            "key": "status",
            "width": 100,
            render: function (create, params) {
              var map = {
                1: '正常',
                2: '停用'
              }
              return create('span', map[params.row.status]);
            }
          },
          {
            "title": "打开方式",
            "key": "openMode",
            "width": 100
          },
          {
            "title": "资源类型",
            "key": "resourceType",
            "width": 120,
            render: function (create, params) {
              var map = {
                '0': '菜单',
                '1': '按钮'
              }
              return create('span', map[params.row.resourceType])
            }
          },
          {
            "title": "图标",
            "key": "iconCls",
            "width": 150
          },
          {
            "title": "排序",
            "key": "seq",
            // "width": 100
          },
          {
            'title': '操作',
            'key': 'action',
            'width': 140,
            'align': 'center',
            'fixed': 'right',
            render: (create, params) => {
              let vm = this
              //若为顶级菜单，则无删除，编辑操作
              // if(params.row.pid==0){
              //   return
              // }
              return create('div', [
                vm.createEditBtn(create, params.row),
                vm.createDelBtn(create, params.row)
              ])
            }
          }
        ],
        rules: {
          name: [
            { required: true, message: '资源名称不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '状态不能为空', trigger: 'change' }
          ],
          open: [
            { required: true, message: '打开方式不能为空', trigger: 'change' }
          ],
          // pid: [
          //   { required: true, message: '上级资源不能为空', trigger: 'change' }
          // ],
          // url: [
          //   { required: true, message: '资源路径不能为空', trigger: 'change' }
          // ],
          resourceType:[
            { required: true, message: '资源类型不能为空', trigger: 'change' }
          ],
          opened:[
            { required: true, message: '菜单状态不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      // 直接对data进行修改，不用返回值
      initDialog (data) {
        
      },
      resetDialogForm (name) {
        let vm = this
        vm.$refs[name].resetFields()
      },
      initData () {},
      delResult (data) {
        let vm = this
        let ajaxData = null
        let idArr = vm.getIdArrFromData(data)
        if (idArr.length === 1) {
          ajaxData = idArr[0]
        } else{
          ajaxData = idArr
        }
        return ajaxData
      },
      getIdArrFromData (data,arr) {
        let vm = this
        let newArr = arr || []
        if (data.id) {
          newArr.push(data.id)
          if (data.children && data.children.length) {
            data.children.forEach(item=>{
              vm.getIdArrFromData(item, newArr)
            })
          }
        }
        return newArr
      },
      // 页面数据更新时处理返回数据
      pagerResult (result) {
        // 更新上级资源内容
        let arr = []
        var _data = this.util.genTreeData(this.util.extend(result))
        // 更新树形下拉菜单数据
        this.pid = this.util.formatSelectData(_data.flat);
        arr = _data.flat
        return arr
      }
    },
    created () {},
    mounted () {
      this.pagerResult(this.pager.data)
    },
    computed: {},
    watch: {}
  }
</script>
