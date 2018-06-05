<template>
  <div class="user">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="用户">
            <Input v-model="formSearch.name" placeholder="用户名/账号/手机号" size="small"></Input>
        </FormItem>
        <!-- <FormItem label="管理区域">
            <Cascader :data="derail_address_arr" v-model="derail_address_obj_s" filterable size="small" style="margin-top: 5px"></Cascader>
        </FormItem>
        <FormItem label="创建时间">
            <FormItem prop="createdateStart">
                <DatePicker type="datetime" placeholder="点击选择时间" style="width: 160px;" v-model="formSearch.createdateStart" size="small" :clearable="false"></DatePicker>
            </FormItem>
            <FormItem>至</FormItem>
            <FormItem prop="createdateEnd">
                <DatePicker type="datetime" placeholder="点击选择时间" style="width: 160px;" v-model="formSearch.createdateEnd" size="small" :clearable="false"></DatePicker>
            </FormItem>
        </FormItem> -->
        <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <!-- 用户数据展示表格 -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <!-- 添加/编辑用户弹窗 -->
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row v-if="currDialog=='add'">
          <Col span="12">
            <FormItem label="账号" prop="loginUsername">
                <Input v-model="formDialog.loginUsername" placeholder="请输入账号"></Input>
            </FormItem>
          </Col>
          <Col span="12" >
            <FormItem label="密码" prop="loginPassword">
                <Input v-model="loginPassword" placeholder="请输入密码" type="password"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="isAuth" prop="isAuth">
              <Select v-model="formDialog.isAuth">
                  <Option v-for="item in isAuth" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="昵称" prop="nickName">
                <Input v-model="formDialog.nickName" placeholder="请输入昵称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="性别" prop="sex">
                <Select v-model="formDialog.sex">
                    <Option v-for="item in sex" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
          <Col span="12">
              <FormItem label="电话" prop="phone">
                <Input v-model="formDialog.phone"></Input>
              </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="出生日期" prop="birthday">
              <DatePicker type="date" placeholder="点击选择出生日期" @on-change="birthChange" v-model="birthday" :clearable="false"></DatePicker>
            </FormItem>
          </Col>
           <Col span="12">
            <FormItem label="年龄" prop="age">
              <Input v-model="formDialog.age"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="头像" prop="headPortrait">
              <Input v-model="formDialog.headPortrait"></Input>
              <Row>
                <Col span="12">
                  <Upload name="file"
                      :action="url.upload"
                      :before-upload="myBeforeUpload"
                      :format="['jpg','jpeg','png','gif']"
                      :on-format-error="handleFormatError"
                      :max-size="3000"
                      :on-exceeded-size="handleMaxSize">
                    <Button type="ghost" icon="ios-cloud-upload-outline">选择头像</Button>
                  </Upload>
                  <Button type="primary" @click="myUpload" :loading="uploadLoading">上传头像</Button>
                </Col>
                <Col span="12">
                  <Row v-if="fileUrl.length">
                    <Col span="8" v-for="(item, index) in fileUrl" :key="item">
                      <div class="image-box">
                        <img :src="item" class="ad-img">
                        <div class="demo-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
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
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="头像背景" prop="bgPortrait">
              <Input v-model="formDialog.bgPortrait"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="所在地">
              <Cascader :data="derail_address_arr" v-model="hometown_address" filterable></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="家乡">
              <Cascader :data="derail_address_arr" v-model="location_address" filterable></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="isConsummate" prop="isConsummate">
              <Select v-model="formDialog.isConsummate">
                  <Option v-for="item in isConsummate" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="用户状态" prop="userStatus">
                <Select v-model="formDialog.userStatus">
                  <Option v-for="item in userStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
    <!-- 预览用户数据 -->
    <Modal v-model="previewShow" title="预览" width="1000">
      <Row>
        <Col span="4" class="rightt"><strong>账号:</strong></Col>
        <Col span="19"><p>{{previewData.loginUsername}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>用户昵称:</strong></Col>
        <Col span="19" ><p>{{previewData.nickName}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>appSoucre:</strong></Col>
        <Col span="19" ><p>{{previewData.appSoucre}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>出生日期:</strong></Col>
        <Col span="19" ><p>{{previewData.birthday}}</p></Col>
      </Row>

      <Row>
        <Col span="4" class="rightt"><strong>年龄:</strong></Col>
        <Col span="19" ><p>{{previewData.age}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>性别:</strong></Col>
        <Col span="19" ><p>{{previewData.sex}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>用户头像:</strong></Col>
        <Col span="19" ><p>{{previewData.headPortrait}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>头像背景:</strong></Col>
        <Col span="19" ><p>{{previewData.bgPortrait}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>所在地:</strong></Col>
        <Col span="19" ><p>{{previewData.location}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>家乡:</strong></Col>
        <Col span="19" ><p>{{previewData.home}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>是否认证:</strong></Col>
        <Col span="19" ><p>{{previewData.isAuth}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>是否完善资料:</strong></Col>
        <Col span="19" ><p>{{previewData.isConsummate}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>用户状态:</strong></Col>
        <Col span="19" ><p>{{previewData.userStatus}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>创建时间:</strong></Col>
        <Col span="19" ><p>{{previewData.createTime}}</p></Col>
      </Row>
      <div slot="footer">
        <Button type="primary" size="large"  @click="previewShow = false">关闭</Button>
      </div>
    </Modal>
    <!-- 根据userId获取的帖子数据 -->
    <Modal v-model="postShow" title="预览" width="1000">

    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import page from '@/mixins/page'
  export default {
    name: 'user',
    components: {
      mainTable,
      paging
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'user/add',
          edit: 'user/update',
          delete: 'user/delete',
          search: 'user/dataSearch',
          upload: 'api/file/',
          sId: 'id/id',
          post: 'post/search/userId/',
        },
        pager: {
          data: [
            {}
          ],
          url: 'user/dataGrid',
        },
        postShow: false,
        needId: true,
        previewShow: false,
        uploadLoading: false,
        fileUrl: [],
        uploadImgArr: [],
        derail_address_arr: [],
        derail_address_obj_s: [],
        hometown_address: [], // 家乡
        location_address: [], //  所在地
        roleIds: [],
        chinaJson: {},
        userStatus: [{label:'正常', value:'1'}, {label:"禁用", value:'2'}, {label:"封号", value:'3'}],
        userStatusMap: {
          "1": "正常",
          "2": "禁用",
          "3": "封号"
        },
        isAuth: [{label:'否', value:'0'}, {label:"是", value:'1'}],
        isAuthMap: {
          '0': '否',
          '1': '是',
        },
        isConsummate: [{label:'否', value:'0'}, {label:"是", value:'1'}],
        isConsummateMap: {
          '0': '否',
          '1': '是',
        },
        sex: [{label:'男', value:'1'}, {label:"女", value:'0'}],
        sexMap: {
          '0': '女',
          '1': '男',
          '': '保密'
        },
        formSearch: {
          name: '',
          // createdateStart: '',
          // createdateEnd: '',
          // areaCode: ''
        },
        birthday: '',
        loginPassword: '',
        previewData: {},
        formDialog: {
          id: '',
          loginUsername: '',
          loginPassword: '',
          nickName: '',
          birthday: '',
          age: '',
          sex: '',
          appSoucre: '3', // 后台管理系统添加的用户appSource永远为3，为了和ios和安卓用户区分
          bgPortrait: '',
          headPortrait: '',
          provincesCode: '',
          cityCode: '',
          areaCode: '',
          homeProvincesCode: '',
          homeCityCode: '',
          homeAreaCode: '',
          isAuth: '',
          isConsummate: '',
          userStatus: '1',
          createTime: '',
        },
        columns: [
          {
            "type": 'selection',
            "fixed": 'left',
            "width": 80,
            "align": 'center'
          },
          {
            "title": "ID",
            "key": "id",
            "width": 200,
            "sortable": true
          },
          {
            "title": "账号",
            "key": "loginUsername",
            "width": 150,
            "sortable": true
          },
          {
            "title": "用户昵称",
            "key": "nickName",
            "width": 150,
            "sortable": true
          },
          {
            "title": "appSoucre",
            "key": "appSoucre",
            "width": 150,
            "sortable": true,
            render(create,params){
              var map = {
                "1": 'IOS',
                "2": "Android",
                "3": "Web"
              }
              return create('span',map[params.row.appSoucre])
            }
          },
          {
            "title": "出生日期",
            "key": "birthday",
            "width": 240,
            "sortable": true
          },
          {
            "title": "年龄",
            "key": "age",
            "width": 80,
            "sortable": true
          },
          {
            "title": "性别",
            "key": "sex",
            "width": 80,
            "sortable": true,
            render: (create, params) => {
              var vm = this
              var txt = vm.sexMap[params.row.sex]
              return create('span',txt)
            }
          },
          {
            "title": "用户头像",
            "key": "headPortrait",
            "width": 240,
            "sortable": true,
            render: function (create, params) {
              return create('img', {
                attrs: {
                  src: params.row.headPortrait
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
            "title": "头像背景",
            "key": "bgPortrait",
            "width": 240,
            "sortable": true,
            render: function (create, params) {
              return create('img', {
                attrs: {
                  src: params.row.bgPortrait
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
            "title": "省",
            "key": "provincesCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "市",
            "key": "cityCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "区",
            "key": "areaCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "家乡省",
            "key": "homeProvincesCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "家乡市",
            "key": "homeCityCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "家乡区",
            "key": "homeAreaCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "是否认证",
            "key": "isAuth",
            "width": 150,
            "sortable": true,
            render: (create, params) => {
              var status = params.row.isAuth ? params.row.isAuth.toString() : '';
              return create('span', this.isAuthMap[status]);
            }
          },
          {
            "title": "是否完成资料",
            "key": "isConsummate",
            "width": 150,
            "sortable": true,
            render: (create, params) => {
              var status = params.row.isConsummate ? params.row.isConsummate.toString() : '';
              return create('span', this.isConsummateMap[status]);
            }
          },
          {
            "title": "状态",
            "key": "userStatus",
            "width": 100,
            "sortable": true,
            render: (create, params) => {
              var status = params.row.userStatus ? params.row.userStatus.toString() : '';
              return create('span', this.userStatusMap[status]);
            }
          },
          {
            "title": "创建时间",
            "key": "createTime",
            "width": 200,
            "sortable": true
          },
          {
            title: '操作',
            key: 'action',
            width: 250,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this
              var arr = [vm.createPreviewBtn(create, params.row), vm.createPostBtn(create,params.row.id), vm.createEditBtn(create, params.row)]
              if(params.row.appSoucre=='3'){
                arr.push(vm.createDelBtn(create, params.row))
              }
              return create('div',arr)
            }
          }
        ],
        rules: {
          loginUsername: [
            { required: true, message: '登录名称不能为空', trigger: 'blur' },
            { type: 'string', min: 4, max: 64, message: '登录名须在4-64个字符之间', trigger: 'blur' }
          ],
          nickName: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          loginPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          // userStatus: [
          //   { required: true, message: '用户状态不能为空', trigger: 'change' }
          // ],
          // userType: [
          //   { required: true, message: '用户类型不能为空', trigger: 'change' }
          // ],
          // roleIds: [
          //   { required: true, message: '用户角色不能为空', trigger: 'blur' }
          // ],
          // sex: [
          //   { required: true, message: '用户性别不能为空', trigger: 'change' }
          // ],
          // detailAddress: [
          //   { required: true, message: '请选择关联地区', trigger: 'change' }
          // ],
          // phone : [
          //   { required: true, message: '联系方式不能为空', trigger: 'change' },
          // ]
        }
      }
    },
    methods: {
      createPreviewBtn(create,rowData){
        var vm = this;
        return create('Button',{
          props: {
            type: 'primary',
            size: 'small'
          },
          style: {
            'margin-right': '5px'
          },
          on: {
            click(){
              var previewData = {};
              for(var key in rowData){
                previewData[key] = rowData[key]
              }
              // var provincesCode = rowData.provincesCode,
              //     cityCode = rowData.cityCode,
              //     areaCode = rowData.areaCode,
              //     homeProvincesCode = rowData.homeProvincesCode,
              //     homeCityCode = rowData.homeCityCode,
              //     homeAreaCode = rowData.homeAreaCode;
              // previewData.location = vm.util.getProvinceCityArea([provincesCode,cityCode,areaCode], vm.chinaJson, true)
              // previewData.home = vm.util.getProvinceCityArea([homeProvincesCode,homeCityCode,homeAreaCode], vm.chinaJson, true)
              vm.previewData = previewData
              vm.previewShow = true
            }
          }
        },'预览')
      },
      createPostBtn(create, userId){
        var vm = this;
        return create('Button',{
          props: {
            type: 'primary',
            size: 'small',
            // loading: false // 绑定上传loading效果
          },
          style: {
            'margin-right': '5px'
          },
          on: {
            click(){
              vm.initPostData(userId)
            }
          }
        },'查看帖子')
      },
      initPostData(userId){
        var vm = this;
        if(!userId){
          vm.$Message.error('用户ID获取失败')
          return
        } 
        vm.$http.post(vm.url.post + userId).then(res=>{
          console.log('res: ',res)
        }).catch(err=>{})
      },
      // 手动上传图片
      myBeforeUpload(file){
        var vm = this;
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function (e) {
          vm.fileUrl = [reader.result]
          vm.uploadImgArr = [file]
        }
        return false
      },
      handleFormatError(){},
      handleMaxSize(){},
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
        params.append('s',1)
        // 使用位置 1：用户头像 2：帖子列表 3：帖子回复 4:创建群头像 5:编辑群头像 
        params.append('p',1)
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
      handleView(index){},
      handleRemove(index){
        var vm = this
        vm.fileUrl.splice(index,1)
        vm.uploadImgArr.splice(index,1)
      },

      birthChange(date){
        var vm = this
        if(date.length){
          vm.formDialog.birthday = date + ' 00:00:00'
          var now = new Date();
          var arr = date.split('-');
          var year = now.getFullYear(),
              month = now.getMonth() + 1;
          var birthYear = Number(arr[0]),
              birthMonth = Number(arr[1]);
          var a = year-birthYear,
              b = month - birthMonth;
          vm.formDialog.age = b > 0 || b==0 ? a : a-1;
        }else{
          vm.formDialog.birthday = ''
          vm.formDialog.age = 0
        }
      },
      resetSearch (name) {
        let vm = this
        vm.derail_address_obj_s = []
        vm.formSearch.name = ''
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
      },
      resetDialogForm (name) {
        name = name || 'formDialog'
        var vm = this;
        vm.formDialog.birthday = ''
        vm.birthday = ''
        vm.$refs[name].resetFields()
      },
      initDialog (data) {
        console.log('data: ',data)
      },
      initData () {
        var vm = this
        if(sessionStorage.chinaData){
          vm.derail_address_arr = JSON.parse(sessionStorage.chinaData)
          vm.chinaJson = JSON.parse(sessionStorage.chinaJson)
        }
      }
    },
    watch: {
      loginPassword(val){
        this.formDialog.loginPassword = hex_md5(val)
      },
      derail_address_obj_s (val) {
        if (val.length) {
          this.formSearch.areaCode = val[2]
        } else {
          this.formSearch.areaCode = ''
        }
      },
      hometown_address(val){
        var vm =this;
        if(val.length){
          vm.formDialog.provincesCode = val[0]
          vm.formDialog.cityCode = val[1]
          vm.formDialog.areaCode = val[2]
        }else{
          vm.formDialog.provincesCode = ''
          vm.formDialog.cityCode = ''
          vm.formDialog.areaCode = ''
        }
      },
      location_address(val){
        var vm =this;
        if(val.length){
          vm.formDialog.homeProvincesCode = val[0]
          vm.formDialog.homeCityCode = val[1]
          vm.formDialog.homeAreaCode = val[2]
        }else{
          vm.formDialog.homeProvincesCode = ''
          vm.formDialog.homeCityCode = ''
          vm.formDialog.homeAreaCode = ''
        }
      }
    },
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
