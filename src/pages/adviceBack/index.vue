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
        <Button type="ghost" style="margin-right: 8px;margin-top: 5px;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin-right: 8px;margin-top: 5px;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="error" style="margin-right: 8px;margin-top: 5px;" :disabled="batchDelArr.length==0" @click="batchDel" size="small">批量删除</Button>
        <Button type="primary" style="margin-right: 8px;margin-top: 5px;" @click="exportData" size="small">导出</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>

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
              appId: '937896733121966080',
              nickName: '匿名564d3c8',
              content: '嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️嗯呀啦啦啦☹️☺️☹️',
              phone: '32165456',
              createTime: '2017-12-19 14:41:35'
            }, {
              appId: '937962759100559360',
              nickName: '将军Log',
              content: '阿里国际教育',
              phone: '123532545',
              createTime: '2017-12-08 16:20:31'
            }, {
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
        batchDelArr: [],
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
              return  create('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    console.log('删除')
                  }
                }
              }, '删除')
            }
          }
        ],
      }
    },
    methods: {
      onSelectionChange: function (selection) {
        this.batchDelArr = selection;
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
      batchDel () {

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
    }
  }
</script>

<style scoped>

</style>
