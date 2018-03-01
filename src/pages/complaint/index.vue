<template>
  <div class="complaint">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="状态" prop="chStatus">
            <Select v-model="formSearch.chStatus" size="small" style="width: 150px;">
              <Option v-for="item in chStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
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
        <Button type="warning" style="margin-right: 8px;margin-top: 5px;" :disabled="batchOprArr.length==0" @click="batchIgnore" size="small">批量忽略</Button>
        <Button type="warning" style="margin-right: 8px;margin-top: 5px;" :disabled="batchOprArr.length==0" @click="batchLock" size="small">批量屏蔽</Button>
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
    name: 'complaint_index',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        url: {
          add: 'appTips/add.do',
          edit: 'appTips/edit.do',
          delete: 'appTips/delete.do'
        },
        pager: {
          data: [
            {
              id: '937931320101146624',
              sAppId: '937896169920970752',
              appId: '937896169920970752',
              tipType: '',
              sId: '937901167094501376',
              tipsContent: '广告',
              chStatus: '',
              createTime: '2017-12-05 14:27:07',
            }
          ],
          url: 'complaint/dataGrid.do',
          sort: 'createTime',
          order: 'desc'
        },
        chStatus: [
          {
            value: '1',
            label: '待处理'
          }, {
            value: '2',
            label: '已处理'
          }
        ],
        formSearch: {
          createdateStart: '',
          createdateEnd: '',
          chStatus: ''
        },
        batchOprArr:[],
        columns: [
          {
            'type': 'selection',
            'width': 80,
            'fixed': 'left',
            'align': 'center',
          },
          {
            "title": "ID",
            "key": "id",
            "width": 180,
            "sortable": true
          },
          {
            "title": "发布人ID",
            "key": "sAppId",
            "width": 180,
            "sortable": true
          },
          {
            "title": "举报人ID",
            "key": "appId",
            "width": 180,
            "sortable": true
          },
          {
            "title": "类型",
            "key": "tipType",
            "width": 150,
            "sortable": true,
            render: function (create, params) {
                var map = {
                    1: '帖子', 2: '评论', 3:'新闻评论'
                };
                var map1 = {
                    1:'谈天说地', 2:'互助平台', 3:'商务合作', 4:'话题投票', 5:'新闻', 6:'群组'
                };
                return create('span', map[params.row.tipType]+'-'+map1[params.row.type]);
            }
          },
          {
            "title": "帖子/评论id",
            "key": "sId",
            "width": 180,
            "sortable": true
          },
          {
            "title": "举报原因",
            "key": "tipsContent",
            "width": 300,
            "sortable": true,
            render: function (create, params) {
                var map = {
                    1:'广告',2:'政治敏感',3:'包含不适宜公开的内容',4:'人身辱骂',5:'涉嫌黄色等违反法规的内容'
                };
                var str = params.row.tipsContent==''?'':params.row.tipsContent.replace('1', map[1]).replace('2', map[2]).replace('3', map[3]).replace('4', map[4]).replace('5', map[5])
                return create('span',str);
            }
          },
          {
            "title": "状态",
            "key": "chStatus",
            "width": 150,
            "sortable": true,
            render: function (create, params) {
                var map = {
                    1 :'待处理', 2 : '已处理'
                }
                return create('span', map[params.row.chStatus]);
            }
          },
          {
            "title": "举报时间",
            "key": "createTime",
            "width": 180,
            "sortable": true
          },
          {
            'title': '操作',
            'key': 'action',
            'width': 210,
            'align': 'center',
            'fixed': 'right',
            render: (create, params) => {
              let vm = this
              return create('div', [
                create('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '8px'
                  },
                  on: {
                    click: () => {
                      console.log('屏蔽内容')
                    }
                  }
                }, '屏蔽内容'),
                create('Button', {
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      console.log('忽略')
                    }
                  }
                }, '忽略')
              ])
            }
          }
        ]
      }
    },
    methods: {
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
      // 批量忽略
      batchIgnore () {},
      // 批量屏蔽
      batchLock () {},
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
