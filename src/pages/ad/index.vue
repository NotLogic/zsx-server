<template>
  <div class="ad">
    <div id="search-wrapper">
      <Form :model="formSearch" ref="formSearch" inline :label-width="70">
        <template v-if="hasPerm('ad_index:search')">
          <FormItem label="标题">
            <Input v-model="formSearch.title" placeholder="标题" size="small" @keydown.native.enter.prevent="submitSearch('formSearch')"></Input>
          </FormItem>
          <FormItem label="广告位置" prop="postion">
            <Select v-model="formSearch.postion" placeholder="请选择" size="small" clearable style="width:170px;">
              <Option v-for="item in postion" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="广告状态" prop="lockStatus">
            <Select v-model="formSearch.lockStatus" placeholder="请选择" size="small" clearable style="width: 80px;">
              <Option v-for="item in lockStatus" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="投放级别">
            <Select v-model="formSearch.areaType" placeholder="请选择" size="small" clearable style="width: 80px;">
              <Option v-for="item in areaType" :key="item.value" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="关联地区">
            <Cascader :data="derail_address_arr_s" v-model="derail_address_obj_s" :filterable="true" size="small" style="margin-top: 5px"></Cascader>
          </FormItem>
          <FormItem label="展示时间">
            <FormItem>
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="点击选择时间" v-model="searchStartTime" @on-change="searchStartTimeChange" size="small" :clearable="false"></DatePicker>
            </FormItem>
            <FormItem>至</FormItem>
            <FormItem>
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="点击选择时间" v-model="searchEndTime" @on-change="searchEndTimeChange" size="small" :clearable="false"></DatePicker>
            </FormItem>
          </FormItem>
          <Button type="default" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" :disabled="pageLoading" size="small">{{label.clear}}</Button>
          <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" :disabled="pageLoading" size="small">{{label.search}}</Button>
        </template>
        <Button v-if="hasPerm('ad_index:add')" type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
        <Button v-if="hasPerm('ad_index:delete')" type="error" :disabled="batchIdArr.length==0" style="margin: 5px 8px 24px 0;" @click="batchDelete" size="small">批量删除</Button>
        <Button v-if="hasPerm('ad_index:clearCache')" type="warning" style="margin: 5px 8px 24px 0;" @click="clearCache('广告')" size="small">{{label.clearCache}}</Button>
      </Form>
    </div>
    
    <main-table :columns="columns" :data="currentPager.data" @updateSelect="updateSelect" :height="tableHeight" :loading="pageLoading"></main-table>
    <paging @changePager="changePager" @paging="paging" :total="currentPager.total" :current="currentPager.current" :loading="pageLoading"></paging>
    
    <!-- <mainTable :columns="columns" :data="pager.data" @updateSelect="updateSelect" :height="tableHeight"></mainTable> -->
    <!-- <paging @changePager="changePager" @paging="paging" :total="pager.total" :current="pager.current"></paging> -->

    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="900" :styles="{top:'30px'}" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="标题" prop="title">
              <Input v-model="formDialog.title" placeholder="请输入标题（广告图片下方的文字）"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="广告内容" prop="context">
              <Input v-model="formDialog.context" placeholder="请输入广告内容（广告图片上方的文字）"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="广告位置" prop="postion">
              <Select v-model="formDialog.postion" placeholder="请选择"  clearable>
                <Option v-for="item in postion" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="排序" prop="sort" inline>
              <InputNumber :max="10" :min="1" v-model="formDialog.sort" :disabled="formDialog.sort==1&&formDialog.isUp==2"></InputNumber>
              <Button type="default" v-if="formDialog.sort==1" @click="formDialog.isUp = formDialog.isUp==1 ?2:1">{{formDialog.isUp==1 ? '置顶' : '取消置顶'}}</Button>
              <span style="font-size: 80%;color: #ff4d44;padding-left: 3px">数值越小优先级越高</span>
            </FormItem>
          </Col>
        </Row>
        <!-- 上传广告图片 -->
        <Row>
          <Col span="24">
            <FormItem label="广告图片">
              <Col span="18">
                <Row>
                  <Col span="6">
                    <Upload name="file"
                        :action="url.upload"
                        :multiple="uploadImgMax==1 ? false : true"
                        :before-upload="myBeforeUpload"
                        :format="imgUploadFormat"
                        :on-format-error="handleFormatError"
                        :on-success="myHandleSuccess">
                      <Button type="default" icon="ios-cloud-upload-outline">选择图片</Button>
                    </Upload>
                    <Button type="primary" @click="myUpload" :loading="uploadLoading">
                      <Tooltip>
                        <span>确定上传</span>
                        <p slot="content"  style="white-space: normal;">{{imgRequiredTxt}}</p>
                      </Tooltip>
                    </Button>
                    <Button type="primary" @click="cropperDialogShow=true">裁剪图片</Button>
                  </Col>
                  <Col span="18">
                    <Row v-if="fileUrl.length">
                      <Col span="8" v-for="(item, index) in fileUrl" :key="item">
                        <div class="image-box">
                          <img :src="item" class="ad-img">
                          <div class="demo-upload-list-cover">
                            <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div v-show="!fileUrl.length" class="image-box">
                      <img :src="defaultUploadImgSrc" class="ad-img">
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col span="6">
                <span>只能上传</span>
                <template v-if="uploadImgMax==3">
                  <strong style="color:red;font-size:20px;">1</strong>
                  <span>或</span>
                  <strong style="color:red;font-size:20px;">{{uploadImgMax}}</strong>
                </template>
                <strong v-else style="color:red;font-size:20px;">1</strong>
                <span>张图片</span>
              </Col>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开始时间" prop="startTime">
              <DatePicker type="datetime" :options="startTimeOptions" placeholder="点击选择时间" @on-change="startTimeChange" v-model="startTime" :clearable="false" transfer :start-date="defaultStartTime"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="结束时间" prop="endTime">
              <DatePicker type="datetime" :options="endTimeOptions" placeholder="点击选择时间" @on-change="endTimeChange" v-model="endTime" :clearable="false" transfer></DatePicker>
            </FormItem>
          </Col>
          <!-- <Col span="8">
            <FormItem label="有效期">
              <InputNumber :min="1" v-model="effectiveTime"></InputNumber>
              <span>月</span>
            </FormItem>
          </Col> -->
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="投放级别" prop="areaType">
              <Select v-model="formDialog.areaType" placeholder="请选择" transfer disabled>
                <Option v-for="item in areaType" :key="item.value" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="关联地区">
              <Cascader :data="derail_address_arr" v-model="derail_address_obj" placeholder="选择关联地区" :clearabled="false" transfer></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="链接类型" prop="type">
              <Select v-model="formDialog.type" placeholder="请选择" transfer>
                <Option v-for="item in type" :key="item.value" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12" v-if="formDialog.type==2">
            <FormItem label="外链地址" prop="href">
              <Input type="url" v-model="formDialog.href" placeholder="请输入链接地址"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row  v-show="formDialog.type==1">
          <Col span="24">
            <!-- <ueditor v-model="formDialog.adContent" :config="myConfig"></ueditor> -->
            <ueditor2 v-model="formDialog.adContent" :config="myConfig"></ueditor2>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading" :disabled="uploadLoading">{{label.submit}}</Button>
      </div>
    </Modal>

    <!-- 预览广告内容 -->
    <Modal v-model="adContentShow" title="内链广告展示" :styles="{top:'30px'}" @on-cancel="adContentShow=false;adContent=''">
      <div class="preview-editor-content" v-html="adContent"></div>
      <div slot="footer">
        <Button @click="adContentShow=false;adContent=''">{{label.close}}</Button>
      </div>
    </Modal>
    <!-- 图片裁剪 -->
    <Modal v-model="cropperDialogShow" title="裁剪上传" :styles="{top:'30px'}" :mask-closable="false" @on-cancel="resetCropperDialog" width="700">
      <div class="cutting">
        <Upload type="drag" action="" :before-upload="beforeUpload">
          <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或拖拽文件到此处进行裁剪</p>
          </div>
        </Upload>
        <div style="width:490px;margin: 0 auto;text-align: center;">
          <img id="myImg" :src="cropperImgSrc" alt="" style="max-width: 100%;max-height:500px;">
        </div>
        <div style="margin-top: 15px;">
          <Button :type="which == 'banner' ? 'primary' : 'default'" @click="initCropper('banner')">
            <Tooltip>
              <span>banner</span>
              <p slot="content"  style="white-space: normal;">{{requiredSize['banner']}}</p>
            </Tooltip>
          </Button>
          <Button :type="which == 'one' ? 'primary' : 'default'" @click="initCropper('one')">
            <Tooltip>
              <span>单图</span>
              <p slot="content"  style="white-space: normal;">{{requiredSize['one']}}</p>
            </Tooltip>
          </Button>
          <Button :type="which == 'main' ? 'primary' : 'default'" @click="initCropper('main')">
            <Tooltip>
              <span>主图</span>
              <p slot="content"  style="white-space: normal;">{{requiredSize['main']}}</p>
            </Tooltip>
          </Button>
          <Button :type="which == 'secondary' ? 'primary' : 'default'" @click="initCropper('secondary')">
            <Tooltip>
              <span>次级图片</span>
              <p slot="content"  style="white-space: normal;">{{requiredSize['secondary']}}</p>
            </Tooltip>
          </Button>
        </div>
        <Form inline :label-width="100" style="margin-top: 15px;">
          <FormItem label="自定义宽度(px)">
            <InputNumber :min="100" v-model="selfWidth" placeholder="自定义宽度"></InputNumber>
          </FormItem>
          <FormItem label="自定义高度(px)">
            <InputNumber :min="50" v-model="selfHeight" placeholder="自定义高度"></InputNumber>
          </FormItem>
          <Button type="primary" @click="setProportion">设置自定义宽高</Button>
          <div>
            <Button type="primary" @click="resetCropper2" style="margin-right: 15px;">重置裁剪</Button>
            <Button type="primary" @click="beSureCropper" style="margin-right: 15px;">确定裁剪</Button>
            <Button type="primary" @click="myUpload" :loading="uploadLoading" style="margin-right: 15px;">
              <Tooltip>
                <span>确定上传</span>
                <p slot="content"  style="white-space: normal;">{{imgRequiredTxt}}</p>
              </Tooltip>
            </Button>
          </div>
        </Form>
        <Form :label-width="100" style="margin-top: 15px;">
          <FormItem label="上传的图片">
            <Row v-if="fileUrl.length">
              <Col span="8" v-for="(item, index) in fileUrl" :key="item">
                <div class="image-box">
                  <img :src="item" class="ad-img">
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                  </div>
                </div>
              </Col>
            </Row>
            <div v-show="!fileUrl.length" class="image-box">
              <img :src="defaultUploadImgSrc" class="ad-img">
            </div>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="resetCropperDialog">{{label.close}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import page from '@/mixins/page'
  import ueditor from '@/components/ueditor'
  import ueditor2 from '@/components/ueditor2'
  export default {
    name: 'ad',
    components: {
      mainTable,
      paging,
      ueditor,
      ueditor2,
    },
    mixins: [page],
    data () {
      return {
        imgMaxSize: 3, // 图片最大大小  单位Mb
        imgMinSize: 4, // 最小10kb
        url: {
          imgServer: 'web/server/get',
          add: 'advert/add',
          edit: 'advert/update',
          delete: 'advert/delete',
          search: 'advert/dataSearch',
          disableAd: 'advert/forbidden',
          upload: 'file/',
          sId: 'id/id',
          clearCache: 'web/cache/advert'
        },
        // 搜索的分页
        searchPager: {
          url: 'advert/dataSearch'
        },
        // 预览内链广告内容
        adContentShow: false,
        adContent: '',
        uploadLoading: false,
        needId: true,
        pager: {
          url: 'advert/dataGrid',
          data: [], // 声明vue时必须存在，因为vue无法观测动态新增的属性
        },
        batchIdArr: [],
        uploadImgMax: 1,
        uploadImgArr: [],
        fileUrl: [],
        derail_address_arr: [],
        derail_address_arr_s: [],
        derail_address_obj: [1],
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
        lockStatusMap: {
          1: '正常', 
          2: '禁用', 
          3: '过时'
        },
        areaType: [
          {
            value: 1,
            label: '全国'
          }, {
            value: 2,
            label: '省级'
          }, {
            value: 3,
            label: '市级'
          }, {
            value: 4,
            label: '区级'
          }
        ],
        areaTypeMap: {
          1: '全国',
          2: '省级',
          3: '市级',
          4: '区级',
        },
        type: [
          {
            value: 1,
            label: '内链'
          },
          {
            value: 2,
            label: '外链'
          },
          {
            value: 3,
            label: '展示'
          },
        ],
        typeMap: {
          1: '内链',
          2: '外链',
          3: '展示'
        },
        postion: [
          {
            value: 1,
            label: '发现banner'
          }, {
            value: 2,
            label: '发现列表页'
          }, {
            value: 3,
            label: '发现详情页'
          }, {
            value: 4,
            label: '政务banner'
          }, {
            value: 5,
            label: '招商banner'
          }, {
            value: 6,
            label: '办事指南详情页'
          }, {
            value: 7,
            label: '便民工具'
          }, {
            value: 8,
            label: '广场动态列表页'
          }, {
            value: 9,
            label: '广场动态详情页'
          },{
            value: 10,
            label: '简报详情页'
          }
        ],
        postionMap: {
          1: '发现banner',
          2: '发现列表页',
          3: '发现详情页',
          4: '政务banner',
          5: '招商banner',
          6: '办事指南详情页',
          7: '便民工具',
          8: '广场动态列表页',
          9: '广场动态详情页',
          10: '简报详情页'
        },
        chinaJson: {},
        provinceData: [],
        cityData: [],
        areaData: [],
        countryData: [{label: "中国", value: 1, children: []}],
        formSearch: {
          title: '',
          // 投放级别
          areaType: '',
          // 根据投放级别，将国、省市区code赋值给c
          // c: '',
          // countryId: '',
          // provincesId: '',
          // cityId: '',
          // 不分级别，只传areaId
          areaId: '',
          // 广告位置
          postion: '',
          // 状态
          lockStatus: '',
          // 开始结束时间
          startTime: '',
          endTime: '',
        },
        searchStartTime: '',
        searchEndTime: '',
        startTime: '',
        // defaultStartTime: new Date(this.util.timestampToTime(Date.now().valueOf() + 86400000)),
        // 当前时间可以选今天
        defaultStartTime: new Date(this.util.timestampToTime(Date.now().valueOf())),
        endTime: '',
        // 广告默认有效时间——数字格式的多少月
        effectiveTime: 12,
        startTimeOptions: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now().valueOf() - 86400000;
          }
        },
        endTimeOptions: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now().valueOf()
          }
        },
        formDialog: {
          id: '',
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
          areaType: 1,
          countryId: 1,
          provincesId: '',
          cityId: '',
          areaId: '',
          // 链接类型
          type: 3,
          context: '',
          // 内链时广告跳转内部链接显示的html字符串
          adContent: ''
        },
        columns: [
          {
            "type": 'selection',
            "fixed": 'left',
            "width": 80,
            "align": 'center'
          },
          // {
          //   'title': 'ID',
          //   'key': 'id',
          //   'width': 180,
          //   'fixed': 'left',
          //   'sortable': true
          // },
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
            render: (create, params) => {
              var url = params.row.imagePath,imageHost=this.imageHost || sessionStorage.imageHost
              if(url){
                if(url.indexOf('http') == -1){
                  url = imageHost + url
                }
                return create('a',{
                  attrs: {
                    href: url,
                    target: '_blank'
                  },
                },[create('img', {
                  attrs: {
                    src: url,
                    alt: url
                  },
                  style: {
                    'border': '1px solid transparent',
                    'border-radius': '4px',
                    'margin': '10px 0',
                    'max-width': '100px',
                    'max-height': '100px'
                  }
                })])
              }else{
                return create('span','无')
              }
            }
          },
          {
            'title': '链接类型',
            'key': 'type',
            'width': 220,
            render: (create, params)=>{
              var key = params.row.type,label,_params={},txt,arr=[],vm=this
              if(key==1){
                // 内链
                var adContent = params.row.adContent
                label = 'Button'
                _params = {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: function(){
                      vm.previewAdContent(adContent)
                    }
                  }
                }
                txt = '预览'
                arr = [create('span','内链: ')]
              }else if(key==2){
                // 外链
                label = 'a'
                _params = {
                  attrs: {
                    'href': params.row.href,
                    'target': '_blank'
                  },
                }
                txt = params.row.href
                arr = [create('span','外链: ')]
              }else if(key==3){
                label = 'span'
                txt='展示'
              }
              arr.push(create(label,_params,txt))
              return create('div',arr)
            }
          },
          {
            'title': '广告位置',
            'key': 'postion',
            'width': 200,
            'sortable': true,
            render: (create, params) => {
              var key = params.row.postion,map = this.postionMap
              var txt = map[key] ? map[key] : key
              return create('span', txt)
            }
          },
          // {
          //   'title': '省',
          //   'key': 'provincesId',
          //   'width': 100,
          // },
          // {
          //   'title': '市',
          //   'key': 'cityId',
          //   'width': 100,
          // },
          // {
          //   'title': '区',
          //   'key': 'areaId',
          //   'width': 100,
          // },
          {
            'title': '关联地区',
            'key': 'detailAddress',
            'width': 170,
            'sortable': true,
            render: (create, params) =>{
              var vm = this,arr=[]
              var map = {
                1: '', 2: ' (省)', 3: ' (市)', 4: ' (区)'
              }
              var txt = '',
                countryId = params.row.countryId,
                provincesId = params.row.provincesId,
                cityId = params.row.cityId,
                areaId = params.row.areaId,
                areaType=params.row.areaType
              if(areaType==1){
                txt = '全国'
              }else{
                if(areaType==2){
                  arr = provincesId ? [provincesId] : []
                }else if(areaType==3){
                  if(cityId){
                    var province = parseInt(cityId/10000)*10000
                    arr = [province,cityId]
                  }else{
                    arr = []
                  }
                }else if(areaType==4){
                  if(areaId){
                    var province = parseInt(areaId/10000)*10000
                    var city = parseInt(areaId/100)*100
                    arr = [province,city,areaId]
                  }else{
                    arr = []
                  }
                }
                txt = vm.util.getProvinceCityArea(arr,vm.chinaJson,true)
              }
              return create('span', txt + map[params.row.areaType])
            }
          },
          {
            'title': '开始时间',
            'key': 'startTime',
            'width': 160,
            'sortable': true,
            render: (create,params)=>{
              var vm=this,key=params.row.startTime,txt=key
              if(typeof key=='number'){
                txt = vm.util.timestampToTime(key)
              }
              return create('span',txt)
            }
          },
          {
            'title': '结束时间',
            'key': 'endTime',
            'width': 160,
            'sortable': true,
            render: (create,params)=>{
              var vm=this,key=params.row.endTime,txt=key
              if(typeof key=='number'){
                txt = vm.util.timestampToTime(key)
              }
              return create('span',txt)
            }
          },
          {
            'title': '状态',
            'key': 'lockStatus',
            'width': 100,
            'sortable': true,
            render:  (create, params) => {
              var map = this.lockStatusMap,
                key = params.row.lockStatus,
                style = {color: 'red'}
              var txt = map[key] ? map[key] : key
              if(key==1){
                return create('span',txt)
              }else{
                return create('span',{style:style},txt)
              }
            }
          },
          {
            'title': '排序',
            'key': 'sort',
            'width': 100,
            'sortable': true,
            render: (create,params)=>{
              var key=params.row.sort
              var txt = key==1? '置顶' : key
              return create('span',txt)
            }
          },
          {
            'title': '点击次数',
            'key': 'clickNum',
            'width': 120,
            'sortable': true
          },
          // {
          //   'title': '创建人',
          //   'key': 'createBy',
          //   'width': 120,
          // },
          // {
          //   'title': '是否有效',
          //   'key': 'iseffective',
          //   'width': 100,
          //   render: (create, params) => {
          //     var startTime = params.row.startTime,
          //       createTime = params.row.createTime,
          //       endTime = params.row.endTime,
          //       iseffective = false,
          //       now = Date.now()
          //       if(typeof(startTime) == 'string'){
          //         startTime = (new Date(startTime)).valueOf()
          //       }else if(typeof(startTime) == 'object'){
          //         startTime = startTime.valueOf()
          //       }
          //       if(typeof(createTime) == 'string'){
          //         createTime = (new Date(createTime)).valueOf()
          //       }else if(typeof(createTime) == 'object'){
          //         createTime = createTime.valueOf()
          //       }
          //       if(typeof(endTime) == 'string'){
          //         endTime = (new Date(endTime)).valueOf()
          //       }else if(typeof(endTime) == 'object'){
          //         endTime = endTime.valueOf()
          //       }
          //       if(startTime>createTime && startTime<endTime){
          //         iseffective = true
          //       }
          //       var style = iseffective ? {} : {color: 'red'}
          //       var txt = iseffective ? '有效' : '无效'
          //       if(now > endTime){
          //         txt = '过时'
          //         style = {color: 'red'}
          //       }
          //       return create('span',{
          //         style : style
          //       },txt)
          //   }
          // },
          
          {
            'title': '创建时间',
            'key': 'createTime',
            'width': 160,
            'sortable': true,
            render: (create,params)=>{
              var vm=this,key=params.row.createTime,txt=key
              if(typeof key=='number'){
                txt = vm.util.timestampToTime(key)
              }
              return create('span',txt)
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
              var status = params.row.lockStatus,arr = []
              if(vm.hasPerm('ad_index:edit')){
                arr.push(vm.createEditBtn(create, params.row))
              }
              if(vm.hasPerm('ad_index:delete')){
                arr.push(vm.createDelBtn(create, params.row.id))
              }
              // if(status=!3){
                var txt = status == 1 ? '禁用' : '启用'
                var type = status == 1 ? 'warning' : 'success'
                var btn = create('Button', {
                  props: {
                    type: type,
                    size: 'small'
                  },
                  style: {
                    'margin-left': '5px'
                  },
                  on: {
                    click: () => {
                      vm.$Modal.confirm({
                        title: '确认',
                        content: "确认" + txt +"这条数据吗？",
                        onOk: function () {
                          vm.disableRow({id: params.row.id})
                        }
                      })
                    }
                  }
                }, txt)
               if(vm.hasPerm('ad_index:disabled')){
                  arr.push(btn)
                } 
                
              // }
              return create('div', arr)
            }
          }
        ],
        rules: {
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          postion: [
            // { required: true, message: '广告位置不能为空', trigger: 'change' }
          ]
          // context: [
          //   { required: true, message: '广告内容不能为空', trigger: 'blur' },
          //   { required: true, max: 20, message: '广告内容最多20个字符', trigger: 'blur' },
          //   { required: true, max: 20, message: '广告内容最多20个字符', trigger: 'change' },
          // ]
        }
      }
    },
    methods: {
      addRow () {
        // 时间要手动选
        // this.initTimes()
        this.currDialog = 'add'
        this.dialogShow = true
      },
      // 初始化结束时间
      initEndTime(date,effectiveTime){
        var vm = this,
        date = date && (typeof(date)=='object' ? date : new Date(date)) || new Date(),
        effectiveTime = effectiveTime || 12;
        var Y = date.getFullYear(),
        M = date.getMonth(),
        D = date.getDate(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds(),
        months = M + effectiveTime
        var _M = months % 12
        var _Y = parseInt(months / 12) + Y
        var _date = _Y + '-' + (_M + 1) + '-' + D + ' ' + h + ':' + m + ':' + s
        return new Date(_date)
      },
      // 预览内链的广告内容
      previewAdContent(content){
        var vm = this
        if(content){
          vm.adContent = content
          vm.adContentShow = true
        }else{
          vm.$Message.info('内容为空')
        }
      },
      updateSelect(selection){
        var vm = this,batchIdArr = [],len=selection.length;
        if(len){
          for(var i=0;i<len;i++){
            batchIdArr.push(selection[i].id)
          }
        }
        vm.batchIdArr = batchIdArr
      },
      searchStartTimeChange(date){
        var vm = this
        var startTime = vm.searchStartTime,
          endTime = vm.searchEndTime
        var iseffective = vm.inEffectiveTime(startTime,endTime)
        if(endTime&&!iseffective){
          vm.$Message.error('您所选的开始时间大于结束时间，请重新选择！')
          vm.formSearch.startTime = ''
          vm.searchStartTime = ''
        }else{
          vm.formSearch.startTime = date
        }
      },
      searchEndTimeChange(date){
        var vm = this
        var startTime = vm.searchStartTime,
          endTime = vm.searchEndTime
        var iseffective = vm.inEffectiveTime(startTime,endTime)
        if(startTime&&!iseffective){
          vm.$Message.error('您所选的结束时间小于开始时间，请重新选择！')
          vm.formSearch.endTime = ''
          vm.searchEndTime = ''
        }else{
          vm.formSearch.endTime = date
        }
      },
      startTimeChange(date){
        var vm = this,_date=date || ''
        var startTime = vm.startTime,
          endTime = vm.endTime,
          now = Date.now()
        if(startTime.valueOf()<now){
          startTime = new Date(now + 60*2*1000)
          _date = vm.util.timestampToTime(startTime.valueOf())
        }
        vm.startTime = startTime
        var iseffective = vm.inEffectiveTime(startTime,endTime)
        if(endTime&&!iseffective){
          vm.$Message.error('您所选的开始时间大于结束时间，请重新选择！')
          vm.formDialog.startTime = ''
          vm.startTime = ''
        }else{
          vm.formDialog.startTime = _date
        }
      },
      endTimeChange(date){
        var vm = this
        var startTime = vm.startTime,
          endTime = vm.endTime
        var iseffective = vm.inEffectiveTime(startTime,endTime)
        if(startTime&&!iseffective){
          vm.$Message.error('您所选的结束时间小于开始时间，请重新选择！')
          vm.formDialog.endTime = ''
          vm.endTime = ''
        }else{
          vm.formDialog.endTime = date
        }
      },
      // 结束时间是否大于开始时间
      inEffectiveTime(startTime,endTime){
        startTime = typeof(startTime) == 'object' ? startTime : new Date(startTime)
        endTime = typeof(endTime) == 'object' ? endTime : new Date(endTime)
        return startTime.valueOf() < endTime.valueOf() ? true : false
      },
      resetSearch (name) {
        var vm = this
        vm.searchStartTime =  ''
        vm.searchEndTime = ''
        vm.formSearch.title = ''
        vm.formSearch.areaType = ''
        vm.derail_address_obj_s = []
        vm.$refs[name].resetFields()
        vm.isSearchStatus = false
        vm.paging(1)
      },
      resetDialogForm (name) {
        name = name || 'formDialog'
        let vm = this
        vm.endTime = ''
        vm.startTime = ''
        vm.uploadLoading=false
        vm.dialogSubmitLoading=false
        vm.formDialog.areaType=1
        vm.derail_address_arr = vm.countryData 
        vm.fileUrl = []
        vm.formDialog.id=''
        vm.formDialog.provincesId=''
        vm.formDialog.cityId=''
        vm.formDialog.areaId=''
        vm.formDialog.adContent=''
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {
        let vm = this
        vm.$refs[name].validate(function (valid) {
          if (valid) {
            if (vm.initPostDialog) {
              vm.initPostDialog(vm.formDialog)
            }
            var pager = vm.pager,currDialog=vm.currDialog
            let ajaxUrl = vm.url[currDialog]
            var method =  pager.method
            if(currDialog=='add' && typeof pager.addMethod != 'undefined'){
              method = pager.addMethod
            }
            if(currDialog=='edit' && typeof pager.editMethod != 'undefined'){
              method = pager.editMethod
            }
            vm.dialogSubmitLoading = true
            var params = {
              url: ajaxUrl,
              method: method,
            }
            let ajaxData = vm.editAddAjaxData(vm.currDialog)
            if(ajaxData.id){
              if(method=='post'){
                params.data = ajaxData
              }else if(method=='get'){
                params.params = ajaxData
              }
              vm.selfSubmit(params,name)
            }else{
              vm.$http.post(vm.url.sId).then(res=>{
                var resData = res.data
                if(resData.code==1){
                  ajaxData.id = resData.data
                  if(method=='post'){
                    params.data = ajaxData
                  }else if(method=='get'){
                    params.params = ajaxData
                  }
                  vm.selfSubmit(params,name)
                }else{
                  vm.$Message.error(resData.message)
                }
              }).catch(err=>{})
            }
          }
        })
      },
      selfSubmit(params,name){
        var vm = this
        vm.$http(params).then(res => {
          vm.dialogSubmitLoading = false
          var resData = res.data
          if(resData.code==1){
            vm.$Message.success(vm.label[vm.currDialog]+'成功!')
            if(vm.currDialog=='add'){
              vm.paging(1);
            }else{
              vm.paging();
            }
            vm.dialogShow = false
            if(typeof vm.resetDialogForm == 'function'){
              vm.resetDialogForm(name)
            }
            // 新增/编辑数据后更新某些数据
            if(typeof vm.updateOther == 'function'){
              vm.updateOther()
            }
          }else{
            vm.$Message.error(vm.label[vm.currDialog]+'失败: ' + resData.message)
          }
        }).catch(err=>{})
      },
      disableRow(data){
        var vm = this
        vm.$http2({
          url: vm.url.disableAd,
          method: vm.pager.method,
          data: data
        }).then(res => {
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
      imgTest(fileObj){
        var vm = this,obj = {},
        code = 1,
        message = '',
        type = fileObj.type.split('/')[1],
        size = fileObj.size
        var one = vm.imgRequiredSize.one,
          main = vm.imgRequiredSize.main,
          secondary = vm.imgRequiredSize.secondary,
          uploadImgMax = vm.uploadImgMax,
          // 用于展示的数组
          fileUrl = vm.fileUrl,
          imgUploadFormat = vm.imgUploadFormat,
          imgMaxSize = vm.imgMaxSize,
          imgMinSize = vm.imgMinSize
        var len = fileUrl.length,len2 = imgUploadFormat.length,typeIsOk = false,sizeIsOk = false,typeTxt=''
        if(!type){
          code = 0
          message = '文件格式未知，请重新选择'
        }else{
          type = type.toLocaleLowerCase()
        }
        for(let i=0;i<len2;i++){
          typeTxt += i==len2-1 ? imgUploadFormat[i] : imgUploadFormat[i] + '、' 
          if(type==imgUploadFormat[i]){
            typeIsOk = true
            break
          }
        }
        if(!typeIsOk){
          obj.code = 0
          obj.message = `请选择${typeTxt}格式的文件`
          return obj
        }
        if(size/1000/1000>imgMaxSize){
          obj.code = 0
          obj.message = `请选择小于${imgMaxSize}Mb的文件`
          return obj
        }
        if(size/1000<imgMinSize){
          obj.code = 0
          obj.message = `请选择大于${imgMinSize}Kb的文件`
          return obj
        }
        // 尺寸约束
        function chicun (){
          let reader = new FileReader()
          reader.readAsDataURL(fileObj)
          // 这特喵是个异步
          reader.onloadend = function(e){
            var sizeErrorRange = 0.05 //误差范围
            var image = new Image();
            image.src= reader.result;
            image.onload=function(){
              var width = image.width,
                height = image.height,
                _width = 0,
                _height = 0
              if(imgMaxSize==1){
                // 单图
                _width = one.width,
                _height = one.height
              }else{
                // 多图
                if(len){
                  _width = secondary.width,
                  _height = secondary.height
                }else{
                  // 主图
                  _width = main.width,
                  _height = main.height
                }
              }
              if(_width<width){
                code=0
                message = '您选择的图片宽度过小,请重新选择'
              }else if(_height<height){
                code=0
                message = '您选择的图片高度过小,请重新选择'
              }else{
                if(!(width/_width<1+sizeErrorRange&&height/_height<1+sizeErrorRange)){
                  code = 0
                  message = '您选择的图片比例不符合要求，请重新上传'
                }
              }
              return {
                code: code,
                message: message
              }
            };
          }
        }
        obj.code = code
        obj.message = message
        return obj
      }, 
      myBeforeUpload(file){
        var vm = this;
        var imgTestResult = vm.imgTest(file)
        if(!imgTestResult.code){
          vm.$Message.error({
            content: imgTestResult.message,
            duration: 3
          })
          return false
        }
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
            var len = vm.fileUrl.length
            if(len==3){
              vm.fileUrl.shift()
              vm.uploadImgArr.shift()
            }
            vm.fileUrl.push(reader.result) // 这一行将图片转为base64存储到file对象里边
            vm.uploadImgArr.push(file)
          }
        }
        return false
      },
      myHandleSuccess(){},
      myUpload(){
        // 确认上传
        var vm = this
        if(!vm.uploadImgArr.length){
          vm.$Message.error('请先选择上传的图片')
          return
        }
        vm.uploadLoading = true
        if(vm.currDialog=='add' && !vm.formDialog.id){
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
      uploadFile(sId,userId){
        var vm = this;
        let params = new FormData();
        vm.uploadImgArr.forEach(file =>{
          params.append('file', file)
        });
        params.append('sId',sId)
        // s   1  用户  2  帖子  3  广告  4  资讯(原新闻)
        params.append('s',3)
        // 使用位置p1：用户头像 2：帖子列表 3：帖子回复 4:创建群头像 5:编辑群头像 6:广告 7:系统通知 8:新闻
        params.append('p',6)
        var config =  {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        };
        var user = JSON.parse(sessionStorage.user)
        var userId = userId || user.userId || 10
        vm.$http.post(vm.url.upload + userId, params, config).then(res=>{
          vm.uploadLoading=false
          let rd = res.data;
          if(rd.code==1){
            // 清空已上传数组
            vm.fileUrl = [];
            vm.uploadImgArr = [];
            vm.$Message.success('上传图片成功！');
            var arr = []
            var data = rd.data
            for(let key in data){
              if(key=='server')continue
              arr.push(data[key]);
            }
            // 只有一张图片  如果多图的话用不用逗号隔开？
            vm.formDialog.imagePath = arr[0];
            // vm.formDialog.imagePath = arr.join(',')
            vm.uploadLoading = false
          }else{
            vm.$Message.error(rd.message)
          }
        }).catch(err=>{})
      },
      handleFormatError(){
        this.$Message.error('文件格式错误，请选择jpg、jpeg、png或gif格式的文件！')
      },
      handleRemove(index){
        var vm = this
        vm.fileUrl.splice(index,1)
        vm.uploadImgArr.splice(index,1)
        var uploadImgMax = vm.uploadImgMax
        vm.resetCropper()
        if(uploadImgMax==1){
          vm.formDialog.imagePath = ''
        }else if(uploadImgMax==3){
          var str = vm.formDialog.imagePath
          if(str.indexOf(',')==-1){

          }
        }
      },
      // 上传文件  end
      updateContent(content){
        this.formDialog.adContent = content
      },
      // 删除行
      delRow (data) {
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
      batchDelete(){
        var vm = this
        vm.$Modal.confirm({
          title: '确认',
          content: '确认删除这些广告吗？',
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
      batchoperation(parmas){
        var vm = this
        parmas.method = parmas.method || 'post'
        vm.$http2(parmas).then(res=>{
          var resData = res.data
          if(resData.code==1){
            vm.$Message.success('操作成功');
            vm.batchIdArr = []
            vm.paging()
          }else{
            vm.$Message.error(resData.message);
          }
        }).catch(err=>{})
      },
      // 编辑行时回显的额外操作  
      initDialog (data) {
        // 为什么data有的值没打印出来，但是直接取却能取到
        var vm = this,arr=[],areaId,cityId,provincesId
        var areaType = data.areaType
        // vm.formDialog.areaType = areaType
        if(areaType==4){
          areaId = data.areaId
          cityId = parseInt(parseInt(areaId/100) + '00')
          provincesId = parseInt(parseInt(areaId/10000) + '0000')
          arr = [provincesId, cityId, areaId]
          // vm.formDialog.areaId = areaId
        }else if(areaType==3){
          cityId = data.cityId
          provincesId = parseInt(areaId/10000) + '0000'
          arr = [provincesId, cityId]
          // vm.formDialog.cityId = cityId
        }else if(areaType==2){
          arr = [data.provincesId]
          // vm.formDialog.provincesId = data.provincesId
        }else if(areaType==1){
          arr = [data.countryId]
          // vm.formDialog.countryId = data.countryId
        }
        // 时间差 
        setTimeout(function(){
          vm.derail_address_obj = arr
        },30)
        // vm.$nextTick(function(){
        //   vm.derail_address_obj = arr
        // })
        var imagePath = data.imagePath,imageHost=vm.imageHost||sessionStorage.imageHost
        if(imagePath){
          if(imagePath.indexOf('http')==-1){
            imagePath = imageHost + imagePath
          }
          vm.fileUrl = [imagePath]
        }else{
          vm.fileUrl = []
        }
        var startTime = data.startTime
        if(typeof startTime=='number'){
          startTime = vm.util.timestampToTime(startTime)
        }
        vm.startTime = startTime
        var endTime = data.endTime
        if(typeof endTime=='number'){
          endTime = vm.util.timestampToTime(endTime)
        }
        vm.endTime = endTime
        vm.formDialog.adContent = data.adContent || ''
      },
      initTimes(){
        var vm=this
        var date = new Date()
        vm.startTime = date
        vm.endTime = vm.initEndTime(date,vm.effectiveTime)
        vm.formDialog.startTime = vm.getDate(date)
        vm.formDialog.endTime = vm.getDate(vm.endTime)
      },
      getDate(date){
        date = typeof(date)=='object' ? date : new Date(date)
        var Y = date.getFullYear(),
        M = date.getMonth() < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth(),
        D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate(),
        h = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours(),
        m = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes(),
        s = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
        var _date = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
        return _date
      },
      paging (data) {
        let vm = this,config={}
        // 对象类型的传参为修改此次请求的config;  number类型的传参为翻页翻到第几页
        if(typeof data == 'object'){
          config = data
        }else if (Number(data)) {
          vm.changePager(data)
          return
        }
        vm.pageLoading = true
        var pager = {},method='post',ajaxData = {},params={}
        // 搜索和列表共用分页，通过状态判断是搜索翻页还是列表翻页  点击搜索进入搜索状态，点击清空退出搜索状态
        if(vm.isSearchStatus){
          // 是搜索
          pager = vm.searchPager
          method = pager.method || (typeof(vm.pager.searchMethod) != 'undefined' ? vm.pager.searchMethod : method)
          var _ajaxData = vm.pagingFiltData(pager),_formSearch={},formSearch=vm.formSearch
          // for(let key in _ajaxData){
          //   _formSearch[key] = _ajaxData[key]
          // }
          for(let key in formSearch){
            if(formSearch[key] != ''){
              _formSearch[key] = formSearch[key]
            }
          }
          ajaxData = _formSearch
        }else{
          // 不是搜索
          pager = vm.pager
          method = pager.method || method
          ajaxData = vm.pagingFiltData(pager)
        }
        params = {
          url: pager.url,
          method: method,
        }
        if(vm.isSearchStatus){
          params.params = _ajaxData
          params.data = _formSearch
        }else{
          if(method=='get'){
            params.params = ajaxData
          }else{
            params.data = ajaxData
          }
        }
        (function(){
          if(vm.isSearchStatus){
            return vm.$http(params,config)
          }else{
            return vm.$http2(params,config)
          }
        })().then(res => {
          let resData = res.data,data=[],total=0
          vm.pageLoading = false
          if(resData.records){
            data = resData.records
            total = resData.total
          }else if (resData.code == 1) {
            if(resData.data && typeof(resData.data.records) != 'undefined'){
              data = resData.data.records
              total = resData.data.total
            }else if(resData.data){
              data = resData.data
              total = resData.total
            }
          }
          if(!data)data=[]
          if(!total)total=0
          if (typeof vm.pagerResult == 'function') {
            // 返回数据预处理
            resData.data = vm.pagerResult(data)
          }
          if(typeof vm.initOther == 'function'){
            vm.initOther(data)
          }
          setTimeout(function(){
            pager.total = total
            pager.data = data
            typeof vm.searchPager == 'undefined' ? vm.pager = pager : vm.currentPager = pager
            // vm.pager = pager
            // vm.currentPager = pager
          },50)
        }).catch(err=>{})
      },
      initData () {
        let vm = this
        if(sessionStorage.chinaData){
          var chinaData = JSON.parse(sessionStorage.chinaData)
          vm.chinaJson = JSON.parse(sessionStorage.chinaJson)
          vm.areaData = chinaData
          vm.cityData = vm.util.getCityDataByData(chinaData)
          vm.provinceData = vm.util.getProvinceDataByData(chinaData)
          vm.derail_address_arr_s = chinaData
          vm.derail_address_arr = vm.countryData
        }
      }
    },
    watch: {
      'formSearch.areaType': function(val){
        var vm = this
        if(val==1){
          vm.derail_address_arr_s = vm.countryData
        }else if(val==2){
          vm.derail_address_arr_s = vm.provinceData
        }else if(val==3){
          vm.derail_address_arr_s = vm.cityData
        }else if(val==4){
          vm.derail_address_arr_s = vm.areaData
        }
      },
      derail_address_obj_s (val) {
        var vm=this,len = val.length
        vm.formSearch.areaId = ''
        if (len) {
          vm.formSearch.areaId = val[len-1]
        }else{
          vm.formSearch.areaId = ''
        }
      },
      derail_address_obj (val) {
        var vm = this,len=val.length
        var areaType = vm.formDialog.areaType
        if(len){
          if (val.length==3) {
            vm.formDialog.areaId = val[2]
          } else if(val.length==2){
            vm.formDialog.cityId = val[1]
          }else if(val.length==1){
            if(areaType==1){
              vm.formDialog.countryId = val[0]
            }else{
              vm.formDialog.provincesId = val[0]
            }
          }
        }
      },
      'formSearch.p': function(val){
        var vm = this
        // 1、首页banner        全国
        // 2、推荐列表/锵锵简报 全国
        // 3、推荐详情 		 全国
        // 4、政务banner 		 省份
        // 5、招商banner 		 省份
        // 6、办事指南  		 区域
        // 7、便民工具  		 区级
        // 8、广场动态  		 市级
        // 9、动态详情  		 区域
        if(val==1 || val==2 || val ==3){
          vm.formSearch.t = 1
        }else if(val==4 || val==5){
          vm.formSearch.t = 2
        }else if(val==8){
          vm.formSearch.t = 3
        }else if(val==6 || val==7 || val==9){
          vm.formSearch.t = 4
        }
      },
      'formSearch.t': function(val) {
        let vm = this
        if (val==1) {
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
        if (val==1) {
          vm.derail_address_arr = vm.countryData
          vm.derail_address_obj = [1]
        }else{
          if (val==2) {
            vm.derail_address_arr = vm.provinceData
          } else if (val==3) {
            vm.derail_address_arr = vm.cityData
          } else if (val==4) {
            vm.derail_address_arr = vm.areaData
          }
          vm.derail_address_obj = []
          vm.formDialog.countryId = ''
        }
      },
      ['formDialog.postion'](val){
        var vm = this
        // 1、首页banner    全国
        // 2、推荐列表      全国
        // 3、推荐详情 		  全国
        // 4、政务banner 	  省级
        // 5、招商banner 		省级
        // 6、办事指南  		区级
        // 7、便民工具  		区级
        // 8、广场动态  		区级
        // 9、动态详情  		区域
        // 10、简报详情  		全国
        if(val==1 || val==2 || val ==3 || val == 10){
          vm.formDialog.areaType = 1
        }else if(val==4 || val==5){
          vm.formDialog.areaType = 2
        }else if(val==6 || val==7 || val==9 || val==8){
          vm.formDialog.areaType = 4
        }
        // 指定的几个广告位置可以上传3张图片
        // if (val==3){
        //   vm.uploadImgMax = 3
        // } else {
        //   vm.uploadImgMax = 1
        // }
      },
      effectiveTime(val){
        this.endTime = this.initEndTime(val)
      },
      'formDialog.type': function(val){
        var vm = this
        if(val==1){
          vm.formDialog.href = ''
        }else if(val==2){
          vm.formDialog.adContent = ''
        }else{
          vm.formDialog.href = ''
          vm.formDialog.adContent = ''
        }
      }
    }
  }
</script>
