<template>
  <div class="user">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="用户">
            <Input v-model="formSearch.name" placeholder="姓名/账号/手机号" size="small"></Input>
        </FormItem>
        <FormItem label="管理区域">
            <Cascader :data="derail_address_arr" v-model="derail_address_obj_s" filterable size="small" style="margin-top: 5px"></Cascader>
        </FormItem>
        <FormItem label="创建时间">
            <FormItem prop="createdateStart">
                <DatePicker type="datetime" placeholder="点击选择时间" style="width: 160px;" v-model="formSearch.createdateStart" size="small" :clearable="false"></DatePicker>
            </FormItem>
            <FormItem>至</FormItem>
            <FormItem prop="createdateEnd">
                <DatePicker type="datetime" placeholder="点击选择时间" style="width: 160px;" v-model="formSearch.createdateEnd" size="small" :clearable="false"></DatePicker>
            </FormItem>
        </FormItem>
        <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="672"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="登录名" prop="loginName">
                <Input v-model="formDialog.loginName" placeholder="请输入登录名称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="姓名" prop="name">
                <Input v-model="formDialog.name" placeholder="请输入姓名"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="密码" prop="password">
                <Input v-model="formDialog.password" placeholder="请输入密码" type="password"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="性别" prop="sex">
                <Select v-model="formDialog.sex">
                    <Option v-for="item in sex" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="用户状态" prop="status">
                <Select v-model="formDialog.status">
                  <Option v-for="item in userStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
          <Col span="12">
              <FormItem label="电话" prop="phone">
                <Input v-model="formDialog.phone"></Input>
              </FormItem>
          </Col>
        </Row>
        <Row>                 
          <Col span="12">
            <FormItem label="角色" prop="roleIds">                        
              <Select v-model="formDialog.roleIds" multiple>
                <Option v-for="item in roleIds" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
    name: 'user',
    components: {
      mainTable,
      paging
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'user/add.do',
          edit: 'user/edit.do',
          delete: 'user/delete.do'
        },
        pager: {
          data: [
            {
              id: '123123213',
              loginName: 'xiayy',
              name: '夏洋洋',
              password: 'reterterwt',
              sex: '1',
              age: 22,
              roleIds: [],
              createTime: '2017-12-20 10:24:52',
              phone: '123456',
              status: '1',
              areaId: ''
            }, {
              id: '123123123',
              loginName: 'chenxiang',
              name: '陈祥',
              password: 'fhghmvjk',
              sex: '2',
              age: 22,
              roleIds: [],
              createTime: '2017-12-20 10:24:22',
              phone: '123456',
              status: '1',
              areaId: ''
            }, {
              id: '234234423',
              loginName: 'liubb',
              name: '刘彬彬',
              password: 'hjktytry',
              sex: '3',
              age: 22,
              roleIds: [],
              createTime: '2017-12-20 10:24:01',
              phone: '123456',
              status: '1',
              areaId: ''
            }
          ],
          url: 'user/dataGrid.do',
          sort: 'createTime',
          order: 'desc'
        },
        derail_address_arr: [],
        derail_address_obj_s: [],
        roleIds: [],
        userStatus: [{label:'正常', value:"1"}, {label:"停用", value:"2"}],
        sex: [{label:'男', value:"1"}, {label:"女", value:"2"}, {label:"保密",value:"3"}],
        formSearch: {
          name: '',
          createdateStart: '',
          createdateEnd: '',
          areaId: ''
        },
        formDialog: {
          id: '',
          loginName: '',
          name: '',
          password: '',
          sex: '',
          age: 22,
          roleIds: [],
          phone: '',
          status: '1',
          areaId: ''
        },
        columns: [
          {
            "type": 'selection',
            "width": 80,
            "fixed": 'left',
            "align": 'center'
          },
          {
            "title": "账号",
            "key": "loginName",
            // "width": 240,
            "sortable": true
          },
          {
            "title": "姓名",
            "key": "name",
            // "width": 240,
            "sortable": true
          },
          {
            "title": "操作时间",
            "key": "createTime",
            // "width": 260,
            "sortable": true
          },
          {
            "title": "电话",
            "key": "phone",
            // "width": 240,
            "sortable": true
          },
          {
            "title": "角色",
            "key": "rolesList",
            // "width": 230,
            "sortable": true
          },
          {
            "title": "状态",
            "key": "status",
            "width": 100,
            "sortable": true,
            render: (create, params) => {
              var map = this.$store.state.map.status
              return create('span', map[params.row.status]);
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 140,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this
              return create('div', [
                vm.createEditBtn(create, params.row),
                vm.createDelBtn(create, params.row.id)
              ])
            }
          }
        ],
        rules: {
          loginName: [
            { required: true, message: '登录名称不能为空', trigger: 'blur' },
            { type: 'string', min: 4, max: 64, message: '登录名须在4-64个字符之间', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '用户状态不能为空', trigger: 'change' }
          ],
          // userType: [
          //   { required: true, message: '用户类型不能为空', trigger: 'change' }
          // ],
          // roleIds: [
          //   { required: true, message: '用户角色不能为空', trigger: 'blur' }
          // ],
          sex: [
            { required: true, message: '用户性别不能为空', trigger: 'change' }
          ],
          // detailAddress: [
          //   { required: true, message: '请选择关联地区', trigger: 'change' }
          // ],
          phone : [
            { required: true, message: '联系方式不能为空', trigger: 'change' },
          ]
        }
      }
    },
    methods: {
      resetSearch (name) {
        let vm = this
        vm.derail_address_obj_s = []
        vm.formSearch.name = ''
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
      },
      resetDialogForm (name) {
        this.$refs[name].resetFields()
      },
      initDialog () {},
      initData () {
        let vm = this
        vm.derail_address_arr = vm.util.extend(JSON.parse(sessionStorage.chinaData))
      }
    },
    computed: {},
    created () {},
    mounted () {},
    watch: {
      derail_address_obj_s (val) {
        if (val.length) {
          this.formSearch.areaId = val[2]
        } else {
          this.formSearch.areaId = ''
        }
      }
    },
  }
</script>
