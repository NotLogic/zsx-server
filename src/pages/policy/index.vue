<template>
  <div class="policy">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="标题" prop="title">
        <Input v-model="formSearch.title" placeholder="标题" size="small" style="width: 120px"></Input>
      </FormItem>
      <FormItem label="关联地区">
        <Cascader :data="derail_address_arr" v-model="derail_address_obj_s" filterable size="small" style="margin-top: 5px;"></Cascader>
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
    <!-- 弹出框 -->
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="标题" prop="title">
              <Input v-model="formDialog.title" placeholder="请输入标题"></Input>
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
            <FormItem label="所属地区">
              <Cascader :data="derail_address_arr" v-model="derail_address_obj_sub" @on-change="subAddrChange" filterable style="margin-top: 5px"></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="政策来源" prop="policySoucre">
              <Input v-model="formDialog.policySoucre" placeholder="请输入政策来源"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="政策时间" prop="policyDate">
              <DatePicker type="date" v-model="formDialog.policyDate" :editable="false" placeholder="请选择日期"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="时间规则" prop="dateRule">
              <Input v-model="formDialog.dateRule" placeholder="请输入时间规则"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="图片" prop="images">
              <Row>
                <Col span="12">
                  <div style="width:130px;border:1px solid #eee;">
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
              <Select v-model="formDialog.status" placeholder="请选择招商状态" clearable style="width: 150px;">
                <Option value="0">未发布</Option>
                <Option value="1">已发布</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="内容" prop="content">
              <ueditor :id="'policyUeditor'" :content="formDialog.content"></ueditor> 
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
    <Modal v-model="previewModal" title="预览" id="preview-modal" :styles="{top:'50px'}" width="850" @on-cancel="resetPreview">
    	<Row>
    		<i-col span="24" class="title">招商基本信息:</i-col>
    	</Row>
    	<Row :gutter="16" class-name="preview-row">
            <i-col span="12">标题:  {{previewData.title}}</i-col>
            <i-col span="12" id="preview-image">图片:  <img :src="previewData.image"></i-col>
        </Row>
        <Row :gutter="16" class-name="preview-row">
            <i-col span="12">来源地址:  <a :href="previewData.sourceUrl" target="_blank">{{previewData.sourceUrl}}</a></i-col>
            <i-col span="12">所属地区:  {{previewData.provinceCityarea}}</i-col>
        </Row>
        <Row :gutter="16" class-name="preview-row">
            <i-col span="12">政策来源:  {{previewData.policySoucre}}</i-col>
            <i-col span="12">政策时间:  {{previewData.policyDate}}</i-col>
        </Row>
        <Row :gutter="16" class-name="preview-row" style="border-bottom: .5px solid #e9eaec;padding-bottom: 5px;">
            <i-col span="12">时间规则:  {{previewData.dateRule}}</i-col>
            <i-col span="12">状态:  {{previewData.status}}</i-col>
        </Row>  
        <Row class-name="preview-row">
            <i-col span="24">
                <div class="title">招商内容:</div>
                <div class="preview-txt" v-html="previewData.content"></div>
            </i-col>
        </Row>      
    	<div slot="footer">            
            <i-button type="primary" @click="resetPreview">确定</i-button>
        </div>
	</Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import ueditor from '@/components/ueditor'
  // 为什么下边的会提示模块找不到
  // import ueditor from '@/components/ueditor/text-editor'
  export default {
    name: 'policy_index',
    components: {
      mainTable,
      paging,
      ueditor
    },
    data: function () {
      return {
        url: {
          add: 'policy/add.do',
          edit: 'policy/edit.do',
          delete: 'policy/delete.do',
          paging: 'policy/dataGrid.do'
        },
        pager: {
          url: "policy/dataGrid.do",
          data: [
            {
              id: '12345678',
              title: '大鹏新区出台重点产业项目遴选实施办法',
              provinceId: '440000',
              image: 'http://www.sz.gov.cn/lhxq/qt/zsyz/tzdt/201706/W020170612595410856312.jpg',
              cityId: '440300',
              areaId: '440306',
              content: '',
              sourceUrl: 'http://www.sz.gov.cn/dpxq/qt/zsy',
              policySoucre: '深圳市政府网',
              policyDate: '2017-12-13 00:00:00',
              createTime: '2017-12-13 00:00:00',
              dateRule: '123',
              status: '0'
            }, {
              id: '12345678',
              title: '提供优质服务 助力企业做大做强',
              provinceId: '440000',
              image: 'http://www.sz.gov.cn/lhxq/qt/zsyz/tzdt/201706/W020170612595410856312.jpg',
              cityId: '440100',
              areaId: '440113',
              content: '',
              sourceUrl: 'http://www.sz.gov.cn/dpxq/qt/zsy',
              policySoucre: '深圳市政府网',
              policyDate: '2017-12-21 00:00:00',
              createTime: '2017-12-13 00:00:00',
              dateRule: '456',
              status: '1'
            }, {
              id: '12345678',
              title: '高交会圆满闭幕 大鹏新区亮点纷呈',
              provinceId: '440000',
              image: 'http://barb.sznews.com/attachment/images/201710/11/9c0a3c20-d207-4f57-9258-2a4e2a778956.jpg.1',
              cityId: '440600',
              areaId: '440607',
              content: '',
              sourceUrl: 'http://www.sz.gov.cn/dpxq/qt/zsy',
              policySoucre: '深圳市政府网',
              policyDate: '2017-10-16 00:00:00',
              createTime: '2017-12-13 00:00:00',
              dateRule: '789',
              status: '0'
            }
          ]
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
          image: '',
          cityId: '',
          areaId: '',
          content: '', // 富文本内容
          sourceUrl: '',
          policySoucre: '',
          policyDate: '',
          dateRule: '',
          status: ''
        },
        columns: [
          {
            type: "selection",
            width: 80,
            align: "center",
            fixed: "left"
          }, {
            title: "标题",
            key: "title",
            width: 200,
            sortable: true
          }, {
            title: "图片",
            key: "image",
            width: 120,
            render: function (create, params) {
              if (params.row.image == "" || params.row.image == 'null') {
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
          }, {
            title: "所属省",
            key: "provinceId",
            width: 180,
            sortable: true,
            render: (create, params) => {
              var vm = this
              var txt = ""
              var addrArr = [params.row.provinceId]
              txt = vm.util.getProvinceCityArea(addrArr, vm.chinaJson)
              return create('span', txt)
            }
          }, {
            title: "所属市",
            key: "cityId",
            width: 180,
            sortable: true,
            render: (create, params) => {
              var vm = this
              var txt = ""
              var addrArr = [params.row.provinceId, params.row.cityId];
              txt = vm.util.getProvinceCityArea(addrArr, vm.chinaJson);
              return create('span', txt)
            }
          }, {
            title: "所属区",
            key: "areaId",
            width: 180,
            sortable: true,
            render: (create, params) => {
              var vm = this
              var txt = ""
              var addrArr = [params.row.provinceId, params.row.cityId, params.row.areaId]
              txt = vm.util.getProvinceCityArea(addrArr, vm.chinaJson)
              return create('span', txt)
            }
          }, {
            title: "政策来源",
            key: "policySoucre",
            width: 120,
            sortable: true
          }, {
            title: "来源地址",
            key: "sourceUrl",
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
            title: "政策时间",
            key: "policyDate",
            width: 180,
            sortable: true
          }, {
            title: "创建时间",
            key: "createTime",
            width: 180,
            sortable: true
          }, {
            title: "时间规则",
            key: "dateRule",
            width: 180,
            sortable: true
          }, {
            title: "状态",
            key: "status",
            width: 80,
            render: function (create, params) {
              var map = {
                0: '未发布',
                1: '已发布'
              }
              return create('span', map[params.row.status])
            }
          }, {
            title: "操作",
            key: "action",
            width: 200,
            align: "center",
            fixed: "right",
            render: (create, params) => {
              var vm = this
              return create('div', [
                create('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: function () {
                      vm.policyPreview(params.index,params.row)
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
                      console.log('删除')
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
        vm.formDialog.id = '0'
        vm.formDialog.image = ''
        vm.derail_address_obj_sub = []
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
      resetSearch (name) {
        let vm = this
        vm.$refs[name].resetFields()
        vm.derail_address_obj_s = []
        vm.submitSearch(name)
      },
      submitSearch (name) {
        let vm = this
        vm.$store.dispatch('submitSearch', {
          'vm': vm,
          'name': name
        })
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
      resetPreview () {
        this.previewModal = false
        this.previewData = {}
      },
      policyPreview: function(index,data){
				var vm = this;
				var _data= vm.util.extend(data);
        if(_data.status=="0"){
            _data.status = "未发布";
        }else{
            _data.status = "已发布";
        }                                
        _data.provinceCityarea = vm.util.getProvinceCityArea([_data.provinceId,_data.cityId,_data.areaId],vm.chinaJson,true);                
        vm.previewData = _data;
        vm.previewModal = true;
			},
      initDialog (data) {
        let vm = this
        let _data = vm.util.extend(data)
        vm.derail_address_obj_sub = [_data.provinceId, _data.cityId, _data.areaId]
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
      derail_address_obj_s (val) {
        if (val[val.length - 1] == null) return
        this.formSearch.areaId = val[val.length - 1]
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
		max-height: 150px;
	}
	.preview-txt{
		max-height: 450px;
		overflow-y:auto;     
    text-indent: 28px;
	}
</style>
