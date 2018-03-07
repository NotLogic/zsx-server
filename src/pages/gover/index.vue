<template>
  <div class="policy">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="标题" prop="title">
        <Input v-model="formSearch.title" placeholder="标题" size="small" style="width: 120px"></Input>
      </FormItem>
      <FormItem label="关联地区">
        <Cascader :data="derail_address_arr" v-model="derail_address_obj_s" @on-change="searchAddrChange" filterable size="small" style="margin-top: 5px;"></Cascader>
      </FormItem>
      <FormItem label="状态" prop="status">
        <Select v-model="formSearch.status" placeholder="请选择" style="width: 80px;" size="small" clearable>
          <Option value="0">未发布</Option>
          <Option value="1">已发布</Option>
        </Select>
      </FormItem>
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="950" @on-cancel="resetDialogForm('formDialog')" :styles="{top:'25px'}">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="90" style="max-width: 900px;">
        <Row>
          <Col span="12">
            <FormItem label="标题" prop="title">
              <Input v-model="formDialog.title" placeholder="请输入标题"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="所属地区">
              <Cascader :data="derail_address_arr" v-model="derail_address_obj_sub" @on-change="subAddrChange" filterable style="margin-top: 5px"></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="政务来源" prop="governmentSource">
              <Input v-model="formDialog.governmentSource" placeholder="请输入政务来源"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="来源地址" prop="sourceUrl">
              <Input v-model="formDialog.sourceUrl" placeholder="请输入来源地址"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="政务发布时间" prop="governmentDate">
              <Date-picker type="date" v-model="formDialog.governmentDate" :editable="false" placeholder="请选择日期"></Date-picker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="政务时间规则" prop="dateRule">
              <Input v-model="formDialog.dateRule" placeholder="请输入政务时间规则"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="图片" prop="image">
              <Row>
                <Col span="12">
                  <div style="width:100px;height:100px;border:1px solid #eee;">
                    <img v-if="formDialog.image" style="max-width:100%;" :src="formDialog.image" />
                    <img v-else style="max-width:100%;" src="static/images/img-upload-default.png"/>
                  </div>
                </Col>
                <Col span="12" style="text-align:right;">
                  <Upload name="upfile"
                          action="ueditor/upload.do"
                          :on-success="handleSuccess"
                          :show-upload-list="false"
                          :format="['jpg','jpeg','png']"
                          :on-format-error="handleFormatError">
                    <Button type="ghost" icon="ios-cloud-upload-outline">{{label.uploadImg}}</Button>
                  </Upload>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="状态" prop="status">
              <Select v-model="formDialog.status" placeholder="请选择政务状态" clearable style="width: 150px;">
                <Option value="0">未发布</Option>
                <Option value="1">已发布</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="内容" prop="content">
              <!-- 富文本 -->
              <editor @updateContent="updateContent" :content="formDialog.content"></editor>
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
    <Modal v-model="previewModal" id="preview-modal" title="预览" :styles="{top:'50px'}" :mask-closable="false" width="850" @on-cancel="resetPreview">
      <Row>
        <Col span="24" class="title">政务基本信息:</Col>
      </Row>
      <Row :gutter="16" class-name="preview-row">
        <Col span="12">标题:  {{previewData.title}}</Col>
        <Col span="12" id="preview-image">图片:   <img :src="previewData.image"></Col>
      </Row>
      <Row :gutter="16" class-name="preview-row">            
        <Col span="12">所属地区:  {{previewData.provinceCityarea}}</Col>
        <Col span="12">政务来源:  {{previewData.governmentSource}}</Col>
      </Row>
      <Row :gutter="16" class-name="preview-row">
        <Col span="12">来源地址:  <a :href="previewData.sourceUrl" target="_blank">{{previewData.sourceUrl}}</a></Col>
        <Col span="12">政务发布时间:  {{previewData.governmentDate}}</Col>
      </Row>
      <Row :gutter="16" class-name="preview-row" style="border-bottom: .5px solid #e9eaec;padding-bottom: 5px;">
        <Col span="12">政务时间规则:  {{previewData.dateRule}}</Col>
        <Col span="12">状态:  {{previewData.status}}</Col>
      </Row>
      <Row class-name="preview-row">
        <Col span="24">
          <div class="title">政务内容:</div>
          <div class="preview-txt" v-html="previewData.content"></div>
        </Col>
      </Row>
      <div slot="footer">            
        <Button type="primary" @click="resetPreview">{{label.close}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import tinymce from 'tinymce'
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import editor from '@/components/tinymce'
  export default {
    name: 'gover_index',
    components: {
      mainTable,
      paging,
      editor
    },
    data: function () {
      return {
        url: {
          add: 'gover/add.do',
          edit: 'gover/edit.do',
          delete: 'gover/delete.do'
        },
        pager: {
          data: [
            {
              id: '123456789',
              title: '灵璧广业·凯旋门项目二期规划 批前公示',
              provinceId: '340000',
              cityId: '341300',
              areaId: '341323',
              image: 'http://www.lingbi.gov.cn/UploadFile/image/20171215/2017121516510522522.jpg',
              content: '萨拉就肯定是可否考虑对方是',
              governmentSource: '灵璧县政府网',
              sourceUrl: 'http://www.szns.gov.cn/xxgk/qzfxxgkml/zcwj/qjzcwj/201712/t20171208_10200040.htm',
              governmentDate: '2017-12-15 00:00:00',
              dateRule: '123',
              status: '1'
            }, {
              id: '123456789',
              title: '浍塘沟商贸城项目《建设工程规划许可证》批前公示',
              provinceId: '340000',
              cityId: '341300',
              areaId: '341323',
              image: 'http://www.lingbi.gov.cn/UploadFile/image/20180102/20180102085222382238.jpg',
              content: '‘老师打卡记录是的会计分录',
              governmentSource: '灵璧县政府网',
              sourceUrl: 'http://www.szns.gov.cn/xxgk/qzfxxgkml/zcwj/qjzcwj/201710/t20171012_9339847.htm',
              governmentDate: '2017-12-15 00:00:00',
              dateRule: '456',
              status: '0'
            }, {
              id: '123456789',
              title: '中意制丝有限责任公司2.5万吨粮食仓储库建设项目《建设工程规划许可证》批前公示',
              provinceId: '340000',
              cityId: '341300',
              areaId: '341323',
              image: 'http://www.lingbi.gov.cn/UploadFile/image/20171212/20171212161063206320.jpg',
              content: '的路上特任天堂官方',
              governmentSource: '灵璧县政府网',
              sourceUrl: 'http://www.szns.gov.cn/xxgk/qzfxxgkml/zcwj/qjzcwj/201710/t20171012_9339848.htm',
              governmentDate: '2017-12-15 00:00:00',
              dateRule: '789',
              status: '1'
            }
          ],
          url: 'gover/dataGrid.do'
        },
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        previewModal: false,
        previewData: {},
        chinaJson: {},
        derail_address_arr: [],
        derail_address_obj_sub: [],
        derail_address_obj_s: [],
        formSearch: {
          title: '',
          status: '',
          areaId: ''
        },
        formDialog: {
          id: '',
          title: '',
          provinceId: '',
          cityId: '',
          areaId: '',
          image: '',
          content: '',
          governmentSource: '',
          sourceUrl: '',
          governmentDate: '',
          dateRule: '',
          status: ''
        },
        columns: [
          {
            type: 'selection',
            width: 80,
            align: 'center',
            fixed: 'left'
          }, {
            title: '标题',
            key: 'title',
            width: 200,
            sortable: true
          }, {
            title: '图片',
            key: 'image',
            width: 120,
            render: function (create, params) {
              if (params.row.image == '' || params.row.image == 'null') {
                return create('span', '暂无图片')
              } else {
                return create('img', {
                  style: {
                    maxWidth: '100px',
                    margin: '10px'
                  },
                  attrs: {
                    src: params.row.image
                  }
                })
              }
            }
          },
          {
            title: '来源地址',
            key: 'sourceUrl',
            width: 250,
            render: (create, params) => {
              var vm = this
              return create('a', {
                style: {},
                attrs: {
                  href: params.row.sourceUrl,
                  target: '_blank'
                }
              }, params.row.sourceUrl)
            }
          }, {
            title: '所属省',
            key: 'provinceId',
            width: 180,
            sortable: true,
            render: (create, params) => {
              var vm = this
              var txt = ''
              var addrArr = [params.row.provinceId]
              txt = vm.util.getProvinceCityArea(addrArr, vm.chinaJson)
              return create('span', txt)
            }
          }, {
            title: '所属市',
            key: 'cityId',
            width: 180,
            sortable: true,
            render: (create, params) => {
              var vm = this
              var txt = ''
              var addrArr = [params.row.provinceId, params.row.cityId]
              txt = vm.util.getProvinceCityArea(addrArr, vm.chinaJson)
              return create('span', txt)
            }
          }, {
            title: '所属区',
            key: 'areaId',
            width: 180,
            sortable: true,
            render: (create, params) => {
              var vm = this
              var txt = ''
              var addrArr = [params.row.provinceId, params.row.cityId, params.row.areaId]
              txt = vm.util.getProvinceCityArea(addrArr, vm.chinaJson)
              return create('span', txt)
            }
          }, {
            title: '政务来源',
            key: 'governmentSource',
            width: 120,
            sortable: true
          }, {
            title: '政务发布时间',
            key: 'governmentDate',
            width: 180,
            sortable: true
          }, {
            title: '创建时间',
            key: 'createTime',
            width: 180,
            sortable: true
          }, {
            title: '时间规则',
            key: 'dateRule',
            width: 140,
            sortable: true
          }, {
            title: '状态',
            key: 'status',
            width: 80,
            render: function (create, params) {
              var map = {
                0: '未发布',
                1: '已发布'
              }
              return create('span', map[params.row.status])
            }
          }, {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              var vm = this
              return create('div', [
                create('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: function () {
                      vm.policyPreview(params.index, params.row)
                    }
                  }
                }, '预览'),
                create('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: function () {
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
    methods: {
      addRow () {
        this.$store.commit('addRow', this)
      },
      resetDialogForm (name) {
        let vm = this
        vm.derail_address_obj_sub = []
        vm.setContent('')
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {
        this.util.submitDialogForm(this, name)
      },
      searchAddrChange (value) {
        this.formSearch.areaId = value[2]
      },
      subAddrChange (value) {
        var vm = this
				vm.formDialog.provinceId = value[0]
				vm.formDialog.cityId = value[1]
				vm.formDialog.areaId = value[2]
      },
      handleSuccess (res) {
        if(res.state=="SUCCESS"){
          this.$Message.success("上传成功！")
          this.formDialog.image = res.url
        }
      },
      handleFormatError () {
        this.$Message.error('文件格式错误，请选择jpg,jpeg或png格式的文件')
      },
      policyPreview: function(index,data){
        var vm = this;
        var _data= vm.util.extend(data);
        if(_data.status=="0"){
          _data.status = "未发布"
        }else{
          _data.status = "已发布"
        }
        _data.provinceCityarea = vm.util.getProvinceCityArea([_data.provinceId,_data.cityId,_data.areaId],vm.chinaJson,true);                
        vm.previewData = _data
        vm.previewModal = true
      },
      resetPreview: function(){
        this.previewModal = false
        this.previewData = {}
      },
      resetSearch (name) {
        var vm = this
        vm.formSearch.status = ""
        vm.formSearch.areaId = ''
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
      setContent (content) {
        let set = ''
        if (content) {
          set = content
        }
        tinymce.get('tinymceEditer').setContent(set)
      },
      updateContent (content) {
        this.formDialog.content = content
      },
      initDialog (data) {
        let vm = this
        let _data = vm.util.extend(data)
        vm.derail_address_obj_sub = [_data.provinceId, _data.cityId, _data.areaId]
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
        vm.chinaJson = JSON.parse(sessionStorage.chinaJson)
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
    mounted () {
      
    },
    watch: {
      dialogShow (val) {
        if (!val) {
          this.currDialog = 'add'
        }
      },
      derail_address_obj_sub (val) {
        let vm = this
        if (val.length) {
          vm.formDialog.provinceId = val[0]
          vm.formDialog.cityId = val[1]
          vm.formDialog.areaId = val[2]
        } else {
          vm.formDialog.provinceId = ''
          vm.formDialog.cityId = ''
          vm.formDialog.areaId = ''
        }
      }
    }
  }
</script>

<style scoped>
  #preview-modal .ivu-col{
		font-size: 14px;
		word-wrap:break-word;
	}
	#preview-modal .ivu-modal-header-inner{
		font-size: 20px;
	}
	#preview-modal .title{
    font-size: 15px;
    font-weight: 700;
	}
	.preview-row{
    margin: 4px 0;
	}
	#preview-image img{
  max-width: 150px;
  max-height:150px;
	}
	.preview-txt{
  max-height: 450px;
  overflow-y:auto;    
  text-indent: 28px;
	}
</style>
