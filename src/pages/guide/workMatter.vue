<template>
  <div class="work-matter">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="事项名称" prop="matterName">
          <Input v-model="formSearch.matterName" placeholder="事项名称" size="small" style="width: 120px"></Input>
      </FormItem>
      <FormItem label="关联地区">
          <Cascader :data="derail_address_arr_ss" v-model="derail_address_obj_s" @on-change="searchAddrChange" filterable size="small" style="margin-top: 5px;"></Cascader>
      </FormItem>
      <FormItem label="所属分类" prop="workClassId">
        <Select v-model="formSearch.workClassId" size="small" style="width: 80px;">
          <Option value="0">个人</Option>
          <Option value="1">企业</Option>
        </Select>
      </FormItem>
      <FormItem label="状态" prop="matterStatus">
          <Select v-model="formSearch.matterStatus" placeholder="请选择" style="width: 80px;" size="small" clearable>
            <Option value="0">无效</Option>
            <Option value="1">有效</Option>
          </Select>
      </FormItem>
      <Button type="ghost" style="margin-right: 8px;margin-top: 5px;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin-right: 8px;margin-top: 5px;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin-right: 8px;margin-top: 5px;" @click="addRow" size="small">{{label.add}}</Button>
      <Upload name="execlFile"
                action="workMatter/execl.do"
                :on-success="upExeclSuccess"
                :format="['xlsx']"
                :on-format-error="handleFormatError"
                :show-upload-list="false"
                style="display:inline-block;">
          <Button type="primary" size="small" style="margin-top:5px;">{{label.uploadExcel}}</Button>
        </Upload>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <!-- 弹出框 -->
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="事项名称" prop="matterName">
              <Input v-model="formDialog.matterName" placeholder="请输入事项名称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="服务对象" prop="serviceObject">
              <Input v-model="formDialog.serviceObject" placeholder="请输入服务对象"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="事项来源" prop="matterSoucreName">
              <Input v-model="formDialog.matterSoucreName" placeholder="请输入事项来源"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="发布时间" prop="matterCreateTime">
              <DatePicker type="date" v-model="formDialog.matterCreateTime" :editable="false" placeholder="请选择日期"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="所属分类" prop="workClassId">
              <Select v-model="formDialog.workClassId" placeholder="请选择所属分类" style="width: 150px;">
                <Option v-for="item in workClassId" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="办理条件" prop="requiredConditions">
              <Row>
                <Col span="18">
                  <Input v-model="formDialog.requiredConditions" disabled placeholder="请添加办理条件"></Input>
                </Col>
                <Col span="6" style="text-align: right;">
                  <Button size="small" type="primary" @click="showHandleDialog('handleModal','requiredConditions')">{{label[currDialog]}}</Button>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="所需材料" prop="materialRequested">
              <Row>
                <Col span="18">
                  <Input v-model="formDialog.materialRequested" disabled placeholder="请添加所需材料"></Input>
                </Col>
                <Col span="6" style="text-align: right;">
                  <Button size="small" type="primary" @click="showHandleDialog('handleModal','materialRequested')">{{label[currDialog]}}</Button>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="网上流程" prop="onlineManagement">
              <Row>
                <Col span="18">
                  <Input v-model="formDialog.onlineManagement" disabled placeholder="请添加网上流程"></Input>
                </Col>
                <Col span="6" style="text-align: right;">
                  <Button size="small" type="primary" @click="showHandleDialog('handleModal','onlineManagement')">{{label[currDialog]}}</Button>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="限时说明" prop="timeLimitExplanation">
              <Input v-model="formDialog.timeLimitExplanation" placeholder="请输入限时说明"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="收费标准" prop="chargingStandard">
              <Input v-model="formDialog.chargingStandard" placeholder="请输入收费标准"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="办理依据" prop="managementBasis">
              <Input v-model="formDialog.managementBasis" placeholder="请输入办理依据"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="工作电话" prop="workPhone">
              <Input v-model="formDialog.workPhone" placeholder='请填工作电话'></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="监督电话" prop="complaintPhone">
              <Input v-model="formDialog.complaintPhone" placeholder='请填写监督电话'></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="事项图标">
              <Row>
                <Col span="12">
                  <div style="width:130px;height:130px;border:1px solid #eee;">
                    <img v-if="formDialog.matterIcon" style="max-width:100%;" :src="formDialog.matterIcon" />
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
            <FormItem label="事件状态">
              <Select v-model="formDialog.matterStatus" placeholder="请选择事件状态" style="width:150px;">
                <Option v-for="item in matterStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="省市">
              <Cascader :data="derail_address_arr" @on-change="addrChange" v-model="addrDialog.derail_address_obj" placeholder="请选择地址" clearabled="false" style="width: 150px;"></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="办事地址">
              <Button @click="addAddrBtn">添加地址</Button>
            </FormItem>
          </Col>
        </Row>
        <Row v-for="(item,index) in addrDialog.addressArr.slice(0,2)" :key="index" style="margin-bottom: 8px;">
          <i-col span="18">
            办事地址{{index+1}}:  {{item}}
          </i-col>   
          <i-col span="6">
            <i-button size="small" type="primary" @click="editAddrBtn(index)">编辑</i-button>
            <i-button size="small" type="error" @click="delAddr(index)" style="margin-left:8px;">删除</i-button>
          </i-col>
        </Row>
        <i-button v-if="addrDialog.addressArr.length>2" size="small" type="primary" @click="seeAddress">查看更多</i-button>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
    <!-- 地址弹出框 -->
    <Modal v-model="addrModal" :title="addEdit ? label.add : label.edit" :mask-closable="false" width="750" @on-cancel="resetAddr('addrDialog')">
        <Form :model="addrDialog" ref="addrDialog" :rules="rules" :label-width="100"> 
          <Row>
            <Col span="12">
                <FormItem label="区">
                    <Select v-model="addrDialog.areasId" placeholder="请选择所属区">
                        <Option v-for="item in areasId" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
            </Col>
            <Col span="12">
                <FormItem label="工作时间" prop="workDate">    
                    <Input v-model="addrDialog.workDate" placeholder='请填工作时间'></Input>
                </FormItem>
            </Col>
          </Row>           
          <Row>
            <Col span="24">
                <FormItem label="窗口单位名称" prop="companyName">                             
                    <Input v-model="addrDialog.companyName" placeholder='请填写窗口单位名称'></Input>
                </FormItem>
            </Col>
          </Row>
          <Row>                
            <Col span="24">
                <FormItem label="详细地址" prop="workAddress"> 
                    <Input v-model="addrDialog.workAddress" placeholder='请填写详细地址'></Input>
                </FormItem>
            </Col>                
          </Row>    
          <Row>
            <Col span="12">
                <FormItem label="事项链接" prop="matterSoucreUrl">
                    <Input v-model="addrDialog.matterSoucreUrl" placeholder="请输入事项链接"></Input>
                </FormItem>
            </Col>
          </Row>      
      </Form>
      <div slot="footer">
        <Button @click="resetAddr('addrDialog')">取消</Button>
        <Button type="primary" @click="beSure('addrDialog')">确定</Button>
      </div>
    </Modal>
    <Modal v-model="previewModal" title="预览" id="preview-modal" :mask-closable="false" width="750" @on-cancel="resetPreview">
      <Row>
          <i-col span="24" class="title">事项基本信息:</i-col>
      </Row>
      <Row :gutter="16" class-name="preview-row">
          <i-col span="12">事项名称:  {{previewData.matterName}}</i-col>
          <i-col span="12" id="service-object">服务对象:  {{previewData.serviceObject}}</i-col>
      </Row>
      <Row :gutter="16" class-name="preview-row">
          <i-col span="12">事项来源:  {{previewData.matterSoucreName}}</i-col>
          <i-col span="12">事项图标:  <img style="max-width: 100px;" :src="previewData.matterIcon" /></i-col>
      </Row>
      <Row :gutter="16" class-name="preview-row">
          <i-col span="12">所属分类:  {{previewData.workClassId}}</i-col>
          <i-col span="12">发布时间:  {{previewData.matterCreateTime}}</i-col>
      </Row>
      <Row :gutter="16" class-name="preview-row">
          <i-col span="12">限时说明:  {{previewData.timeLimitExplanation}}</i-col>
          <i-col span="12">收费标准:  {{previewData.chargingStandard}}</i-col>
      </Row>
      <Row :gutter="16" class-name="preview-row">
          <i-col span="12">所属省市:  {{previewData.provinceCity}}</i-col>
          <i-col span="12">事项状态:  {{previewData.matterStatus}}</i-col>
      </Row>        
      <Row :gutter="16" class-name="preview-row" style="border-bottom: .5px solid #e9eaec;padding-bottom: 5px;">
          <i-col span="12">工作电话:  {{previewData.workPhone}}</i-col>
          <i-col span="12">监督电话:  {{previewData.complaintPhone}}</i-col>
      </Row>        
      <Row class-name="preview-row">
          <i-col span="24">                
              <div class="title">办理条件:</div>
              <div class="preview-txt">{{previewData.requiredConditions}}</div>
          </i-col>
      </Row>
      <Row class-name="preview-row">
          <i-col span="24">                
              <div class="title">所需材料:</div>
              <div class="preview-txt">{{previewData.materialRequested}}</div>
          </i-col>
      </Row>
      <Row class-name="preview-row">
          <i-col span="24">                
              <div class="title">网上流程:</div>
              <div class="preview-txt">{{previewData.onlineManagement}}</div>
          </i-col>
      </Row>
      <Row class-name="preview-row">
          <i-col span="24">
              <div class="title">办理依据:</div>
              <div class="preview-txt">{{previewData.managementBasis}}</div>
          </i-col>
      </Row>
      <div slot="footer">
        <Button type="primary" @click="resetPreview">{{label.sure}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  export default {
    name: 'workMatter',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        url: {
          add: 'workMatter/add.do',
          edit: 'workMatter/edit.do',
          delete: 'workMatter/delete.do',
          check: 'workMatter/checkName.do'
        },
        pager: {
          data: [
            {
              id: '213123213',
              provincesId: '410000',
              citiesId: '410100',
              matterName: '名称1', // 事项名称
              matterSoucreName: '来源1', // 事项来源
              matterIcon: 'http://img.taopic.com/uploads/allimg/120727/201995-120HG1030762.jpg',
              workClassId: '', // 所属分类
              matterCreateTime: '',
              matterStatus: '0', // 事件状态
              requiredConditions: '条件1', // 办理条件
              materialRequested: '材料1', // 所需材料
              onlineManagement: '流程1', // 网上流程
              timeLimitExplanation: '说明1', // 限时说明
              chargingStandard: '标准1', // 收费标准
              managementBasis: '依据1', // 办理依据
              serviceObject: '个人', // 服务对象
              workPhone: '0371-12345678', // 工作电话
              complaintPhone: '0371-12345678', // 监督电话
              workMatterAddressesList: [
                {
                  areasId:"410502",
                  companyName:"324",
                  matterSoucreUrl:"234",
                  workAddress:"234",
                  workDate:"1324"
                },{
                  areasId:"410502",
                  companyName:"324",
                  matterSoucreUrl:"234",
                  workAddress:"234",
                  workDate:"1324"
                },{
                  areasId:"410502",
                  companyName:"324",
                  matterSoucreUrl:"234",
                  workAddress:"234",
                  workDate:"1324"
                }
              ]
            }, {
              id: '213123245',
              provincesId: '410000',
              citiesId: '411000',
              matterName: '名称2', // 事项名称
              matterSoucreName: '来源2', // 事项来源
              matterIcon: 'http://img.zcool.cn/community/01690955496f930000019ae92f3a4e.jpg@2o.jpg',
              workClassId: '', // 所属分类
              matterCreateTime: '',
              matterStatus: '1', // 事件状态
              requiredConditions: '条件2', // 办理条件
              materialRequested: '材料2', // 所需材料
              onlineManagement: '流程2', // 网上流程
              timeLimitExplanation: '说明2', // 限时说明
              chargingStandard: '标准2', // 收费标准
              managementBasis: '依据2', // 办理依据
              serviceObject: '公司', // 服务对象
              workPhone: '0371-12345678', // 工作电话
              complaintPhone: '0371-12345678', // 监督电话
              workMatterAddressesList: [
                {
                  areasId:"410502",
                  companyName:"324",
                  matterSoucreUrl:"234",
                  workAddress:"234",
                  workDate:"1324"
                },{
                  areasId:"410502",
                  companyName:"324",
                  matterSoucreUrl:"234",
                  workAddress:"234",
                  workDate:"1324"
                }
              ]
            }, {
              id: '213123232',
              provincesId: '410000',
              citiesId: '410500',
              matterName: '名称3', // 事项名称
              matterSoucreName: '来源3', // 事项来源
              matterIcon: 'http://img.zcool.cn/community/0142135541fe180000019ae9b8cf86.jpg@1280w_1l_2o_100sh.png',
              workClassId: '', // 所属分类
              matterCreateTime: '',
              matterStatus: '1', // 事件状态
              requiredConditions: '条件3', // 办理条件
              materialRequested: '材料3', // 所需材料
              onlineManagement: '流程3', // 网上流程
              timeLimitExplanation: '说明3', // 限时说明
              chargingStandard: '标准3', // 收费标准
              managementBasis: '依据3', // 办理依据
              serviceObject: '工作人员', // 服务对象
              workPhone: '0371-12345678', // 工作电话
              complaintPhone: '0371-12345678', // 监督电话
              workMatterAddressesList: [
                {
                  areasId:"410502",
                  companyName:"324",
                  matterSoucreUrl:"234",
                  workAddress:"234",
                  workDate:"1324"
                }
              ]
            }
          ],
          url: 'workMatter/dataGrid.do'
        },
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        workClassId: [],
        matterStatus: [
          {
            value: '0',
            label: '无效'
          },
          {
            value: '1',
            label: '有效'
          }
        ],
        previewData: {},
        // 区数据
        areasId: [],
        addrModal: false,
        previewModal: false,
        addEdit: true, //默认是新增
        derail_address_arr: [],
        addrDialog: {
          areasId: "",             
          workMatterId: "",//事项ID
          matterSoucreUrl: "",//事项链接
          derail_address_obj: [],//省市id数组
          workAddress: "",//详细地址
          address: {},//省市区+具体地址
          addressArr:[],//详细地址数组
          workDate: "",//工作时间                
          companyName: ""//窗口单位名称
        },
        chinaJson: {},
        derail_address_obj_s: [],
        derail_address_arr_ss: [],
        provinceCityData: [],
        provinceCity: [],
        formSearch: {
          matterName: '',
          workClassId: '',
          matterStatus: '',
          areaId: ''
        },
        formDialog: {
          id: '',
          provincesId: '',
          citiesId: '',
          matterName: '', // 事项名称
          matterSoucreName: '', // 事项来源
          matterIcon: '',
          workClassId: '', // 所属分类
          matterCreateTime: '',// 发布时间
          matterStatus: '1', // 事件状态
          requiredConditions: '', // 办理条件
          materialRequested: '', // 所需材料
          onlineManagement: '', // 网上流程
          timeLimitExplanation: '', // 限时说明
          chargingStandard: '', // 收费标准
          managementBasis: '', // 办理依据
          serviceObject: '', // 服务对象
          workPhone: '', // 工作电话
          workMatterAddressesList: [], // 编辑时至少有一个值
          complaintPhone: '' // 监督电话
        },
        // 提交的地址数据  这是一个复合数据
        columns: [
          {
            title: '编号',
            key: 'id',
            fixed: 'left',
            width: 180
          },
          {
            title: '事项名称',
            key: 'matterName',
            width: 180
          },
          {
            title: '服务对象',
            key: 'serviceObject',
            width: 200,
            ellipsis: true
          },
          {
            title: '事项来源',
            key: 'matterSoucreName',
            width: 220
          },
          {
            title: '事项图标',
            key: 'matterIcon',
            width: 180,
            render: function (create, params) {
              if (params.row.matterIcon === '' || params.row.matterIcon === 'null') {
                return create('span', '暂无图标')
              } else {
                return create('img', {
                  style: {
                    maxWidth: '100px',
                    margin: '10px'
                  },
                  attrs: {
                    src: params.row.matterIcon
                  }
                })
              }
            }
          },
          {
            title: '所属分类',
            key: 'workMatterClassName',
            width: 100
          },
          {
            title: '发布时间',
            key: 'matterCreateTime',
            width: 180
          },
          {
            title: '办理条件',
            key: 'requiredConditions',
            width: 500,
            ellipsis: true
          },
          {
            title: '所需材料',
            key: 'materialRequested',
            width: 350,
            ellipsis: true
          },
          {
            title: '网上流程',
            key: 'onlineManagement',
            width: 500,
            ellipsis: true
          },
          {
            title: '限时说明',
            key: 'timeLimitExplanation',
            width: 170
          },
          {
            title: '收费标准',
            key: 'chargingStandard',
            width: 150
          },
          {
            title: '办理依据',
            key: 'managementBasis',
            width: 150,
            ellipsis: true
          },
          {
            title: '工作电话',
            key: 'workPhone',
            width: 150
          },
          {
            title: '监督电话',
            key: 'complaintPhone',
            width: 150
          },
          {
            title: '事件状态',
            key: 'matterStatus',
            width: 150,
            render: function (create, params) {
              var map = {
                0: '无效',
                1: '有效'
              }
              return create('span', map[params.row.matterStatus])
            }
          },
          {
            title: '办事地址',
            key: 'workAddress',
            width: 150,
            render: (create, params) => {
              let vm = this
              return create('div', [
                (function (vm, create, params) {
                  return create('Button', {
                    props: { type: 'primary', size: 'small' },
                    on: {
                      click: function () {
                        console.log('显示地址数据')
                      }
                    }
                  }, '查看地址列表')
                })(vm, create, params)
              ])
            }
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
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: function () {
                      vm.workMatterPreview(params.row)
                    }
                  }
                }, '预览'),
                create('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: function () {
                      // vm.$store.commit('editRow', {
                      //   'vm': vm,
                      //   'data': params.row,
                      //   'initDialog': vm.initDialog(params.row)
                      // })
                      vm.editRow(params.row)
                    }
                  }
                }, vm.label.edit),
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
        rules: {
          matterName: [
            { required: true,message: '事件名称不能为空',trigger: 'change' },
            { required: true,message: '事件名称不能为空',trigger: 'blur' }
          ],
          workAddress: [
            { required: true,message: '详细地址不能为空',trigger: 'change' },
            { required: true,message: '详细地址不能为空',trigger: 'blur' }
          ],
          companyName: [
            { required: true,message: '窗口单位名称不能为空',trigger: 'change' },
            { required: true,message: '窗口单位名称不能为空',trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      upExeclSuccess (res) {
        if (res.code) {
          this.$Message.success('上传成功！')
        }
      },
      handleFormatError () {
        this.$Message.error('文件格式错误，请选择xlsx格式的文件')
      },
      addRow () {
        this.$store.commit('addRow', this)
      },
      // 编辑行
      editRow (data) {
        let vm = this
        let _data = vm.util.extend(data)
        vm.addrDialog.derail_address_obj = [data.provincesId, data.citiesId]
        for (let key in vm.formDialog) {
          if (key == 'workMatterAddressesList' && typeof _data[key] == 'string') {
            // 这里的值为什么时字符串类型
            vm.formDialog[key] = JSON.parse(_data[key])
          } else {
            vm.formDialog[key] = _data[key]
          }
        }
        vm.addrDialog.addressArr = vm.getAddressArr(vm.util.extend(vm.formDialog.workMatterAddressesList))
        vm.currDialog = 'edit'
        vm.dialogShow = true
      },
      resetDialogForm (name) {
        let vm = this
        vm.formDialog.id = ''
        vm.formDialog.provincesId = ''
        vm.formDialog.citiesId = ''
        vm.formDialog.matterIcon = ''
        vm.formDialog.matterStatus = '1'
        vm.formDialog.workMatterAddressesList = []
        vm.addrDialog.derail_address_obj = []
        vm.addrDialog.addressArr = []
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {
        let vm = this
        vm.$refs[name].validate(function (valid) {
          if (valid) {
            let ajaxData = {
              'workMatter': '',
              'workMatterAddressesList': ''
            }
            let workMatter = {}
            let workMatterAddressesList = []
            if (vm.currDialog === 'add') {
              for (let key in vm.formDialog) {
                if (key !='id') {
                  workMatter[key] = vm.formDialog[key]
                }
              }
              workMatterAddressesList = vm.util.extend(vm.formDialog.workMatterAddressesList)
            } else if (vm.currDialog === 'edit') {
              for (let key in vm.formDialog) {
                workMatter[key] = vm.formDialog[key]
              }
              // 编辑时提交的地址数据是地址列表中点过编辑按钮的数据，如果都没点过编辑，则提交第一个
              // 先提交所有的
              workMatterAddressesList = vm.util.extend(vm.formDialog.workMatterAddressesList)
            }
            ajaxData.workMatter = JSON.stringify(workMatter)
            ajaxData.workMatterAddressesList = JSON.stringify(workMatterAddressesList)
            console.log(ajaxData)
          }
        })
      },
      // 预览
      workMatterPreview (data) {
        let vm = this
        let _data = vm.util.extend(data)
        vm.previewData = _data
        vm.previewModal = true
      },
      // 重置预览内容
      resetPreview: function(){
        this.previewModal = false
        this.previewData = {}
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
      searchAddrChange (value) {
        this.formSearch.areaId = value[2]
      },
      addrChange (value) {
        var vm = this
        vm.formDialog.provincesId = value[0]
        vm.formDialog.citiesId = value[1]
      },
      handleSuccess (res) {
        if(res.state=="SUCCESS"){
          this.$Message.success("上传成功！");
          this.formDialog.matterIcon = res.url;
        }
      },
      handleImageFormatError () {
        this.$Message.error('文件格式错误，请选择jpg,jpeg或png格式的文件')
      },
      addAddrBtn () {
        var vm = this
        if (vm.addrDialog.derail_address_obj.length) {
          vm.areasId = vm.getArea(vm.addrDialog.derail_address_obj[1])
          vm.addrModal = true
        }else{
          vm.$Message.error("请先选择事项所属省市")
        }
      },
      getArea (cityId) {
        let vm = this
        let areaJson = vm.chinaJson[cityId]
        let areasId = []
        for (let key in areaJson) {
          areasId.push({
            'value': key,
            'label': areaJson[key]
          })
        }
        return areasId
      },
      // 重置添加地址弹出框
      resetAddr (name) {
        var vm = this
        vm.addrDialog.areasId = ''
        vm.$refs[name].resetFields()
        vm.areasId = []
        vm.addEdit = true
        vm.addrModal = false
      },
      // 确定添加、编辑地址
      beSure (name) {
        var vm = this;     
        vm.$refs[name].validate(function (valid) {  
            if(vm.addrDialog.areasId){
              if(vm.currDialog=="edit"){
                  vm.addAddrAjax()
              }
              vm.formDialog.workMatterAddressesList.push({
                  areasId: vm.addrDialog.areasId,
                  workAddress: vm.addrDialog.workAddress,
                  workDate: vm.addrDialog.workDate,
                  companyName: vm.addrDialog.companyName,
                  matterSoucreUrl: vm.addrDialog.matterSoucreUrl
              })
              vm.addrDialog.addressArr = vm.getAddressArr(vm.util.extend(vm.formDialog.workMatterAddressesList))
              vm.resetAddr(name)
            }else{
              vm.$Message.error("请选择区");
            }
        })
      },
      addAddrAjax () {
        console.log('编辑时点击新增地址，确定时发送请求')
      },
      // 获取详细地址数据
      getAddressArr (addressArr) {
        let arr = []
        if (addressArr.length) {
          for(var i=0;i<addressArr.length;i++){
            arr.push(addressArr[i].workAddress)
          }
        }
        return arr
      },
      // 编辑地址
      editAddrBtn (index) {
        let vm = this
        vm.addEdit = false
        vm.areasId = vm.getArea(vm.addrDialog.derail_address_obj[1])
        console.log(vm.areasId)
        let data = vm.util.extend(vm.formDialog.workMatterAddressesList[index])
        setTimeout(() => {
          for (let key in data) {
            vm.addrDialog[key] = data[key]
          }
          console.log(vm.addrDialog.areasId)
        }, 0);
        
        vm.addrModal = true
      },
      // 删除地址
      delAddr (index) {
        console.log(index)
        let vm = this
        vm.$Modal.confirm({
          title: '确定',
          content: '确定删除这条数据？',
          onOk: function () {
            if (vm.currDialog == 'add') {
              vm.addrDialog.addressArr.splice(index,1)
              vm.formDialog.workMatterAddressesList.splice(index,1)
            } else if (vm.currDialog == 'edit') {
              // 发送删除请求
            }
          }
        })
      },
      // 查看地址列表
      seeAddress () {},
      // 当前页或每页个数发生改变
      changePager (data) {
        this.util.changePager(this, data)
      },
      paging () {
        this.util.paging(this)
      },
      initData () {
        let vm = this
        // 初始化所属分类
        // vm.$http.post('workClass/dataGrid.do', {}).then(res => {
        //   let workClassId = []
        //   res.data.forEach(item => {
        //     workClassId.push({
        //       'value': item.id,
        //       'label': item.className
        //     })
        //   })
        //   vm.workClassId = workClassId
        // })
        // 初始化省市区
        if (!sessionStorage.chinaJson) {
          vm.util.initChinaDataAndJson()
        }
        let chinaJson = vm.util.extend(JSON.parse(sessionStorage.chinaJson))
        let chinaData = vm.util.extend(JSON.parse(sessionStorage.chinaData))
        let _chinaData = []
        chinaData.forEach(item => {
          let childArr = []
          item.children.forEach(child => {
            childArr.push({
              'value': child.value,
              'label': child.label
            })
          })
          _chinaData.push({
            'value': item.value,
            'label': item.label,
            'children': childArr
          })
        })
        vm.derail_address_arr_ss = chinaData
        vm.derail_address_arr = vm.util.extend(_chinaData)
        vm.chinaJson = chinaJson
      }
    },
    // 计算属性
    computed: {
      label () {
        return this.$store.state.label
      }
    },
    watch: {},
    created () {
      let vm = this
      // 初始化其他数据
      vm.initData()
      // 页面加载时初始化table数据
      vm.$store.commit('initPager', vm)
      vm.paging(vm)
      // 页面加载时初始化table数据  end
    },
    mounted () {
      
    }
  }
</script>

<style scoped>
#preview-modal .ivu-col{
  font-size: 14px;
  word-wrap:break-word;
}
#preview-modal .title{
  font-size: 15px;
  font-weight: 700;
}
.preview-txt{
  max-height: 165px;
  overflow-y: auto;    
  text-indent: 28px;
}
</style>
