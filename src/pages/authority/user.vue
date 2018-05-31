<template>
  <div class="user">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="用户">
            <Input v-model="formSearch.name" placeholder="用户名/账号/手机号" size="small"></Input>
        </FormItem>
        <FormItem label="管理区域">
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
        </FormItem>
        <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="672"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="登录名" prop="loginUsername">
                <Input v-model="formDialog.loginUsername" placeholder="请输入登录名称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="用户名" prop="nickName">
                <Input v-model="formDialog.nickName" placeholder="请输入用户名"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12" v-if="currDialog=='add'">
            <FormItem label="密码" prop="loginPassword">
                <Input v-model="loginPassword" placeholder="请输入密码" type="password"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="isAuth" prop="isAuth">
              <Input v-model="formDialog.isAuth"></Input>
            </FormItem>
          </Col>
          <!-- <Col span="12">
            <FormItem label="salt" prop="salt">
              <Input v-model="formDialog.salt"></Input>
            </FormItem>
          </Col> -->
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
              <Input v-model="formDialog.isConsummate"></Input>
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
        <!-- <Row>
          <Col span="12">
            <FormItem label="appSoucre" prop="appSoucre">
              <Input v-model="formDialog.appSoucre"></Input>
            </FormItem>
          </Col>
          
        </Row> -->
        <!-- <Row>                 
          <Col span="12">
            <FormItem label="角色" prop="roleIds">                        
              <Select v-model="formDialog.roleIds" multiple>
                <Option v-for="item in roleIds" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row> -->
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
          search: 'user/dataSearch'
        },
        pager: {
          data: [],
          url: 'user/dataGrid',
          // sort: 'createTime',
          // order: 'desc'
        },
        derail_address_arr: [],
        derail_address_obj_s: [],
        hometown_address: [], // 家乡
        location_address: [], //  所在地
        roleIds: [],
        userStatus: [{label:'正常', value:'1'}, {label:"禁用", value:'2'}, {label:"封号", value:'3'}],
        sex: [{label:'男', value:'1'}, {label:"女", value:'0'}],
        sexMap: {
          '0': '女',
          '1': '男',
          '': '保密'
        },
        formSearch: {
          name: '',
          createdateStart: '',
          createdateEnd: '',
          areaCode: ''
        },
        birthday: '',
        loginPassword: '',
        formDialog: {
          id: '',
          loginUsername: '',
          loginPassword: '',
          salt: '',
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
            "width": 240,
            "sortable": true
          },
          {
            "title": "账号",
            "key": "loginUsername",
            "width": 150,
            "sortable": true
          },
          {
            "title": "用户名",
            "key": "nickName",
            "width": 150,
            "sortable": true
          },
          {
            "title": "密码",
            "key": "loginPassword",
            "width": 240,
            "sortable": true
          },
          {
            "title": "salt",
            "key": "salt",
            "width": 260,
            "sortable": true
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
            "title": "appSoucre",
            "key": "appSoucre",
            "width": 240,
            "sortable": true
          },
          {
            "title": "用户头像",
            "key": "headPortrait",
            "width": 240,
            "sortable": true
          },
          {
            "title": "头像背景",
            "key": "bgPortrait",
            "width": 240,
            "sortable": true
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
            "title": "isAuth",
            "key": "isAuth",
            "width": 240,
            "sortable": true
          },
          {
            "title": "isConsummate",
            "key": "isConsummate",
            "width": 150,
            "sortable": true
          },
          {
            "title": "状态",
            "key": "userStatus",
            "width": 100,
            "sortable": true,
            // render: (create, params) => {
            //   var map = this.$store.state.map.status
            //   return create('span', map[params.row.status]);
            // }
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
            width: 140,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this
              return create('div', [
                vm.createEditBtn(create, params.row),
                vm.createDelBtn(create, params.row.id)
              ])
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
      delRow (data) {
        console.log('删除行提交2： ',data)
        var vm = this
        vm.$http2({
          url: vm.url.delete,
          method: vm.pager.method,
          data: data
        }).then(res => {
          var resData = res.data
          if(resData.code==1){
            vm.$Message.success("删除成功！")
            vm.paging()
          }else{
            vm.$Message.error(resData.message)
          }
        }).catch(err=>{

        })
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
        var vm = this;
        vm.formDialog.birthday = ''
        vm.birthday = ''
        vm.$refs[name].resetFields()
      },
      initDialog () {},
      initData () {
        this.derail_address_arr = JSON.parse(sessionStorage.chinaData)
      }
    },
    computed: {},
    created () {},
    mounted () {},
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
