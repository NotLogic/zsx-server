<template>
  <div class="notes">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="帖子ID" prop="id">
        <Input v-model="formSearch.id" style="width:150px" placeholder="帖子ID" size="small"></Input>
      </FormItem>
      <FormItem label="发帖人" prop="postMan">
        <Input v-model="formSearch.postMan" style="width:150px" placeholder="账号/昵称" size="small"></Input>
      </FormItem>
      <FormItem label="群组名称" prop="groupName">
        <Input v-model="formSearch.groupName" placeholder="群组名称" size="small"></Input>
      </FormItem>
      <FormItem label="帖子类型" prop="type">
        <Select v-model="formSearch.type"  size="small" placeholder="请选择" style="width: 90px;" clearable>
          <Option value="1">谈天说地</Option>
          <Option value="2">商务合作</Option>
          <Option value="3">互助平台</Option>
          <Option value="4">话题投票</Option>
          <Option value="5">话题</Option>
        </Select>
      </FormItem>
      <FormItem label="帖子状态" prop="lockStatus">
        <Select v-model="formSearch.lockStatus" placeholder="请选择" size="small" style="width: 80px;" clearable>
          <Option value="1">正常</Option>
          <Option value="2">屏蔽</Option>
        </Select>
      </FormItem>
      <FormItem label="发布时间">
        <FormItem prop="createdateStart">
          <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateStart" size="small" :clearable="false"></DatePicker>
        </FormItem>
        <FormItem>至</FormItem>
        <FormItem prop="createdateEnd">
          <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateEnd" size="small" :clearable="false"></DatePicker>
        </FormItem>
      </FormItem>
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
        <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
          <Row>
            <Col span="12">
              <FormItem label="app用户id" prop="appId">
                <Input v-model="formDialog.appId" placeholder="请输入app用户id"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="昵称" prop="nickName">
                <Input v-model="formDialog.nickName" placeholder="请输入昵称"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="发表内容" prop="comment">
                <Input v-model="formDialog.comment" placeholder="请输入发表内容"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="点赞数" prop="upvoteNum">
                <Input v-model="formDialog.upvoteNum" placeholder="请输入点赞数"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="评论数" prop="commentNum">
                <Input v-model="formDialog.commentNum" placeholder="请输入评论数"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="分享数" prop="shareNum">
                <Input v-model="formDialog.shareNum" placeholder="请输入分享数"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="状态" prop="status">
                <Input v-model="formDialog.status" placeholder="请输入0:正常,1:广告,2:政治敏感,3:不适宜公开,4:骂人,5:色情等违法"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="图片" prop="image">
                <Input v-model="formDialog.image" placeholder="请输入图片"></Input>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div slot="footer">
          <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
          <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
        </div>
    </Modal>
    <!-- 预览 -->
    <Modal v-model="noteDetailModal" title="预览" width="1000">
      <Row>
        <Col span="4" class="rightt"><strong>贴子内容:</strong></Col>
        <Col span="19"><p>{{look_data.comment}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>发布时间:</strong></Col>
        <Col span="19" ><p>{{look_data.createTime}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>图片:</strong></Col>
        <Col span="19">
          <div class="image_upload_list" v-for="item in look_data.images" :key="item">
            <img width="100" :src="item"/>
          </div>
        </Col>
      </Row>
      <Row v-if="look_data.type==2">
        <Col span="4" class="rightt"><strong>参与项目情况:</strong></Col>
        <Col span="19">
          <p v-if="look_data.businessStatus==1">未达成合作</p>
          <p v-if="look_data.businessStatus==2">已达成合作</p>
        </Col>
      </Row>
      <br v-if="look_data.type==2">
      <Row v-if="look_data.type==2">
        <Col span="4" class="rightt"><strong>参与人员:</strong></Col>
        <Col span="19">
          <i-table border :columns="attend_people.columns" :data="attend_people.data" size="small"></i-table>
          <div class="wrapper-pagination">
            <Page :total="attend_people.pager.total" :current="attend_people.pager.nowpage" :page-size="attend_people.pager.pagesize" @on-change="attendPeoplePageNumChange" show-total></Page>
          </div>
        </Col>
      </Row>
      <br v-if="look_data.type==2">
      <Row v-if="look_data.type==4">
        <Col span="4" class="rightt"><strong>投票类型:</strong></Col>
        <Col span="19">
          <p v-if="look_data.radioOrCheck==1">单选</p>
          <p v-if="look_data.radioOrCheck==2">多选</p>
        </Col>
      </Row>
      <br v-if="look_data.type==4">
      <Row v-if="look_data.type==4">
        <Col span="4" class="rightt"><strong>投票:</strong></Col>
        <Col span="19">
          <i-table border :columns="vote_people.columns" :data="vote_people.data" size="small"></i-table>
        </Col>
      </Row>
      <div slot="footer">
        <Button type="primary" size="large"  :loading="modal_loading" @click="noteDetailModal = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  export default {
    name: 'notes_index',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        url: {
          add: 'notes/add.do',
          edit: 'notes/edit.do',
          delete: 'notes/delete.do'
        },
        pager: {
          data: [
            {
              id: '948133618341376000',
              appId:'',
              nickName:'所谓而微软',
              comment:'阿斯顿撒旦',
              upvoteNum:'21',
              commentNum:'123',
              shareNum:'12',
              account: '13697208006',
              typeText: '商务合作',
              groupName: '群组名1',
              createTime: '2017-12-29 14:41:07',
              status:'',
              lockStatus: '1',
              image:'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png'
            }, {
              id: '946685465092145152',
              appId:'',
              nickName:'儿童',
              comment:'而登革热',
              upvoteNum:'23',
              commentNum:'4123',
              shareNum:'124',
              account: '13697208006',
              typeText: '谈天说地',
              groupName: '群组名2',
              createTime: '2017-12-21 17:11:50',
              status:'',
              lockStatus: '2',
              image:'http://img.zcool.cn/community/01690955496f930000019ae92f3a4e.jpg@2o.jpg'
            }, {
              id: '946685381910708224',
              appId:'',
              nickName:'豆腐干',
              comment:'瑞特以后',
              upvoteNum:'421',
              commentNum:'123',
              shareNum:'12',
              account: '13697208006',
              typeText: '话题贴',
              groupName: '群组名3',
              createTime: '2017-12-20 09:29:18',
              status:'',
              lockStatus: '1',
              image:'http://img.taopic.com/uploads/allimg/120727/201995-120HG1030762.jpg'
            }
          ],
          url: 'notes/dataGrid.do',
          sort: 'createTime',
          order: 'desc'
        },
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        noteDetailModal: false,
        modal_loading: false,
        look_data:{
            type:0,  //  1 谈天说地 2 商圈 3 帮衬 4 意见
            comment:"",
            createTime:'',
            images:[],
            businessStatus:0,
            radioOrCheck:0,
        },
        attend_people:{
          columns: [
            {
              title: '类型',
              key: 'type',
              render: function (create, params) {
                var map = {
                  1: '看好的人', 2: '洽谈的人'
                };
                return create('span', map[params.row.type]);
              }
            },
            {
              title: '账户',
              key: 'account',
              width: 130
            },
            {
              title: '姓名',
              key: 'userName'
            },
            {
              title:'联系方式',
              key: 'phone',
              width: 130
            },
            {
              title:'个人介绍',
              key:'personIntr',
              width: 120
            },
            {
              title:'参与时间',
              key:'createTime',
              width:150
            }
          ],
          data: [],
          pager: {
            nowpage: 1,
            pagesize: 6,
            sort: '',
            order: '',
            total: 0,
            vbsId: 0
          }
        },
        vote_people:{
          columns: [
            {
              title: '选项',
              key: 'title'
            },
            {
              title: '票数',
              key: 'voteNum'
            }
          ],
          data: []
        },
        formSearch: {
          id: '',
          groupName:'',
          postMan: '',
          type: '',
          lockStatus: '',
          createdateStart: '',
          createdateEnd: ''
        },
        formDialog: {
          id: '',
          appId:'',
          nickName:'',
          comment:'',
          upvoteNum:'',
          commentNum:'',
          shareNum:'',
          status:'',
          image:''
        },
        columns: [
          {
            "title": "ID",
            "key": "id",
            "width": 180,
            "sortable": true,
            "fixed": "left"
          },
          {
            "title": "帖子内容",
            "key": "comment",
            "width": 200,
            "sortable": true,
            render: function (create, params) {
              if(params.row.comment.length<=50)
                return params.row.comment
              return params.row.comment.substring(0, 50)+"..."
            }
          },
          {
            "title": "主图",
            "key": "image",
            "width": 120,
            "sortable": true,
            render: function (create, params) {
              var src;
              if (params.row.image != null)
                src = params.row.image.split(',')[0];
              if(typeof(src) =='undefined')
                src = 'static/img/img-onerror.png';
              return create("img",{
                attrs: {
                  src: src,
                  width:80,
                  height:80
                },
                style:{
                  'border': '1px solid transparent',
                  'border-radius': '4px'
              }
              })
            }
          },
          {
            "title": "发帖人账号",
            "key": "account",
            "width": 160,
            "sortable": true
          },
          {
            "title": "发帖人昵称",
            "key": "nickName",
            "width": 150,
            "sortable": true
          },
          {
            "title": "点赞数",
            "key": "upvoteNum",
            "width": 100,
            "sortable": true
          },
          {
            "title": "评论数",
            "key": "commentNum",
            "width": 100,
            "sortable": true
          },
          {
            "title": "分享数",
            "key": "shareNum",
            "width": 100,
            "sortable": true
          },
          {
            "title": "帖子类型",
            "key": "typeText",
            "width": 150,
            "sortable": true
          },
          {
            "title": "群组名称",
            "key": "groupName",
            "width": 150,
            "sortable": true
          },
          {
            "title": "帖子状态",
            "key": "lockStatus",
            "width": 150,
            "sortable": true,
            render: function (create, params) {
              var map = {
                '1': '正常', '2': '屏蔽'
              };
              return create('span', map[params.row.lockStatus]);
            }
          },
          {
            "title": "发布时间",
            "key": "createTime",
            "width": 160,
            "sortable": true
          },
          {
            'title': '操作',
            'key': 'action',
            'width': 140,
            'align': 'center',
            'fixed': 'right',
            render: (create, params) => {
              let vm = this
              var btn_text = params.row.lockStatus==1?'屏蔽':'取消屏蔽'
              return create('div', [
                create('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: function () {
                      vm.noteDetailModal = true
                      console.log('预览')
                    }
                  }
                }, '预览'),
                create('Button', {
                  props: {type: 'warning', size: 'small'},
                  style: {marginRight: '5px'},
                  on: {
                    click: function () {
                      console.log('屏蔽')
                    }
                  }
                }, btn_text)
              ])
            }
          }
        ],
        rules: {}
      }
    },
    methods: {
      addRow () {
        this.util.addRow(this)
      },
      initDialog (data) {
        let _data = util.extend(data)
        this.provinceCity = [_data.cityCode.toString().slice(0, 2) + '0000', _data.cityCode.toString().slice(0, 4) + '00', _data.cityCode.toString()]
      },
      resetSearch (name) {
        let vm = this
        vm.derail_address_obj_s = []
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
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
      }
    },
    computed: {
      label () {
        return this.$store.state.label
      }
    },
    watch: {
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
  .rightt{
    text-align: right;
    padding-right: 20px;
    font-size: 120%;
  }
</style>
