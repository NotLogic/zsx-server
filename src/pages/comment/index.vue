<template>
  <div class="comment">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="关键词" prop="keyWord">
            <Input v-model="formSearch.keyWord" placeholder="评论内容" size="small"></Input>
        </FormItem>
        <FormItem label="评论ID" prop="id">
            <Input v-model="formSearch.id" placeholder="评论ID" size="small"></Input>
        </FormItem>
        <FormItem label="评论人" prop="commentMan">
            <Input v-model="formSearch.commentMan" placeholder="ID/账号/昵称" size="small"></Input>
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
        <FormItem label="状态" prop="lockStatus">
            <Select v-model="formSearch.lockStatus" placeholder="请选择" size="small" style="width: 80px;" clearable>
                <Option value="1">正常</Option>
                <Option value="2">屏蔽</Option>
            </Select>
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
              <FormItem label="send发表评论id" prop="sId">
                <Input v-model="formDialog.sId" placeholder="请输入send发表评论id"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="昵称" prop="nickName">
                <Input v-model="formDialog.nickName" placeholder="请输入昵称"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="回复人昵称" prop="rNickName">
                <Input v-model="formDialog.rNickName" placeholder="请输入回复人昵称"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="12">
              <FormItem label="评论内容" prop="comment">
                <Input v-model="formDialog.comment" placeholder="请输入评论内容"></Input>
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
              <FormItem label="1：非评论,2:评论" prop="answerSatus">
                <Input v-model="formDialog.answerSatus" placeholder="请输入1：非评论,2:评论"></Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="0:正常,1:广告,2:政治敏感,3:不适宜公开,4:骂人,5:色情等违法" prop="status">
                <Input v-model="formDialog.status" placeholder="请输入0:正常,1:广告,2:政治敏感,3:不适宜公开,4:骂人,5:色情等违法"></Input>
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
    name: 'comment_index',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        url: {
          add: 'comment/add.do',
          edit: 'comment/edit.do',
          delete: 'comment/delete.do'
        },
        pager: {
          data: [
            {
              id: '944047408537128960',
              appId:'937896733121966080',
              sId:'',
              nickName:'发的后果',
              rNickName:'',
              comment:'手动阀手动阀',
              upvoteNum:'156',
              answerSatus:'',
              account: '13612873429',
              commentType: 1,
              lockStatus: 1,
              createTime: '2017-12-22 11:30:16',
              status:''
            }, {
              id: '944043274203287552',
              appId:'937896733121966080',
              sId:'',
              nickName:'维尔',
              rNickName:'',
              comment:'虽然他有人提议',
              upvoteNum:'12334',
              answerSatus:'',
              account: '13612873429',
              commentType: 3,
              lockStatus: 2,
              createTime: '2017-12-22 11:13:50',
              status:''
            }, {
              id: '944042615311683584',
              appId:'937896733121966080',
              sId:'',
              nickName:'权威飒东风',
              rNickName:'',
              comment:'日语特尔问题',
              upvoteNum:'42514',
              answerSatus:'',
              account: '13612873429',
              commentType: 2,
              lockStatus: 1,
              createTime: '2017-12-22 11:11:13',
              status:''
            }
          ],
          url: 'comment/dataGrid.do',
          sort: 'createTime',
          order: 'desc'
        },
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        formSearch: {
          createdateStart: '',
          createdateEnd: '',
          keyWord: '',
          commentMan: '',
          lockStatus: '',
          id: ''
        },
        formDialog: {
          id: '',
          appId:'',
          sId:'',
          nickName:'',
          rNickName:'',
          comment:'',
          upvoteNum:'',
          answerSatus:'',
          status:''
        },
        columns: [
          {
            "title": "ID",
            "key": "id",
            "width": 180,
            "sortable": true,
            "fixed": 'left'
          },
          {
            "title": "评论内容",
            "key": "comment",
            "width": 350,
            "sortable": true
          },
          {
            "title": "评论人ID",
            "key": "appId",
            "width": 180,
            "sortable": true
          },
          {
            "title": "评论人昵称",
            "key": "nickName",
            "width": 150,
            "sortable": true
          },
          {
            "title": "评论人账号",
            "key": "account",
            "width": 160,
            "sortable": true
          },
          {
            "title": "评论对象",
            "key": "commentType",
            "width": 150,
            "sortable": true,
            render: function (create, params) {
              var map = {
                1: '帖子',2: '帖子',3: '帖子',4: '帖子', 5: '新闻', 6:'帖子'
              };
              return create('span', map[params.row.commentType]);
            }
          },
          {
            "title": "点赞数",
            "key": "upvoteNum",
            "width": 150,
            "sortable": true
          },
          {
            "title": "评论状态",
            "key": "lockStatus",
            "width": 150,
            "sortable": true,
            render: function (create, params) {
              var map = {
                1: '正常', 2: '屏蔽'
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
              let btn_text = params.row.lockStatus==2?'取消屏蔽':'屏蔽'
              return create('Button', {
                props: {type: 'warning', size: 'small'},
                style: {marginRight: '5px'},
                on: {
                  click: function () {
                    console.log('屏蔽')
                  }
                }
              }, btn_text)
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
        let vm = this
        vm.$refs[name].validate(function (valid) {
          if (valid) {
            let ajaxData = vm.util.editAddAjaxData(vm)
            console.log(ajaxData)
            vm.$store.dispatch('submitDialogForm', {
              'vm': vm,
              'name': name
            })
          }
        })
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
      dialogShow (val) {
        if (!val) {
          this.currDialog = 'add'
        }
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
