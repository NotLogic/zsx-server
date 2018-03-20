<template>
  <div class="member">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="关键词" prop="keyWord">
            <Input v-model="formSearch.keyWord" placeholder="账号/昵称" size="small"></Input>
        </FormItem>
        <FormItem label="家乡" prop="source">
            <Cascader :data="derail_address_arr" v-model="derail_address_obj_s_h" filterable size="small" style="margin-top: 5px"></Cascader>
        </FormItem>
        <FormItem label="居住地" prop="source">
            <Cascader :data="derail_address_arr" v-model="derail_address_obj_s_c" filterable size="small" style="margin-top: 5px"></Cascader>
        </FormItem>
        <FormItem label="账号类型" prop="source">
            <Select v-model="formSearch.userType" placeholder="请选择" size="small" clearable style="width:80px;">
                <Option v-for="item in userType" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
        </FormItem>
         <FormItem label="注册时间">
            <FormItem prop="createdateStart">
                <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateStart" size="small" :clearable="false"></DatePicker>
            </FormItem>
            <FormItem>至</FormItem>
            <FormItem prop="createdateEnd">
                <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateEnd" size="small" :clearable="false"></DatePicker>
            </FormItem>
        </FormItem>
        <FormItem label="状态" prop="source">
            <Select v-model="formSearch.status" placeholder="请选择" size="small" clearable style="width:80px;">
                <Option value="1">正常</Option>
                <Option value="2">禁用</Option>
            </Select>
        </FormItem>
        <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="350" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="90">
        <Row>
            <Col span="24">
                <FormItem label="会员ID" prop="id">
                    <Input v-model="formDialog.id" placeholder=""></Input>
                </FormItem>
            </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="账号名" prop="account">
              <Input v-model="formDialog.account" placeholder=""></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="账户类型" prop="userType">
              <Select v-model="formDialog.userType" placeholder="请选择" clearable>
                <Option v-for="item in userType" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
            <Col span="24">
                <FormItem label="注册时间" prop="createTime">
                    <DatePicker type="datetime" placeholder="点击选择时间" v-model="formDialog.createTime"></DatePicker>
                </FormItem>
            </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="最后登录时间" prop="lastLoginTime">
              <DatePicker type="datetime" placeholder="点击选择时间" v-model="formDialog.lastLoginTime"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="用户状态" prop="status">
              <RadioGroup v-model="formDialog.status">
                <Radio label="1">正常</Radio>
                <Radio label="2">禁用</Radio>
              </RadioGroup>
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
    name: 'member_index',
    components: {
      mainTable,
      paging
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'member/add.do',
          edit: 'member/edit.do',
          delete: 'member/delete.do'
        },
        pager: {
          data: [
            {
              id: '123212213213',
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
            }
          ],
          url: 'member/dataGrid.do',
          sort: 'createTime',
          order: 'desc'
        },
        userType: [
          {
            value: '1',
            label: '手机'
          },
          {
            value: '2',
            label: 'QQ'
          },
          {
            value: '3',
            label: '微信'
          },
          {
            value: '4',
            label: '新浪'
          }
        ],
        derail_address_arr: [],
        derail_address_obj_s_h: [],
        derail_address_arr: [],
        derail_address_obj_s_c: [],
        formSearch: {
          keyWord: '',
          homeId: '',
          currPlaceId: '',
          userType:'',
          status: '',
          createdateStart: '',
          createdateEnd: ''
        },
        formDialog: {
          id: '',
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
                    type: 'info',
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
      resetDialogForm (name) {
        let vm = this
        vm.$refs[name].resetFields()
      },
      resetSearch (name) {
        this.formSearch.userType = ''
        this.formSearch.status = ''
        this.derail_address_obj_s_h = []
        this.derail_address_obj_s_c = []
        this.$refs[name].resetFields()
        this.submitSearch(name)
      },
      initData () {
        let vm = this
        vm.derail_address_arr = JSON.parse(sessionStorage.chinaData)
      }
    },
    computed: {},
    created () {},
    mounted () {},
    watch: {
      derail_address_obj_s_h (val) {
        if (val.length) {
          this.formSearch.homeId = val[2]
        } else {
          this.formSearch.homeId = ''
        }
      },
      derail_address_obj_s_c (val) {
        if (val.length) {
          this.formSearch.currPlaceId = val[2]
        } else {
          this.formSearch.currPlaceId = ''
        }
      }
    },
  }
</script>
