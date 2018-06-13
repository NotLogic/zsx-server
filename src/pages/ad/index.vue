<template>
  <div class="ad">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="标题" prop="title">
        <Input v-model="formSearch.title" placeholder="标题" size="small"></Input>
      </FormItem>
      <!-- <FormItem label="广告位置" prop="postion">
        <Select v-model="formSearch.postion" placeholder="请选择" size="small" clearable style="width:150px;">
          <Option v-for="item in postion" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="广告状态" prop="lockStatus">
        <Select v-model="formSearch.ls" placeholder="请选择" size="small" clearable style="width: 80px;">
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
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="点击选择时间" @on-change="searchStartTimeChange" size="small" :clearable="false"></DatePicker>
        </FormItem>
        <FormItem>至</FormItem>
        <FormItem prop="endTime">
          <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="点击选择时间" @on-change="searchEndTimeChange" size="small" :clearable="false"></DatePicker>
        </FormItem>
      </FormItem> -->
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
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
          <Col span="24">
            <FormItem label="广告图片" prop="imagePath">
              <Col span="18">
                <Row>
                  <Col span="6">
                    <Upload name="file"
                        :action="url.upload"
                        :multiple="uploadImgMax==1 ? false : true"
                        :before-upload="myBeforeUpload"
                        :format="['jpg','jpeg','png','gif']"
                        :on-format-error="handleFormatError"
                        :on-success="myHandleSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Upload>
                    <Button type="primary" @click="myUpload" :loading="uploadLoading">上传图片</Button>
                  </Col>
                  <Col span="18">
                    <Row v-if="fileUrl.length">
                      <Col span="8" v-for="(item, index) in fileUrl" :key="item">
                        <div class="image-box">
                          <img :src="item" class="ad-img">
                          <div class="demo-upload-list-cover">
                            <!-- <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon> -->
                            <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div v-show="!fileUrl.length" class="image-box">
                      <img src="static/images/img-upload-default.png" class="ad-img">
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span="6">
                <span>只能上传</span>
                <strong style="color:red;font-size:20px;">{{uploadImgMax}}</strong>
                <span>张图片</span>
              </Col>
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
              <DatePicker format="yyyy-MM-dd" type="date" placeholder="点击选择时间" @on-change="startTimeChange" v-model="startTime" :clearable="false"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="结束时间" prop="endTime">
              <DatePicker format="yyyy-MM-dd" :start-date="new Date()" type="date" placeholder="点击选择时间" @on-change="endTimeChange" v-model="endTime" :clearable="false"></DatePicker>
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
  import page from '@/mixins/page'
  export default {
    name: 'ad_index',
    components: {
      mainTable,
      paging
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'advert/add',
          edit: 'advert/update',
          delete: 'advert/delete',
          search: 'advert/dataSearch',
          disableAd: 'advert/forbidden',
          upload: 'file/440859402723328',
          sId: 'id/id',
        },
        uploadLoading: false,
        needId: true,
        pager: {
          url: 'advert/dataGrid',
          size: 20,
          data: [], // 声明vue时必须存在，因为vue无法观测动态新增的属性
        },
        getFtpHostTimes: 0,
        ftpHost: '',
        uploadImgMax: 1,
        uploadImgArr: [],
        fileUrl: [],
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
        postionMap: {
          '1': '首页banner',
          '2': '首页新闻列表',
          '3': '首页新闻详情',
          '4': '政务banner',
          '5': '招商banner',
          '6': '办事指南详情',
          '7': '便民工具',
          '8': '广场帖子列表',
          '9': '帖子详情'
        },
        provinceData: [],
        cityData: [],
        areaData: [],
        countryData: [{label: "中国", value: "1", children: []}],
        formSearch: {
          // startTime: '',
          // endTime: '',
          // province: 0,
          // city: 0,
          // type: '',
          // ls: '',
          title: '',
          // areaType: '4',
          // areaId: ''
        },
        hasExtraImg: false,
        startTime: '',
        endTime: '',
        formDialog: {
          id: '',
          // userId: '',  // 2018.05.29 无此字段
          title: '',
          imagePath: '',
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
          countryId: '',
          provincesId: '',
          cityId: '',
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
            'width': 250,
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
                  src: params.row.imagePath
                },
                style: {
                  'border': '1px solid transparent',
                  'border-radius': '4px',
                  'margin': '10px 0',
                  'max-width': '100px',
                  'max-height': '100px'
                }
              })
            }
          },
          {
            'title': '链接地址',
            'key': 'href',
            'width': 250,
            'sortable': true,
            render: function (create, params) {
              return create('a', {
                attrs: {
                  'href': params.row.href,
                  'target': '_blank'
                },
              },params.row.href)
            }
          },
          {
            'title': '广告位置',
            'key': 'postion',
            'width': 150,
            'sortable': true,
            render: (create, params) => {
              var txt = this.postionMap[params.row.postion] + ' （' + params.row.postion + '）'
              return create('span', txt)
            }
          },
          {
            'title': '点击次数',
            'key': 'clickNum',
            'width': 120,
            'sortable': true
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
              var status = params.row.lockStatus
              var arr = []
              if(status==3){
                arr = [
                  vm.createEditBtn(create, params.row),
                  vm.createDelBtn(create, params.row.id)
                ]
              }else{
                var txt = status == 1 ? '禁用' : '启用'
                var txt2 = status != 1 ? '禁用' : '启用'
                arr = [
                  vm.createEditBtn(create, params.row),
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
                        // 禁用后台报错
                        vm.$Message.info(vm.label.wait)
                        return
                        vm.$Modal.confirm({
                          title: '确认',
                          content: "确认" + txt2 +"这条数据吗？",
                          onOk: function () {
                            vm.disableRow({id: params.row.id})
                          }
                        })
                      }
                    }
                  }, txt),
                  vm.createDelBtn(create, params.row.id)
                ]
              }
              return create('div', arr)
            }
          }
        ],
        rules: {}
      }
    },
    methods: {
      searchStartTimeChange(date){
        this.formSearch.startTime = date + ' 00:00:00'
      },
      searchEndTimeChange(date){
        this.formSearch.endTime = date + ' 00:00:00'
      },
      startTimeChange(date){
        this.formDialog.startTime = date + ' 00:00:00'
      },
      endTimeChange(date){
        this.formDialog.endTime = date + ' 00:00:00'
      },
      resetSearch (name) {
        var vm = this
        vm.derail_address_obj_s = []
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
      },
      resetDialogForm (name) {
        name = name || 'formDialog'
        let vm = this
        vm.endTime = ''
        vm.startTime = ''
        vm.derail_address_arr = vm.countryData
        vm.derail_address_obj = []
        vm.fileUrl = []
        vm.$refs[name].resetFields()
      },
      disableRow(data){
        var vm = this
        vm.$http2({
          url: vm.url.disableAd,
          method: vm.pager.method,
          data: data
        }).then(res => {
          console.log('res: ',res)
          var resData = res.data
          if(resData.code==1){
            vm.$Message.success('操作成功！')
            vm.paging()
          }else{
            vm.$Message.error(resData.message)
          }
        }).catch(err=>{

        })
      },
      // 手动上传
      myBeforeUpload(file){
        var vm = this;
        let reader = new FileReader()
        // readAsDataURL 方法用于读取指定 Blob 或 File 的内容
        // 当读操作完成，readyState 变为 DONE，loadend 被触发，此时 result 属性包含数据：URL（以 base64 编码的字符串表示文件的数据）
        // 读取文件作为 URL 可访问地址
        reader.readAsDataURL(file)
        reader.onloadend = function (e) {
          if(vm.uploadImgMax==1){
            vm.fileUrl = [reader.result]
            vm.uploadImgArr = [file]
          }else{
            vm.fileUrl.push(reader.result) // 这一行将图片转为base64存储到file对象里边
            vm.uploadImgArr.push(file)
          }
        }
        return false
      },
      myHandleSuccess(){

      },
      myUpload(){
        // 确认上传
        var vm = this
        if(!vm.uploadImgArr.length){
          vm.$Message.error('请先选择上传的图片')
          return
        }
        if(vm.currDialog=='add'){
          vm.$http.post(vm.url.sId).then(res=>{
            var resData = res.data
            if(resData.code==1){
              var sId = resData.data;
              vm.formDialog.id = sId;
              vm.uploadFile(sId)
            }
          }).catch(err=>{})
        }else{
          var sId = vm.formDialog.id
          vm.uploadFile(sId)
        }
      },
      uploadFile(sId){
        var vm = this;
        let params = new FormData();
        vm.uploadImgArr.forEach(file =>{
          params.append('file', file)
        });
        params.append('sId',sId)
        // s   1  用户  2  帖子  3  广告
        params.append('s',3)
        // 使用位置 1：用户头像 2：帖子列表 3：帖子回复 4:创建群头像 5:编辑群头像 
        params.append('p',vm.formDialog.postion)
        var config =  {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        };
        vm.$http.post(vm.url.upload, params, config).then(res=>{
          let rd = res.data;
          if(rd.code==1){
            // 清空已上传数组
            vm.uploadImgArr = [];
            vm.$Message.success('上传图片成功！');
            var arr = []
            for(let key in rd.data){
              arr.push(rd.data[key]);
            }
            vm.formDialog.imagePath = arr[0] || '';
            vm.uploadLoading = false
          }else{
            vm.$Message.error(rd.message)
          }
        }).catch(err=>{})
      },
      handleFormatError(){
        this.$Message.error('文件格式错误，请选择jpg、jpeg、png或gif格式的文件！')
      },
      // 预览
      handleView(index){
        console.log('预览index: ',index)
      },
      // 删除
      handleRemove(index){
        var vm = this
        vm.fileUrl.splice(index,1)
        vm.uploadImgArr.splice(index,1)
      },
      // 编辑行时回显的额外操作  
      initDialog (data) {
        var vm = this,arr=[],areaId,cityId,provincesId
        if(data.areaId){
          areaId = data.areaId
          cityId = parseInt(parseInt(areaId/100) + '00')
          provincesId = parseInt(parseInt(areaId/10000) + '0000')
          arr = [provincesId, cityId, areaId]
        }else if(data.cityId){
          cityId = data.cityId
          provincesId = parseInt(areaId/10000) + '0000'
          arr = [provinceId, cityId]
        }else if(data.provincesId){
          provincesId = data.provincesId
          arr = [provincesId]
        }
        data.postion = data.postion.toString()
        vm.derail_address_obj = arr
        if(data.imageArr){
          vm.fileUrl = data.imageArr
        }else{
          vm.fileUrl = data.imagePath ? [data.imagePath] : ''
        }
        vm.startTime = data.startTime
        vm.endTime = data.endTime
      },
      // 对返回的原始数据的预处理
      pagerResult(data){
        var vm = this
        var result = vm.util.deepcopy(data)
        var len = result.length,item;
        for(var i=0;i<len;i++){
          item = result[i]
          if(typeof item.endTime == 'number'){
            item.endTime = vm.util.timestampToTime(item.endTime);
          }
          if(typeof item.startTime == 'number'){
            item.startTime = vm.util.timestampToTime(item.startTime);
          }
        }
        return result
      },
      initData () {
        let vm = this
        if(sessionStorage.chinaData){
          var chinaData = JSON.parse(sessionStorage.chinaData)
          vm.areaData = chinaData
          vm.cityData = vm.util.getCityDataByData(chinaData)
          vm.provinceData = vm.util.getProvinceDataByData(chinaData)
          vm.derail_address_arr_s = chinaData
          vm.derail_address_arr = vm.countryData
        }
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
    }
  }
</script>

<style scoped>
.image-box{
  position: relative;
  width:102px;
  height:102px;
  border:1px solid #eee;
  text-align: center;
}
.ad-img{
  max-width: 100px;
  max-height: 100px;
}
.demo-upload-list-cover{
  display: none;
  position: absolute;
  padding-top: 40px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,.6);
}
.image-box:hover .demo-upload-list-cover{
  display: block;
}
.demo-upload-list-cover i{
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
