<template>
  <div class="news">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="关键词" prop="keyWord">
        <Input v-model="formSearch.keyWord" placeholder="标题" size="small" style="width: 120px"></Input>
      </FormItem>
      <FormItem label="新闻ID" prop="id">
        <Input v-model="formSearch.id" placeholder="新闻ID" size="small" style="width: 120px"></Input>
      </FormItem>
      <FormItem label="来源" prop="newsSrc">
        <Input v-model="formSearch.newsSrc" placeholder="新闻来源" size="small" style="width: 120px"></Input>
      </FormItem>
      <FormItem label="关联地区" prop="source">
        <Cascader :data="derail_address_arr" v-model="derail_address_obj_s" filterable size="small" style="margin-top: 5px"></Cascader>
      </FormItem>
      <FormItem label="状态" prop="status">
        <Select v-model="formSearch.status" placeholder="请选择" size="small" clearable>
          <Option value="1">未发布</Option>
          <Option value="2">已发布</Option>
        </Select>
      </FormItem>
      <FormItem label="采集时间">
        <FormItem prop="operatedateStart">
          <DatePicker type="datetime" placeholder="点击选择时间" style="width: 160px;" v-model="formSearch.createdateStart" size="small"
                       clearable></DatePicker>
        </FormItem>
        <FormItem>至</FormItem>
        <FormItem prop="operatedateEnd">
          <DatePicker type="datetime" placeholder="点击选择时间" style="width: 160px;" v-model="formSearch.createdateEnd" size="small"
                       clearable></DatePicker>
        </FormItem>
      </FormItem>
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="ghost" :disabled="batchOprArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchDelete" size="small">批量删除</Button>
      <Button type="primary" :disabled="batchOprArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchPublish" size="small">批量发布</Button>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="14">
            <FormItem label="新闻标题" prop="title">
              <Input v-model="formDialog.title" placeholder="请输入标题"></Input>
            </FormItem>
            <FormItem label="新闻来源" prop="newsSrc">
              <Input v-model="formDialog.newsSrc" placeholder="请输入新闻来源"></Input>
            </FormItem>
            <FormItem label="关联地区" prop="areaId">
              <Input v-model="formDialog.detailAddress" :disabled="true"></Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="新闻主图" prop="image">
              <Row>
                <Col span="12">
                  <div class="image_upload_list">
                    <img v-bind:src="formDialog.image"/>
                  </div>
                </Col>
                <Col span="12">
                  <Upload name="upfile" action="ueditor/upload.do" :show-upload-list="false" :on-success="handleSuccess">
                    <i-button type="ghost" icon="ios-cloud-upload-outline">{{label.uploadImg}}</i-button>
                  </Upload>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="新闻内容" prop="content">
              <Input v-model="formDialog.content" placeholder="新闻内容富文本"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  export default {
    name: 'news',
    components: {
      mainTable,
      paging
    },
    data: function () {
      return {
        pager: {
          'url': '',
          'currPage': 1,
          'order': '',
          'pagesize': 10,
          'sort': '',
          'total': 40,
          'data': []
        },
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        derail_address_arr: [],
        derail_address_arr_s: [],
        derail_address_obj_s: [],
        batchOprArr: [],
        formSearch: {
          startTime: '',
          endTime: '',
          province: 0,
          city: 0,
          type: null,
          lockStatus: null,
          title: null,
          areaType: '0'
        },
        formDialog: {
          id: '0',
          areaId: '',
          url: '',
          title: '',
          newsSrc: '',
          content: '',
          date: '',
          image: '',
          commentNum: '',
          upvoteNum: '',
          shareNum: '',
          status: '',
          detailAddress: ''
        },
        columns: [
          {
            type: 'selection',
            width: 80,
            fixed: 'left',
            align: 'center'
          },
          {
            'title': 'ID',
            'key': 'id',
            'width': 150,
            'sortable': true
          },
          {
            'title': '区域ID',
            'key': 'areaId',
            'width': 120,
            'sortable': true
          },
          {
            'title': '新闻图片',
            'key': 'image',
            'width': 120,
            'sortable': true,
            render: function (create, params) {
              return create('img', {
                attrs: {
                  src: params.row.image,
                  width: 80,
                  height: 80
                },
                style: {
                  'border': '1px solid transparent',
                  'border-radius': '4px'
                }
              })
            }
          },
          {
            'title': '标题',
            'key': 'title',
            'width': 300,
            'sortable': true
          },
          {
            'title': '新闻来源',
            'key': 'newsSrc',
            'width': 150,
            'sortable': true
          },
          {
            'title': '关联地区',
            'key': 'detailAddress',
            'width': 160,
            'sortable': true
          },
          {
            'title': '评论数',
            'key': 'commentNum',
            'width': 100,
            'sortable': true
          },
          {
            'title': '点赞数',
            'key': 'upvoteNum',
            'width': 100,
            'sortable': true
          },
          {
            'title': '分享数',
            'key': 'shareNum',
            'width': 100,
            'sortable': true
          },
          {
            'title': '状态',
            'key': 'status',
            'width': 100,
            'sortable': true,
            render: function (create, params) {
              var map = {
                0: '未发布', 1: '未发布', 2: '已发布'
              }
              return create('span', map[params.row.status])
            }
          },
          {
            'title': '采集时间',
            'key': 'createTime',
            'width': 160,
            'sortable': true
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
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
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      console.log('发布')
                    }
                  }
                }, '发布'),
                create('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$store.dispatch('delRow', {
                        'vm': this,
                        'create': create,
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
        var vm = this
        vm.$refs[name].resetFields()
      },
      submitSearch (name) {
        console.log('搜索')
      },
      batchDelete () {
        console.log('批量删除')
      },
      batchPublish () {
        console.log('批量发布')
      },
      handleSuccess () {},
      resetDialogForm (name) {
        let vm = this
        vm.$refs[name].resetFields()
      },
      initDialog (data) {}
    },
    mounted () {
    }
  }
</script>

<style scoped>

</style>
