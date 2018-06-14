<template>
  <div class="news">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="标题" prop="title">
        <Input v-model="formSearch.title" placeholder="标题" size="small" style="width: 120px"></Input>
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
      <Button type="error" :disabled="batchOprArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchDelete" size="small">批量删除</Button>
      <Button type="ghost" :disabled="batchOprArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchPublish" size="small">批量发布</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data" @updateSelect="updateSelect"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="800" @on-cancel="resetDialogForm('formDialog')" :styles="{top:'30px'}">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="24">
            <FormItem label="新闻标题" prop="title">
              <Input v-model="formDialog.title" placeholder="请输入标题"></Input>
            </FormItem>
          </Col>
          <!-- <Col span="10">
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
          </Col> -->
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="新闻来源" prop="newsSrc">
              <Input v-model="formDialog.newsSrc" placeholder="请输入新闻来源"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="关联地区">
              <Input v-model="formDialog.detailAddress" :disabled="currDialog=='edit'"></Input>
            </FormItem>
          </Col>
        </row>
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
              <DatePicker type="date" placeholder="点击选择出生日期" @on-change="newsDateChange" v-model="newsDate" :clearable="false"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="新闻类型" prop="newsType">
              <Select v-model="formDialog.newsType" placeholder="请选择" filterable clearable>
                <Option v-for="item in newsType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
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
          edit: 'web/news/update',
          delete: 'web/news/delete',  //  {ids: [放需要删除的id]}
          search: 'web/news/dataSearch',
          batchPublish: 'web/news/release',
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
        batchIdArr: [],
        newsSource: [], // 新闻来源网站数组 例子： ['南方网', '人民网']
        newsStatus: [
          {
            value: '1',
            label: '未发布'
          },
          {
            value: '0',
            label: '已发布'
          },
        ],
        newsDate: '',
        newsStatusMap: {
          "0": "已发布",
          "1": "未发布"
        },
        newsType: [
          {
            value: '1',
            label: '时尚'
          },
          {
            value: '2',
            label: '旅游'
          },
          {
            value: '3',
            label: '母婴'
          },
          {
            value: '4',
            label: '科技'
          },
          {
            value: '5',
            label: '教育'
          },
          {
            value: '6',
            label: '健康'
          },
          {
            value: '7',
            label: '美食'
          },
          {
            value: '8',
            label: '文化'
          },
          {
            value: '9',
            label: '历史'
          },
          {
            value: '10',
            label: '星座'
          },
          {
            value: '11',
            label: '动漫'
          },
          {
            value: '12',
            label: '游戏'
          },
          {
            value: '13',
            label: '娱乐'
          },
          {
            value: '14',
            label: '军事'
          },
          {
            value: '15',
            label: '社会'
          },
          {
            value: '16',
            label: '宏观'
          },
          {
            value: '17',
            label: '理财'
          },
          {
            value: '18',
            label: '财经'
          },
        ],
        newsTypeMap: {
          "1": "时尚",
          "2": "旅游",
          "3": "母婴",
          "4": "科技",
          "5": "教育",
          "6": "健康",
          "7": "美食",
          "8": "文化",
          "9": "历史",
          "10": "星座",
          "11": "动漫",
          "12": "游戏",
          "13": "娱乐",
          "14": "军事",
          "15": "社会",
          "16": "宏观",
          "17": "理财",
          "18": "财经"
        },
        previewData: {
          title: '',
          newsSrc: '',
          date: '',
          content: '',
        },
        formSearch: {
          // startTime: '',
          // endTime: '',
          // province: 0,
          // city: 0,
          // type: null,
          // lockStatus: null,
          title: '',
          // areaType: '0'
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
          newsDate: '', //  发布日期
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
              var src = params.row.newsImage ? params.row.newsImage.split(',')[0] : ''
              if(src){
                return create('img', {
                  attrs: {
                    src: src
                  },
                  style: {
                    'border': '1px solid transparent',
                    'margin': '10px 0',
                    'border-radius': '4px',
                    'max-width': '100px',
                    'max-height': '100px'
                  }
                })
              }else{
                return create('span', '无')
              }
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
            'title': '新闻类型',
            'key': 'newsType',
            'width': 150,
            render: (create, params)=>{
              var vm = this
              var txt = '',newsType = params.row.newsType
              if(typeof newsType != 'undefined'){
                txt = vm.newsTypeMap[newsType.toString()]
              }
              return create('span',txt)
            }
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
            'title': '状态',
            'key': 'newsStatus',
            'width': 100,
            'sortable': true,
            render: (create, params) => {
              var vm = this
              var status = params.row.newsStatus
              if(typeof status == 'number'){
                status = status.toString()
              }
              return create('span', vm.newsStatusMap[status])
            }
          },
          {
            'title': '采集时间',
            'key': 'createTime',
            'width': 160,
            'sortable': true,
            render: (create, params)=>{
              var vm = this
              var txt = '',stamp = params.row.createTime
              if(typeof stamp == 'number'){
                txt = vm.util.timestampToTime(stamp)
              }else{
                txt = stamp
              }
              return create('span',txt)
            }
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
            title: '操作',
            key: 'action',
            width: 220,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this
              var disabled = params.row.newsStatus == 1 ? false : true
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
                    size: 'small',
                    disabled: disabled
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      vm.$Modal.confirm({
                        title: '确认',
                        content: '确认发布这条数据吗？',
                        onOk: function () {
                          vm.newsPublish(params.row.id)    
                        }
                      })
                    }
                  }
                }, '发布'),
                vm.createDelBtn(create, params.row.id)
              ])
            }
          }
        ],
        rules: {}
      }
    },
    methods: {
      submitSearch (name) {
        let vm = this
        // 搜索操作
        vm.$http({
          url: vm.url.search,
          method: vm.pager.method,
          data: vm.formSearch
        }).then(res => {
          var resData = res.data
          if(resData.code==1){
            vm.pager.data = resData.data
          }else{
            vm.$Message.error('搜索失败: ' + resData.message)
          }
        }).catch(err=>{})
      },
      delRow(data){
        var vm = this;
        if(!data.id){
          vm.$Message.error('id获取失败')
          return
        }
        var parmas = {
          method: 'post',
          url: vm.url.delete,
          data: {
            ids: [data.id]
          }
        }
        vm.batchoperation(parmas)
      },
      // 批量操作
      batchoperation(parmas){
        var vm = this
        if(typeof parmas != 'object'){
          vm.$Message.error('传参错误')
          return
        }
        parmas.method = parmas.method || 'post'
        vm.$http2(parmas).then(res=>{
          var resData = res.data
          if(resData.code==1){
            vm.$Message.success('操作成功');
            vm.paging()
          }else{
            vm.$Message.error(resData.message);
          }
        }).catch(err=>{})
      },
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
      newsPublish(id){
        var vm = this;
        if(!id){
          vm.$Message.error('id获取失败')
          return
        }
        var parmas = {
          method: 'post',
          url: vm.url.batchPublish,
          data: {
            ids: [id]
          }
        }
        vm.batchoperation(parmas)
      },
      batchDelete () {
        var vm = this
        vm.$Modal.confirm({
          title: '确认',
          content: '确认删除这些数据吗？',
          onOk: function () {
            var parmas = {
              method: 'post',
              url: vm.url.delete,
              data: {
                ids: vm.batchIdArr
              }
            }
            vm.batchoperation(parmas)
          }
        })
      },
      batchPublish () {
        var vm = this
        vm.$Modal.confirm({
          title: '确认',
          content: '确认发布这些数据吗？',
          onOk: function () {
            var parmas = {
              method: 'post',
              url: vm.url.batchPublish,
              data: {
                ids: vm.batchIdArr
              }
            }
            vm.batchoperation(parmas)
          }
        })
      },
      handleSuccess () {},
      resetDialogForm (name) {
        name = name || 'formDialog'
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
        vm.newsDate = data.newsDate
        if(typeof data.newsType == 'number'){
          data.newsType = data.newsType.toString()
        }
        vm.setContent(data.content)
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
      },
      batchOprArr (val){
        var vm = this,batchIdArr = [],len=val.length;
        if(len){
          for(var i=0;i<len;i++){
            batchIdArr.push(val[i].id)
          }
        }
        vm.batchIdArr = batchIdArr
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

