<template>
  <div class="user">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="用户" prop="userParam">
            <Input v-model="formSearch.userParam" placeholder="姓名/账号/手机号" size="small"></Input>
        </FormItem>
        <FormItem label="管理区域" prop="source">
            <Cascader :data="derail_address_arr" v-model="derail_address_obj_s" filterable size="small" style="margin-top: 5px"></Cascader>
            <Input v-model="formSearch.aredId" v-if="false"></Input>
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
  export default {
    name: 'user',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        url: {
          add: 'user/add.do',
          edit: 'user/edit.do',
          delete: 'user/delete.do'
        },
        pager: {
          url: 'user/dataGrid.do',
          sort: 'createTime',
          order: 'desc'
        },
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        derail_address_arr: [],
        derail_address_obj_s: [],
        roleIds: [],
        userStatus: [{label:'正常', value:"1"}, {label:"停用", value:"2"}],
        sex: [{label:'男', value:"1"}, {label:"女", value:"2"}, {label:"保密",value:"3"}],
        formSearch: {
          name: '',
          createdateStart: '',
          createdateEnd: '',
          areaId:null
        },
        formDialog: {
            id: 0,
            loginName: '',
            name: '',
            password: '',
            sex: 0,
            age: 22,
            roleIds: [],
            phone: '',
            status: '1',
            areaId:null
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
                      vm.$store.commit('editRow', {
                        'vm': vm,
                        'data': params.row,
                        'initDialog': vm.initDialog(params.row)
                      })
                    }
                  }
                }, '编辑'),
                create('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$store.dispatch('delRow', {
                        'vm': this,
                        'params': params
                      })
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        rules: {}
      }
    },
    computed: {
      label () {
        return this.$store.state.label
      }
    },
    methods: {
      resetSearch (name) {
        this.$refs[name].resetFields()
      },
      addRow () {
        this.$store.commit('addRow', this)
      },
      resetDialogForm (name) {
        this.$refs[name].resetFields()
      },
      initDialog () {},
      changePager (data) {
        this.util.changePager(this, data)
      },
      paging () {
        this.util.paging(this)
      },
      initData () {}
    },
    created () {
      let vm = this
      vm.initData()
      vm.$store.commit('initPager', vm)
      vm.paging(vm)
    },
    mounted () {
    }
  }
</script>

<style scoped>

</style>
