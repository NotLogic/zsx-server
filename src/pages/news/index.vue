<template>
  <div class="news">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="关键词" prop="keyWord">
        <Input v-model="formSearch.keyWord" placeholder="标题" size="small" style="width: 120px"></Input>
      </FormItem>
      <!-- <FormItem label="新闻ID" prop="id">
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
        </FormItem> -->
      </FormItem>
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="ghost" :disabled="batchOprArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchDelete" size="small">批量删除</Button>
      <Button type="primary" :disabled="batchOprArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchPublish" size="small">批量发布</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data" @updateSelect="updateSelect"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="800" @on-cancel="resetDialogForm('formDialog')" :styles="{top:'30px'}">
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
              <Input v-model="formDialog.detailAddress" disabled></Input>
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
          <Col span="12">
            <FormItem label="来源url" prop="url">
              <Input v-model="formDialog.url" placeholder="请输入来源url"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="新闻状态" prop="newsStatus">
              <Select v-model="formDialog.newsStatus" placeholder="请选择"  clearable>
                <Option v-for="item in newsStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span="12">
            <FormItem label="发布时间" prop="newsDate">
              <Input v-model="formDialog.newsDate" placeholder="请输入标题"></Input>
              <DatePicker type="date" placeholder="点击选择出生日期" @on-change="newsDateChange" v-model="newsDate" :clearable="false"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="新闻类型" prop="newsType">
              <Input v-model="formDialog.newsType" placeholder="请输入来源url"></Input>
              <!-- <Select v-model="formDialog.newsType" placeholder="请选择"  clearable>
                <Option v-for="item in newsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select> -->
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
        <div class="preview-content">
          <div v-html="previewData.content"></div>
        </div>
        <br>
        <div slot="footer">
            <Button type="primary" @click="previewModal=false">关闭</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import page from '@/mixins/page'
  import tinymce from '@/components/tinymce'
  export default {
    name: 'news_index',
    components: {
      mainTable,
      paging,
      tinymce
    },
    mixins: [page],
    data: function () {
      return {
        url: {
          add: 'web/news/add',
          edit: 'web/news/update',
          delete: 'web/news/delete',
          batchDelete: 'web/news/batchDelete',
          batchPublish: 'web/news/batchPublish',
          newsSource: 'web/communal/news/sources'
        },
        tinymceId: 'news',
        pager: {
          data: [],
          url: 'web/news/dataGrid',
        },
        previewModal: false,
        derail_address_arr: [],
        derail_address_obj_s: [],
        batchOprArr: [],
        newsSource: [], // 新闻来源网站数组 例子： ['南方网', '人民网']
        newsStatus: [
          {
            value: '1',
            label: '未发布'
          },
          {
            value: '2',
            label: '已发布'
          },
        ],
        newsDate: '',
        newsStatusMap: {},
        newsType: [
          {
            value: '',
            label: ''
          },
          {
            value: '',
            label: ''
          },
        ],
        newsTypeMap: {},
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
          url: '',
          title: '',
          newsImage: '',
          newsSrc: '',
          content: '',
          newsStatus: '1',
          newsType: '',
          newsDate: '',
          areasCode: '',
          cityCode: '',
          provincesCode: '',
          detailAddress: '',
          createTime: ''
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
            'key': 'areasCode',
            'width': 120,
            'sortable': true
          },
          {
            'title': '新闻图片',
            'key': 'newsImage',
            'width': 120,
            'sortable': true,
            render: function (create, params) {
              // 多张图片的处理
              var src = params.row.newsImage ? params.row.newsImage.split(',')[0] : '无'
              return create('img', {
                attrs: {
                  src: src
                },
                style: {
                  'border': '1px solid transparent',
                  'margin': '10px',
                  'border-radius': '4px',
                  'max-width': '100px',
                  'max-height': '100px'
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
          },
          {
            'title': '来源url',
            'key': 'url',
            'width': 200,
            render: function (create, params) {
              return create('a', {
                attrs: {
                  'href': params.row.url,
                  'target': '_blank'
                },
              },params.row.url)
            }
          },
          {
            'title': '关联地区',
            'key': 'detailAddress',
            'width': 160,
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
            width: 220,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this
              return create('div', [
                vm.createEditBtn(create, params.row),
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
                      vm.$Message.info(vm.label.wait)
                    }
                  }
                }, '发布'),
                // vm.createDelBtn(create, params.row.id)
              ])
            }
          }
        ],
        rules: {}
      }
    },
    methods: {
      newsDateChange(date){
        this.formDialog.newsDate = date
      },
      updateSelect (selection) {
        this.batchOprArr = selection
      },
      resetSearch (name) {
        var vm = this
        vm.derail_address_obj_s = []
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
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
      initData () {
        let vm = this
        vm.derail_address_arr = JSON.parse(sessionStorage.chinaData)
      }
    },
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
  .preview-content{
    overflow-y:auto;
    max-height:500px;
  }
  /* 为什么选不中 */
  .preview-content img{
    padding: 20px;
    max-width: 90%!important;
  }
</style>

