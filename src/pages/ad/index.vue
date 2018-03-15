<template>
  <div class="ad">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="关键字" prop="title">
        <Input v-model="formSearch.title" placeholder="标题" size="small"></Input>
      </FormItem>
      <FormItem label="广告位置" prop="postion">
        <Select v-model="formSearch.postion" placeholder="请选择" size="small" clearable style="width:150px;">
          <Option v-for="item in postion" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="广告状态" prop="lockStatus">
        <Select v-model="formSearch.lockStatus" placeholder="请选择" size="small" clearable style="width: 80px;">
          <Option v-for="item in lockStatus" :key="item.value" :value="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="投放级别" prop="areaType">
        <Select v-model="formSearch.areaType" placeholder="请选择" size="small" clearable style="width: 80px;">
          <Option v-for="item in areaType" :key="item.value" :value="item.value">{{item.label}}</Option>
        </Select>
      </FormItem>
      <FormItem label="关联地区">
        <Cascader :data="derail_address_arr_s" v-model="derail_address_obj_s" :filterable="true" size="small" style="margin-top: 5px"></Cascader>
      </FormItem>
      <FormItem label="展示时间">
        <FormItem prop="startTime">
          <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.startTime" size="small" :clearable="false"></DatePicker>
        </FormItem>
        <FormItem>至</FormItem>
        <FormItem prop="endTime">
          <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.endTime" size="small" :clearable="false"></DatePicker>
        </FormItem>
      </FormItem>
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="900" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="24">
            <FormItem label="标题" prop="title">
              <Input v-model="formDialog.title" placeholder="请输入标题"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="广告内容" prop="context">
              <Input v-model="formDialog.context" placeholder="请输入广告内容"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="主图" prop="imagePath">
              <Row>
                <Col span="16">
                  <div class="image-box">
                    <img v-if="formDialog.imagePath" :src="formDialog.imagePath" class="ad-img"/>
                    <img v-else src="static/images/img-upload-default.png" class="ad-img"/>
                  </div>
                </Col>
                <Col span="8">
                  <Upload name="upfile"
                          action="ueditor/upload.do"
                          :show-upload-list="false"
                          :on-success="handleSuccess">
                    <Button type="ghost" icon="ios-cloud-upload-outline">上传主图</Button>
                  </Upload>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12" v-show="hasExtraImg">
            <FormItem label="次级图片" prop="imageArr">
              <Row>
                <Col span="16">
                  <Row v-show="imageArr.length">
                    <Col span="12" v-for="item in imageArr" :key="item">
                      <div class="image-box">
                        <img v-show="item" :src="item" class="ad-img">
                      </div>
                    </Col>
                  </Row>
                  <div v-show="!imageArr.length" class="image-box">
                    <img src="static/images/img-upload-default.png" class="ad-img">
                  </div>
                </Col>
                <Col span="8">
                  <Upload name="upfile"
                          action="ueditor/upload.do"
                          :show-upload-list="false"
                          :before-upload="beforeUpload"
                          :on-success="extraImgHandleSuccess">
                    <Button type="ghost" icon="ios-cloud-upload-outline">次级图片</Button>
                  </Upload>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="链接地址" prop="href">
              <Input type="url" v-model="formDialog.href" placeholder="请输入链接地址">
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="广告位置" prop="postion">
              <Select v-model="formDialog.postion" placeholder="请选择"  clearable>
                <Option v-for="item in postion" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="排序" prop="sort" inline>
              <InputNumber :max="10" :min="1" v-model="formDialog.sort" :disabled="formDialog.sort==1&&formDialog.isUp==2"></InputNumber>
              <Button type="default" v-if="formDialog.sort==1" @click="formDialog.isUp = formDialog.isUp==1 ?2:1">{{formDialog.isUp==1 ? '置顶' : '取消置顶'}}</Button>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem>
              <span v-if="true" style="font-size: 80%;color: #ff4d44;padding-left: 3px">数值越小优先级越高</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开始时间" prop="startTime">
              <DatePicker type="date" placeholder="点击选择时间" v-model="formDialog.startTime" :clearable="false"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="结束时间" prop="endTime">
              <DatePicker type="date" placeholder="点击选择时间" v-model="formDialog.endTime" :clearable="false"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="投放级别" prop="areaType">
              <Select v-model="formDialog.areaType" placeholder="请选择">
                <Option v-for="item in areaType" :key="item.value" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="关联地区">
              <Cascader :data="derail_address_arr" v-model="derail_address_obj" placeholder="选择关联地区" :clearabled="false"></Cascader>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  export default {
    name: 'ad_index',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        url: {
          add: 'ad/add.do',
          edit: 'ad/edit.do',
          delete: 'ad/delete.do'
        },
        pager: {
          data: [
            {
              id: '380700856033280',
              userId: '',
              title: '大溪谷',
              imagePath: 'http://iguangming.sznews.com/images/attachement/png/site640/20171220/IMG889ffafebae246370159022.PNG',
              imageArr: ['http://ilonghua.sznews.com/images/attachement/jpg/site1011/20171219/IMG74e543574fc54636456847.jpg', 'http://iguangming.sznews.com/images/attachement/jpg/site640/20171220/IMGb083feb941e04637355087.jpg', 'http://iguangming.sznews.com/images/attachement/png/site640/20171220/IMG889ffafebae246370159022.PNG'],
              lockStatus: '1',
              postion: '3',
              href: 'http://www.baidu.com',
              sort: 1,
              clickNum: '123',
              detailAddress: '湖北省襄阳市樊城区',
              startTime: '2017-12-11 17:55:19',
              endTime: '2017-12-28 17:55:19',
              isUp: '1',
              areaType: '1',
              context: '按时气味儿13'
            }, {
              id: '380700582551552',
              userId: '',
              title: '特色牛肉面',
              imagePath: 'http://iguangming.sznews.com/images/attachement/jpg/site640/20171220/IMGb083feb941e04637355087.jpg',
              imageArr: ['http://iguangming.sznews.com/images/attachement/png/site640/20171220/IMG889ffafebae246370159022.PNG', 'http://iguangming.sznews.com/images/attachement/jpg/site640/20171220/IMGb083feb941e04637355087.jpg'],
              lockStatus: '1',
              postion: '4',
              href: 'http://www.baidu.com',
              sort: 1,
              clickNum: '345',
              detailAddress: '湖北省襄阳市樊城区',
              startTime: '2017-12-11 00:00:00',
              endTime: '2017-12-28 00:00:00',
              isUp: '1',
              areaType: '2',
              context: '按时规范化'
            }, {
              id: '380699319488512',
              userId: '',
              title: '古城市新襄阳',
              imagePath: 'http://ilonghua.sznews.com/images/attachement/jpg/site1011/20171219/IMG74e543574fc54636456847.jpg',
              imageArr: ['http://ilonghua.sznews.com/images/attachement/jpg/site1011/20171219/IMG74e543574fc54636456847.jpg'],
              lockStatus: '1',
              postion: '1',
              href: 'http://www.baidu.com',
              sort: 1,
              clickNum: '76',
              detailAddress: '湖北省襄阳市樊城区',
              startTime: '2017-12-11 00:00:00',
              endTime: '2017-12-22 00:00:00',
              isUp: '1',
              areaType: '3',
              context: '登革热提前'
            }, {
              id: '380699319488545',
              userId: '',
              title: '发的两个',
              imagePath: 'http://ilonghua.sznews.com/images/attachement/jpg/site1011/20171219/IMG74e543574fc54636456847.jpg',
              imageArr: ['http://ilonghua.sznews.com/images/attachement/jpg/site1011/20171219/IMG74e543574fc54636456847.jpg'],
              lockStatus: '1',
              postion: '2',
              href: 'http://www.baidu.com',
              sort: 1,
              clickNum: '76',
              detailAddress: '湖北省襄阳市樊城区',
              startTime: '2017-12-11 00:00:00',
              endTime: '2017-12-22 00:00:00',
              isUp: '1',
              areaType: '3',
              context: '登革热提前'
            }
          ],
          url: 'ad/dataGrid.do',
          tSort: 'createTime',
          order: 'desc'
        },
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        uploadImgMax: 1,
        derail_address_arr: [],
        derail_address_arr_s: [],
        derail_address_obj: [],
        derail_address_obj_s: [],
        lockStatus: [
          {
            value: '1',
            label: '正常'
          }, {
            value: '2',
            label: '禁用'
          }, {
            value: '3',
            label: '过时'
          }
        ],
        areaType: [
          {
            value: '1',
            label: '全国'
          }, {
            value: '2',
            label: '省级'
          }, {
            value: '3',
            label: '市级'
          }, {
            value: '4',
            label: '区级'
          }
        ],
        postion: [
          {
            value: '1',
            label: '首页banner'
          }, {
            value: '2',
            label: '首页新闻列表'
          }, {
            value: '3',
            label: '首页新闻详情'
          }, {
            value: '4',
            label: '政务banner'
          }, {
            value: '5',
            label: '招商banner'
          }, {
            value: '6',
            label: '办事指南详情'
          }, {
            value: '7',
            label: '便民工具'
          }, {
            value: '8',
            label: '广场帖子列表'
          }, {
            value: '9',
            label: '帖子详情'
          }
        ],
        provinceData: [],
        cityData: [],
        areaData: [],
        countryData: [{label: "中国", value: "000000", children: []}],
        formSearch: {
          startTime: '',
          endTime: '',
          // province: 0,
          // city: 0,
          type: '',
          lockStatus: '',
          title: '',
          areaType: '4',
          areaId: ''
        },
        hasExtraImg: false,
        formDialog: {
          id: '',
          userId: '',
          title: '',
          imagePath: '',
          imageArr: [],
          lockStatus: '1',
          postion: '1',
          href: '',
          sort: 1,
          // clickNum: '',
          detailAddress: '',
          startTime: '',
          endTime: '',
          isUp: '1',
          areaType: '1',
          areaId: '',
          context: ''
        },
        columns: [
          {
            'title': 'ID',
            'key': 'id',
            'width': 180,
            'fixed': 'left',
            'sortable': true
          },
          {
            'title': '标题',
            'key': 'title',
            'width': 150,
            'sortable': true
          },
          {
            'title': '主图',
            'key': 'imagePath',
            'width': 120,
            'sortable': true,
            render: function (create, params) {
              return create('img', {
                attrs: {
                  src: params.row.imagePath,
                  width: 80,
                  height: 80
                },
                style: {
                  'border': '1px solid transparent',
                  'border-radius': '4px',
                  'margin': '10px 0'
                }
              })
            }
          },
          {
            'title': '链接地址',
            'key': 'href',
            'width': 250,
            'sortable': true
          },
          {
            'title': '点击次数',
            'key': 'clickNum',
            'width': 120,
            'sortable': true
          },
          {
            'title': '广告位置',
            'key': 'postion',
            'width': 120,
            'sortable': true,
            render: (create, params) => {
              var map = {
                '1': '首页banner',
                '2': '首页新闻列表',
                '3': '首页新闻详情',
                '4': '政务banner',
                '5': '招商banner',
                '6': '办事指南详情',
                '7': '便民工具',
                '8': '广场帖子列表',
                '9': '帖子详情'
              }
              return create('span', map[params.row.postion])
            }
          },
          {
            'title': '关联地区',
            'key': 'detailAddress',
            'width': 170,
            'sortable': true,
            render: function (create, params) {
              var map = {
                1: '', 2: ' (省)', 3: ' (市)', 4: ' (区)'
              }
              return create('span', params.row.detailAddress + map[params.row.areaType])
            }

          },
          {
            'title': '排序',
            'key': 'sort',
            'width': 100,
            'sortable': true
          },
          {
            'title': '状态',
            'key': 'lockStatus',
            'width': 100,
            'sortable': true,
            render: function (create, params) {
              var map = {
                1: '正常', 2: '禁用', 3: '过时'
              }
              if (params.row.isUp == 2) {
                return create('span', map[params.row.lockStatus] + '(置顶)')
              } else {
                return create('span', map[params.row.lockStatus])
              }
            }
          },
          {
            'title': '创建人',
            'key': 'createBy',
            'width': 120,
            'sortable': true
          },

          {
            'title': '开始时间',
            'key': 'startTime',
            'width': 160,
            'sortable': true
          },

          {
            'title': '结束时间',
            'key': 'endTime',
            'width': 160,
            'sortable': true
          },
          {
            'title': '创建时间',
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
                vm.util.createEditBtn(create, params.row, vm),
                create('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      console.log('禁用')
                    }
                  }
                }, '禁用'),
                vm.util.createDelBtn(create, params.row.id, vm)
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
      },
      imageArr () {
        return this.formDialog.imageArr.slice(1)
      }
    },
    methods: {
      addRow () {
        this.util.addRow(this)
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
      resetDialogForm (name) {
        let vm = this
        vm.formDialog.imageArr = []
        vm.derail_address_arr = vm.countryData
        vm.derail_address_obj = []
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {
        this.util.submitDialogForm(this, name)
      },
      handleSuccess (res) {
        this.formDialog.imagePath = res.url;
      },
      beforeUpload () {
        let vm = this
        let len = vm.formDialog.imageArr.length
        if (len == vm.uploadImgMax || len > vm.uploadImgMax) {
          vm.$Message.error("上传图片数量已达上限！")
          return false
        }
      },
      extraImgHandleSuccess (res) {
        // 次级图片上传成功成功，将返回的url push进 formDialog.imageArr
        this.formDialog.imageArr.push(res.url)
      },
      initDialog () {

      },
      changePager (data) {
        this.util.changePager(this, data)
      },
      paging () {
        this.util.paging(this)
      },
      initData () {
        let vm = this
        vm.areaData = JSON.parse(sessionStorage.chinaData)
        vm.cityData = vm.util.getCityDataByData(JSON.parse(sessionStorage.chinaData))
        vm.provinceData = vm.util.getProvinceDataByData(JSON.parse(sessionStorage.chinaData))
        vm.derail_address_arr_s = JSON.parse(sessionStorage.chinaData)
        vm.derail_address_arr = vm.countryData
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
      derail_address_obj_s (val) {
        if (val.length) {
          this.formSearch.areaId = val[2]
        } else {
          this.formSearch.areaId = ''
        }
      },
      derail_address_obj (val) {
        if (val.length) {
          this.formDialog.areaId = val[2]
        } else {
          this.formDialog.areaId = ''
        }
      },
      'formSearch.areaType': function(val) {
        let vm = this
        if (val=='1') {
          vm.derail_address_arr_s = vm.countryData
        } else if (val=='2') {
          vm.derail_address_arr_s = vm.provinceData
        } else if (val=='3') {
          vm.derail_address_arr_s = vm.cityData
        } else if (val=='4') {
          vm.derail_address_arr_s = vm.areaData
        }
        vm.derail_address_obj_s = []
      },
      'formDialog.areaType': function(val) {
        let vm = this
        if (val=='1') {
          vm.derail_address_arr = vm.countryData
        } else if (val=='2') {
          vm.derail_address_arr = vm.provinceData
        } else if (val=='3') {
          vm.derail_address_arr = vm.cityData
        } else if (val=='4') {
          vm.derail_address_arr = vm.areaData
        }
        vm.derail_address_obj = []
      },
      ['formDialog.postion'](val){
        // 广告位置是 首页banner和首页新闻列表时投放级别为全国formDialog.areaType==1
        if(val==1 || val==2){
          this.formDialog.areaType = '1'
        }else{
          this.formDialog.areaType = '4'
        }
        // 指定的几个广告位置可以上传3张图片  现在默认3和4
        if (val==3 || val==4){
          this.uploadImgMax = 3
          this.hasExtraImg = true
        } else {
          this.uploadImgMax = 1
          this.hasExtraImg = false
        }
      },
      ['formDialog.imageArr'](val){
        if (val.length>1) {
          this.hasExtraImg = true
        } else {
          this.hasExtraImg = false
        }
      }
    }
  }
</script>

<style scoped>
.image-box{
  width:100px;
  height:100px;
  border:1px solid #eee;
}
.ad-img{
  max-width: 100px;
  max-height: 100px;
}
</style>
