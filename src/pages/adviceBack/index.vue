<template>
  <div class="adviceBack">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="关键词" prop="keyWord">
            <Input v-model="formSearch.keyWord" placeholder="昵称/内容" size="small"></Input>
        </FormItem>
        <FormItem label="反馈人ID" prop="appId">
            <Input v-model="formSearch.appId" placeholder="反馈人ID" size="small"></Input>
        </FormItem>
        <FormItem label="联系方式" prop="phone">
            <Input v-model="formSearch.phone" placeholder="联系方式" size="small"></Input>
        </FormItem>
        <FormItem label="反馈时间">
          <FormItem prop="createdateStart">
            <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateStart" size="small" :clearable="false"></DatePicker>
          </FormItem>
          <FormItem>至</FormItem>
          <FormItem prop="createdateEnd">
            <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateEnd" size="small" :clearable="false"></DatePicker>
          </FormItem>
        </FormItem>
        <Button type="ghost" style="margin: 5px 8px 24px 0" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="error" style="margin: 5px 8px 24px 0" :disabled="batchOprArr.length==0" @click="batchDel" size="small">批量删除</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0" @click="exportData" size="small">导出</Button>
        <!-- <Button type="primary" style="margin:5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button> -->
    </Form>
    <mainTable :columns="columns" :data="pager.data" @updateSelect="updateSelect"></mainTable>
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
            <FormItem label="nickName" prop="nickName">
              <Input v-model="formDialog.nickName" placeholder="请输入nickName"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="联系方式" prop="phone">
              <Input v-model="formDialog.phone" placeholder="请输入联系方式"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="意见内容" prop="content">
              <Input v-model="formDialog.content" placeholder="请输入意见内容"></Input>
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
    name: 'adviceBack_index',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        url: {
          add: 'adviceBack/add.do',
          edit: 'adviceBack/edit.do',
          delete: 'adviceBack/delete.do'
        },
        pager: {
          data: [
            {
              id: '943008390152093696',
              appId: '937896733121966080',
              nickName: '匿名564d3c8',
              content: '嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️',
              phone: '32165456',
              createTime: '2017-12-19 14:41:35'
            }, {
              id: '942678248204697600',
              appId: '937962759100559360',
              nickName: '将军Log',
              content: '阿里国际教育',
              phone: '123532545',
              createTime: '2017-12-08 16:20:31'
            }, {
              id: '942662314802970624',
              appId: '937896169920970752',
              nickName: '测试管理员',
              content: '有问题',
              phone: '12314344231',
              createTime: '2017-12-05 12:10:45'
            }
          ],
          url: 'adviceBack/dataGrid.do',
          sort: 'createTime',
          order: 'desc'
        },
        batchOprArr: [],
        dialogShow: false,
        dialogSubmitLoading: false,
        currDialog: 'add',
        formSearch: {
          createdateStart: '',
          createdateEnd: '',
          keyWord:'',
          phone: '',
          appId: ''
        },
        columns: [
          {
            'type': 'selection',
            'width': 80,
            'fixed': 'left',
            'align': 'center'
          },
          {
            "title": "反馈人ID",
            "key": "appId",
            "width": 180,
            "sortable": true
          },
          {
            "title": "昵称",
            "key": "nickName",
            "width": 150,
            "sortable": true
          },
          {
            "title": "反馈内容",
            "key": "content",
            "width": 620,
            "sortable": true
          },
          {
            "title": "联系方式",
            "key": "phone",
            "width": 250,
            "sortable": true
          },
          {
            "title": "反馈时间",
            "key": "createTime",
            "width": 250,
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
              return  create('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    vm.$Modal.confirm({
                      title: '确认',
                      content: '确认删除这条数据吗？',
                      onOk: function () {
                        vm.$store.dispatch('delRow', params.row.id)
                      }
                    })
                  }
                }
              }, '删除')
            }
          }
        ],
        formDialog: {
          id: 0,
          appId: '',
          nickName: '',
          phone: '',
          content: ''
        },
        rules: {}
      }
    },
    methods: {
      addRow () {
        // this.$store.commit('addRow', this)
        this.dialogShow = true
      },
      updateSelect (selection) {
        this.batchOprArr = selection
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
      batchDel () {
        console.log('批量删除数据： ',this.batchOprArr)
      },
      exportData () {},
      changePager (data) {
        this.util.changePager(this, data)
      },
      paging () {
        this.util.paging(this)
      },
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
    }
  }
</script>

<style scoped>

</style>
