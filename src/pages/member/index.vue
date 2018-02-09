<template>
  <div class="member">
    <i-form :model="formSearch" ref="formSearch" inline :label-width="60">
        <Form-item label="关键词" prop="keyWord">
            <i-input v-model="formSearch.keyWord" placeholder="账号/昵称" size="small"></i-input>
        </Form-item>
        <Form-item label="家乡" prop="source">
            <Cascader :data="derail_address_arr" v-model="derail_address_obj_s_h" filterable size="small" style="margin-top: 5px"></Cascader>
            <i-input v-model="formSearch.homeId" v-if="false"></i-input>
        </Form-item>
        <Form-item label="居住地" prop="source">
            <Cascader :data="derail_address_arr" v-model="derail_address_obj_s_c" filterable size="small" style="margin-top: 5px"></Cascader>
            <i-input v-model="formSearch.currPlaceId" v-if="false"></i-input>
        </Form-item>
        <Form-item label="账号类型" prop="source">
            <i-select v-model="formSearch.userType" placeholder="请选择" size="small" clearable style="width:80px;">
                <i-option value="1">手机号</i-option>
                <i-option value="2">QQ</i-option>
                <i-option value="3">微信</i-option>
                <i-option value="4">新浪</i-option>
            </i-select>
        </Form-item>
         <Form-item label="注册时间">
            <Form-item prop="createdateStart">
                <Date-picker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateStart" size="small" :clearable="false"></Date-picker>
            </Form-item>
            <Form-item>至</Form-item>
            <Form-item prop="createdateEnd">
                <Date-picker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateEnd" size="small" :clearable="false"></Date-picker>
            </Form-item>
        </Form-item>
        <Form-item label="状态" prop="source">
            <i-select v-model="formSearch.status" placeholder="请选择" size="small" clearable style="width:80px;">
                <i-option value="1">正常</i-option>
                <i-option value="2">禁用</i-option>
            </i-select>
        </Form-item>
        <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </i-form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="350" @on-cancel="resetDialogForm('formDialog')">
      <i-form :model="formDialog" ref="formDialog" :rules="rules" :label-width="90">
        <Row>
            <i-col span="24">
                <Form-item label="会员ID" prop="id">
                    <i-input v-model="formDialog.id" placeholder=""></i-input>
                </Form-item>
            </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Form-item label="账号名" prop="account">
              <i-input v-model="formDialog.account" placeholder=""></i-input>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Form-item label="账户类型" prop="userType">
              <i-select v-model="formDialog.userType" placeholder="请选择" size="small" clearable>
                <i-option value="1">手机号</i-option>
                <i-option value="2">QQ</i-option>
                <i-option value="3">微信</i-option>
                <i-option value="4">新浪</i-option>
              </i-select>
            </Form-item>
          </i-col>
        </Row>
        <Row>
            <i-col span="24">
                <Form-item label="注册时间" prop="createTime">
                    <Date-picker type="datetime" placeholder="点击选择时间" v-model="formDialog.createTime"></Date-picker>
                </Form-item>
            </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Form-item label="最后登录时间" prop="lastLoginTime">
              <Date-picker type="datetime" placeholder="点击选择时间" v-model="formDialog.lastLoginTime"></Date-picker>
            </Form-item>
          </i-col>
        </Row>
        <Row>
          <i-col span="24">
            <Form-item label="用户状态" prop="status">
              <Radio-group v-model="formDialog.status">
                <Radio label="1">正常</Radio>
                <Radio label="2">禁用</Radio>
              </Radio-group>
            </Form-item>
          </i-col>
        </Row>
      </i-form>
      <div slot="footer">
        <i-button type="primary" @click="_submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</i-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  export default {
    name: 'member',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        url: {
          add: 'member/add.do',
          edit: 'member/edit.do',
          delete: 'member/delete.do'
        },
        pager: {
          url: 'member/dataGrid.do',
          sort: 'createTime',
          order: 'desc'
        },
        derail_address_arr: [],
        derail_address_obj_s_h: [],
        derail_address_arr: [],
        derail_address_obj_s_c: [],
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        formSearch: {
          keyWord:null,
          homeId:null,
          currPlaceId:null,
          userType:null,
          status:null,
          createdateStart: '',
          createdateEnd: ''
        },
        formDialog: {
          id:0,
          homeId:'',
          homeName:'',
          currPlaceId:'',
          currPlaceName:'',
          account:'',
          nickName:'',
          password:'',
          salt:'',
          sex:'',
          age:'',
          phone:'',
          profession:'',
          imagePath:'',
          currentPlace:'',
          homePlace:'',
          status:'',
          remark:'',
          createTime:'',
          modifyTime:'',
          lastLoginTime:''
        },
        columns: [
          {
            "title": "会员ID",
            "key": "id",
            "width": 180,
            "sortable": true
          },
          {
            "title": "登陆账号",
            "key": "account",
            "width": 170,
            "sortable": true
          },
          {
            "title": "昵称",
            "key": "nickName",
            "width": 150,
            "sortable": true
          },
          {
            "title": "家乡",
            "key": "homeName",
            "width": 160,
            "sortable": true
          },
          {
            "title": "居住地",
            "key": "currPlaceName",
            "width": 160,
            "sortable": true
          },
          {
            "title": "帖子数",
            "key": "noteNum",
            "width": 150,
            "sortable": true
          },
          {
            "title": "评论数",
            "key": "commentNum",
            "width": 150,
            "sortable": true
          },
          {
            "title": "关注数",
            "key": "focusNum",
            "width": 150,
            "sortable": true
          },
          {
            "title": "注册时间",
            "key": "createTime",
            "width": 160,
            "sortable": true
          },
          {
            "title": "账号类型",
            "key": "userType",
            "width": 150,
            "sortable": true,
            render: function (create, params) {
                var map = {
                    1: '手机号', 2: 'QQ', 3:'微信', 4: '新浪'
                };
                return create('span', map[params.row.userType]);
            }
          },
          {
            "title": "最后登录时间",
            "key": "lastLoginTime",
            "width": 160,
            "sortable": true
          },
          {
            "title": "状态",
            "key": "status",
            "width": 150,
            "sortable": true,
            render: function (create, params) {
                var map = {
                    1: '正常', 2: '禁用'
                };
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
                      console.log('查看')
                    }
                  }
                }, '查看'),
                create('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      console.log('帖子')
                    }
                  }
                }, '帖子')
              ])
            }
          }
        ],
        rules: {}
      }
    },
    methods: {
      addRow () {
        this.$store.commit('addRow', this)
      },
      resetDialogForm (name) {
        this.$refs[name].resetFields()
      },
      resetSearch (name) {
        this.formSearch.userType = ''
        this.formSearch.status = ''
        this.$refs[name].resetFields()
      },
      changePager (data) {
        this.util.changePager(this, data)
      },
      paging () {
        this.util.paging(this)
      },
      initData () {}
    },
    computed: {
      label () {
        return this.$store.state.label
      }
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
