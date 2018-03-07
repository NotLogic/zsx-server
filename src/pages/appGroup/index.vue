<template>
  <div class="appGroup">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="关键词" prop="keyWord">
            <Input v-model="formSearch.keyWord" placeholder="昵称/内容" size="small"></Input>
        </FormItem>
        <FormItem label="创建人" prop="createPerson">
            <Input v-model="formSearch.createPerson" placeholder="反馈人ID" size="small"></Input>
        </FormItem>
        <FormItem label="对应家乡" prop="source">
            <Cascader :data="derail_address_arr" v-model="derail_address_obj" filterable size="small" style="margin-top: 5px"></Cascader>
        </FormItem>
        <FormItem label="创建时间">
          <FormItem prop="createdateStart">
            <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateStart" size="small" :clearable="false"></DatePicker>
          </FormItem>
          <FormItem>至</FormItem>
          <FormItem prop="createdateEnd">
            <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateEnd" size="small" :clearable="false"></DatePicker>
          </FormItem>
        </FormItem>
        <Button type="ghost" style="margin-right: 8px;margin-top: 5px;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin-right: 8px;margin-top: 5px;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="primary" style="margin-right: 8px;margin-top: 5px;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
          <Row>
            <Col span="12">
              <FormItem label="区域id" prop="areaId">
                <Input v-model="formDialog.areaId" placeholder="请输入区域id"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="群名称" prop="name">
                <Input v-model="formDialog.name" placeholder="请输入群名称"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="群组图片" prop="imagePath">
                <Input v-model="formDialog.imagePath" placeholder="请输入群组图片路径"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="成员人数" prop="memberNum">
                <Input v-model="formDialog.memberNum" placeholder="请输入群人数"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="话题数量" prop="noteNum">
                <Input v-model="formDialog.noteNum" placeholder="请输入话题数量"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="创建人地址" prop="address">
                <Input v-model="formDialog.address" placeholder="请输入创建人地址"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="状态" prop="status">
                <Input v-model="formDialog.status" placeholder="请输入状态(1:正常,2:解散,3:锁定)"></Input>
              </FormItem>
            </Col>
          <Col span="12">
              <FormItem label="创建人账号" prop="account">
                <Input v-model="formDialog.account" placeholder="请输入创建人账号"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="创建人昵称" prop="nickName">
                <Input v-model="formDialog.nickName" placeholder="请输入创建人昵称"></Input>
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
    name: 'appGroup_index',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        url: {
          add: 'appGroup/add.do',
          edit: 'appGroup/edit.do',
          delete: 'appGroup/delete.do'
        },
        pager: {
          data: [
            {
              id: '943324837130698752',
              areaId: '',
              name: '奉公如法体育',
              imagePath: 'http://image.2017zsx.com/xiangyu/20171220/9865de97eee146128d3494d5bb2a6029.jpg',
              memberNum: '123',
              noteNum: '234234',
              address: '湖北省宜昌市当阳市',
              status: '1',
              account: '15622284462',
              createTime: '2017-12-20 11:39:01',
              nickName: '将军L'
            }, {
              id: '943094742413369344',
              areaId: '',
              name: '童话剧',
              imagePath: 'http://image.2017zsx.com/xiangyu/20171219/52a226a5d3df4ccf945ad2a3bebba72a.jpg',
              memberNum: '234',
              noteNum: '34534',
              address: '广东省深圳市南山区',
              status: '2',
              account: '13697208006',
              createTime: '2017-12-19 20:24:41',
              nickName: '阿斯蒂芬'
            }, {
              id: '942690318220427264',
              areaId: '',
              name: '法国红酒',
              imagePath: 'http://image.2017zsx.com/xiangyu/20171218/5622b33fadfb44da9d1220fb596e2163.jpg',
              memberNum: '3465',
              noteNum: '4365345',
              address: '湖北省襄樊市樊城区',
              status: '3',
              account: '15622284462',
              createTime: '2017-12-18 17:37:40',
              nickName: '法国红酒'
            }
          ],
          url: 'adviceBack/dataGrid.do',
          sort: 'createTime',
          order: 'desc'
        },
        dialogShow: false,
        dialogSubmitLoading: false,
        currDialog: 'add',
        formSearch: {
          createdateStart: '',
          createdateEnd: '',
          keyWord: '',
          createPerson: '',
          areaId: ''
        },
        derail_address_arr:[],
        derail_address_obj:[],
        formDialog: {
          id: '',
          areaId: '',
          name: '',
          imagePath: '',
          memberNum: '',
          noteNum: '',
          address: '',
          status: '',
          account: '',
          nickName: ''
        },
        rules: {},
        columns: [
          {
            "title": "群组ID",
            "key": "id",
            "width": 180,
            "sortable": true
          },
          {
            "title": "群组名称",
            "key": "name",
            "width": 150,
            "sortable": true
          },
          {
            "title": "群组图片",
            "key": "imagePath",
            "width": 150,
            "sortable": true,
            render: function (create, params) {
              if (params.row.imagePath) {
                return create('img', {
                  style: {
                    margin: '5px 0',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  },
                  attrs: {
                    src: params.row.imagePath
                  }
                })
              } else {
                return create('span', '暂无图片')
              }
            }
          },
          {
            "title": "创建人账号",
            "key": "account",
            "width": 150,
            "sortable": true
          },
          {
            "title": "创建人昵称",
            "key": "nickName",
            "width": 150,
            "sortable": true
          },
          {
            "title": "创建人家乡",
            "key": "address",
            "width": 150,
            "sortable": true
          },
          {
            "title": "成员人数",
            "key": "memberNum",
            "width": 150,
            "sortable": true
          },
          {
            "title": "话题数量",
            "key": "noteNum",
            "width": 150,
            "sortable": true
          },
          {
            "title": "状态",
            "key": "status",
            "width": 150,
            "sortable": true,
            render: function (create, params) {
              var map = {
                  1: '正常', 2: '解散', 3: '删除'
              };
              return create('span', map[params.row.status]);
            }
          },
          {
            "title": "创建时间",
            "key": "createTime",
            "width": 150,
            "sortable": true
          },
          {
            'title': '操作',
            'key': 'action',
            'width': 140,
            'align': 'center',
            'fixed': 'right',
            render: (create, params) => {
              return create('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {
                    console.log('解散')
                  }
                }
              }, '解散')
            }
          }
        ]
      }
    },
    methods: {
      addRow () {
        this.$store.commit('addRow', this)
      },
      initDialog (data) {
        
      },
      resetSearch (name) {
        this.$refs[name].resetFields()
        this.submitSearch(name)
      },
      submitSearch (name) {
        let vm = this
        vm.$store.dispatch('submitSearch', {
          'vm': vm,
          'name': name
        })
      },
      resetDialogForm (name) {
        let vm = this
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {
        this.util.submitDialogForm(this, name)
      },
      changePager (data) {
        this.util.changePager(this, data)
      },
      paging () {
        this.util.paging(this)
      },
      initData () {
        let vm = this
        vm.derail_address_arr = JSON.parse(sessionStorage.chinaData)
      }
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
    watch: {
      dialogShow (val) {
        if (!val) {
          this.currDialog = 'add'
        }
      },
      derail_address_obj (val) {
        if (val.length) {
          this.formSearch.areaId = val[2]
        } else {
          this.formSearch.areaId = ''
        }
      }
    }
  }
</script>

<style scoped>

</style>
