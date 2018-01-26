<template>
  <div class="work-matter">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="80">
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
          <Button type="primary" size="small" style="margin-top:5px;">导入事项Excel</Button>
        </Upload>
    </Form>
    <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable>
    <paging></paging>
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
            <FormItem label="事项图标" prop="matterIcon">
              <Upload name="upfile"
                      action="ueditor/upload.do"
                      :on-success="handleSuccess"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png']"
                      :on-format-error="handleImageFormatError"
                      :max-size="2048">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="所属分类" prop="workClassId">
              <Input v-model="formDialog.workClassId" placeholder="请输入事项来源"></Input>
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
            <FormItem label="办理条件" prop="requiredConditions">
              <Row>
                <Col span="18">
                  <Input v-model="formDialog.requiredConditions" disabled placeholder="请添加办理条件"></Input>
                </Col>
                <Col span="6" style="text-align: right;">
                  <i-button size="small" type="primary" @click="showHandleDialog('handleModal','requiredConditions')">{{label[currDialog]}}</i-button>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="所需材料" prop="materialRequested">
              <Row>
                <Col span="18">
                  <Input v-model="formDialog.materialRequested" disabled placeholder="请添加所需材料"></Input>
                </Col>
                <Col span="6" style="text-align: right;">
                  <i-button size="small" type="primary" @click="showHandleDialog('handleModal','materialRequested')">{{label[currDialog]}}</i-button>
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
          <Col span="12">
            <FormItem label="网上流程" prop="onlineManagement">
              <Row>
                <Col span="18">
                  <Input v-model="formDialog.onlineManagement" disabled placeholder="请添加网上流程"></Input>
                </Col>
                <Col span="6" style="text-align: right;">
                  <i-button size="small" type="primary" @click="showHandleDialog('handleModal','onlineManagement')">{{label[currDialog]}}</i-button>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="事件状态">
              <Select v-model="formDialog.matterStatus" placeholder="请选择事件状态">
                <Option v-for="item in matterStatus" :value="item.value" :key="item">{{ item.label }}</Option>
              </Select>
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
            <FormItem label="省市" prop="derail_address_obj">
              <Cascader :data="derail_address_arr" @on-change="addrChange" v-model="addrDialog.derail_address_obj" placeholder="请选择地址" clearabled="false"></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="办事地址">
              <i-button @click="addAddrBtn">添加地址</i-button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialog">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  // import util from '@/libs/util'
  export default {
    name: 'workMatter',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        data: [
          {
            'id': '931451971265015808',
            'matterName': '广东省计划生育服务证',
            'serviceObject': '具备《广东省计划生育服务证》核发申请条件的个人',
            'matterSoucreName': '深圳市卫生和计划生育局',
            'matterIcon': '',
            'workMatterClassName': '生育收养',
            'matterCreateTime': '2017-11-17 00:00:00',
            'requiredConditions': '户籍地在广东省内的育龄妇女（含未婚收养、未婚已生育、离婚及丧偶者）男方户籍地在广东省内，女方非广东省户籍但随夫居住在广东省内的育龄妇女',
            'materialRequested': '1:办理《广东省计划生育服务证》申请表。2:身份证 3:户口本 4:结婚证 5:离婚证、离婚协议或人民法院生效的判决书、 调解书 6:女方免冠小一寸彩照',
            'onlineManagement': '1.申请。 申请人登录广东省网上办事大厅居民生育服务专窗网页（网址：http://syfw.gdwst.gov.cn），点击“马上登录”注册账号并登录系统；选择要办理的事项并点击“网上申办”填写申请表单，拍摄并上传办事材料照片，确认信息无误后提交申请。 2.受理 受理机构负责核验办事人的申请信息和电子证明材料，核验完成后，提交给男女双方户籍地核实。申请人符合申请资格，并材料齐全、格式规范、符合法定形式的，予以受理；申请人不符合申请资格或材料不齐全、不符合法定形式的，受理人员不予受理。申请人材料不符合要求但可以更正的，退回更正后予以受理。 3.审查。受理后，审查人员对材料进行审查，在7个工作日内作出审查决定。符合办理条件的，出具《广东省计划生育服务证》。 4. 领取结果。申请人可以通过邮寄（邮寄费用自付）、自行领取、委托他人领取等方式领取结果。',
            'timeLimitExplanation': '承诺期限（7）工作日',
            'chargingStandard': '不收费',
            'managementBasis': '无',
            'workPhone': '0755-82918362',
            'complaintPhone': '0755-82918437',
            'matterStatus': '1',
            'workAddress': '事项地址'
          }
        ],
        matterStatus: [],
        derail_address_arr: [],
        addrDialog: {},
        derail_address_obj_s: [],
        derail_address_arr_ss: [],
        provinceCityData: [],
        provinceCity: [],
        formSearch: {
          matterName: '',
          workClassId: '',
          matterStatus: '',
          cityCode: ''
        },
        formDialog: {
          id: '',
          matterName: '', // 事项名称
          matterSoucreName: '', // 事项来源
          matterIcon: '',
          workClassId: '', // 所属分类
          matterCreateTime: '',
          matterStatus: '1', // 事件状态
          requiredConditions: '', // 办理条件
          materialRequested: '', // 所需材料
          onlineManagement: '', // 网上流程
          timeLimitExplanation: '', // 限时说明
          chargingStandard: '', // 收费标准
          managementBasis: '', // 办理依据
          serviceObject: '', // 服务对象
          workPhone: '', // 工作电话
          complaintPhone: '', // 监督电话
          workMatterAddressesList: []
        },
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
                      console.log('预览')
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
                        'data': params.row
                      })
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
        rules: {}
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
      initDialog (data) {
        console.log(data)
      },
      resetDialogForm (name) {
        let vm = this
        vm.$refs[name].resetFields()
      },
      resetSearch (name) {
        var vm = this
        vm.$refs[name].resetFields()
      },
      submitSearch (name) {
        console.log('搜索')
      },
      searchAddrChange () {},
      addrChange () {},
      handleSuccess () {},
      handleImageFormatError () {},
      getAddrByCityId (cityId) {
        return '数据成功'
      },
      addAddrBtn () {},
      initData () {}
    },
    // 计算属性
    computed: {
      label () {
        return this.$store.state.label
      },
      pager () {
        return this.$store.state.pager
      }
    },
    watch: {},
    // 生命周期钩子函数VNode替换原始dom时触发，不是对象，切记
    mounted () {
      this.initData()
      this.$store.state.pager.data = this.data
    }
  }
</script>

<style scoped>

</style>
