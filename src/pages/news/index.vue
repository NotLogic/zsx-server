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
        <FormItem prop="createdateStart">
          <DatePicker type="datetime" placeholder="点击选择时间" style="width: 160px;" v-model="formSearch.createdateStart" size="small" clearable></DatePicker>
        </FormItem>
        <FormItem>至</FormItem>
        <FormItem prop="createdateEnd">
          <DatePicker type="datetime" placeholder="点击选择时间" style="width: 160px;" v-model="formSearch.createdateEnd" size="small" clearable></DatePicker>
        </FormItem>
      </FormItem>
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="ghost" :disabled="batchOprArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchDelete" size="small">批量删除</Button>
      <Button type="primary" :disabled="batchOprArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchPublish" size="small">批量发布</Button>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data" @updateSelect="updateSelect"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="800" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="14">
            <FormItem label="新闻标题" prop="title">
              <Input v-model="formDialog.title" placeholder="请输入标题"></Input>
            </FormItem>
            <FormItem label="新闻来源" prop="newsSrc">
              <Input v-model="formDialog.newsSrc" placeholder="请输入新闻来源"></Input>
            </FormItem>
            <FormItem label="关联地区">
              <Input v-model="formDialog.detailAddress" :disabled="true"></Input>
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="新闻主图" prop="image">
              <Row>
                <Col span="12">
                  <div style="width:100px;height:100px;border:1px solid #eee;">
                    <img v-if="formDialog.image" style="max-width:100%;" :src="formDialog.image" />
                    <img v-else style="max-width:100%;" src="static/images/img-upload-default.png"/>
                  </div>
                </Col>
                <Col span="12">
                  <Upload name="upfile" action="ueditor/upload.do" :show-upload-list="false" :on-success="handleSuccess">
                    <Button type="ghost" icon="ios-cloud-upload-outline">{{label.uploadImg}}</Button>
                  </Upload>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="新闻内容" prop="content">
              <tinymce :id="tinymceId" @updateContent="updateContent" v-model="formDialog.content"></tinymce>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
    <Modal v-model="previewModal" :mask-closable="false" width="700" title="查看">
        <h2>{{previewData.title}}</h2>
        <br>
        <p>{{previewData.newsSrc}}&nbsp;&nbsp;&nbsp;{{previewData.date}}</p>
        <br>
        <div v-html="previewData.content" class="pic" style="overflow-y:auto;max-height:500px"></div>
        <br>
        <!-- <p><a v-bind:href="newsUrl">原文链接</a></p> -->
        <div slot="footer">
            <Button type="primary" @click="previewModal=false">关闭</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import tinymce from '@/components/tinymce'
  export default {
    name: 'news_index',
    components: {
      mainTable,
      paging,
      tinymce
    },
    data: function () {
      return {
        url: {
          add: 'news/add.do',
          edit: 'news/edit.do',
          delete: 'news/delete.do',
          batchDelete: 'news/batchDelete.do',
          batchPublish: 'news/batchPublish.do',
          newsSource: 'communal/news/sources.do'
        },
        tinymceId: 'news',
        pager: {
          data: [
            {
              id: '22972',
              areaId: '659007',
              url: '',
              title: '光明新区周家大道（马田段）土地整备攻坚战告捷',
              newsSrc: '绿色光明网',
              content: '今鞍山道卡萨丁',
              date: '',
              image: 'http://iguangming.sznews.com/images/attachement/png/site640/20171220/IMG889ffafebae246370159022.PNG',
              commentNum: '789',
              upvoteNum: '798',
              shareNum: '897',
              status: '0',
              detailAddress: '深圳市光明新区'
            }, {
              id: '22970',
              areaId: '659007',
              url: '',
              title: '光明新区首设全待行路口 提升道路通行能力',
              newsSrc: '绿色光明网',
              content: '阿斯顿',
              date: '',
              image: 'http://iguangming.sznews.com/images/attachement/jpg/site640/20171220/IMGb083feb941e04637355087.jpg',
              commentNum: '123',
              upvoteNum: '132',
              shareNum: '312',
              status: '1',
              detailAddress: '深圳市光明新区'
            }, {
              id: '22968',
              areaId: '659005',
              url: '',
              title: '观湖街道“上围艺术+”党群驿站揭牌启用',
              newsSrc: '龙华网',
              content: '为人头就偶尔提',
              date: '',
              image: 'http://ilonghua.sznews.com/images/attachement/jpg/site1011/20171219/IMG74e543574fc54636456847.jpg',
              commentNum: '456',
              upvoteNum: '465',
              shareNum: '654',
              status: '2',
              detailAddress: '深圳市龙华新区'
            }
          ],
          url: 'news/dataGrid.do',
          sort: 'createTime',
          order: 'desc'
        },
        previewModal: false,
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        derail_address_arr: [],
        derail_address_obj_s: [],
        batchOprArr: [],
        newsSource: [], // 新闻来源网站数组 例子： ['南方网', '人民网']
        previewData: {
          title: '',
          newsSrc: '',
          date: '',
          content: '',
        },
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
          id: '',
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
                    type: 'success',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      for (let key in vm.previewData) {
                        vm.previewData[key] = params.row[key]
                      }
                      vm.previewModal = true
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
      updateSelect (selection) {
        this.batchOprArr = selection
      },
      resetSearch (name) {
        var vm = this
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
      batchDelete () {
        console.log('批量删除数据： ',this.batchOprArr)
      },
      batchPublish () {
        console.log('批量发布数据： ',this.batchOprArr)
      },
      handleSuccess () {},
      resetDialogForm (name) {
        let vm = this
        vm.setContent('')
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {
        this.util.submitDialogForm(this, name)
      },
      setContent (content) {
        let set = ''
        if (content) {
          set = content
        }
        window.tinymce.get(this.tinymceId).setContent(set)
      },
      updateContent (content) {
        this.formDialog.content = content
      },
      initDialog (data) {
        let vm = this
        let _data = vm.util.extend(data)
        vm.setContent(_data.content)
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
    created () {
      let vm = this
      vm.initData()
      vm.$store.commit('initPager', vm)
      vm.paging(vm)
    },
    mounted () {},
    watch: {
      derail_address_obj_s (val) {
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
