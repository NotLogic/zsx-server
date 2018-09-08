<template>
  <div class="zsx-main main" id="main">
    <div class="side-menu" :style="{left: hideMenuText ? '-200px' : '0'}">
      <div class="logo">
        <!-- <img src="/static/images/logo.png" alt=""> -->
      </div>
      <sidebar :menuList="menuList"></sidebar>
    </div>
    <div class="all-right" :style="{paddingLeft: hideMenuText ? '0' : '200px'}">
      <div class="main-header">
        <div class="navicon-con">
          <Button type="text" @click="toggleClick" :style="{transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}">
            <Icon type="md-reorder" size="32"></Icon>
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <span>欢迎</span>
          <span v-if="isAgent">
            <strong>{{agentAddress}}</strong>
            <span>代理商</span>
          </span>
          <Dropdown @on-click="clickDropdown" style="margin-right: 30px;">
            <Button type="text">
              <span>{{user.nickName || user.loginName}}</span>
              <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
              <DropdownItem name="modify">修改昵称/密码</DropdownItem>
              <DropdownItem name="logout">注销</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <!-- <Button type="text" class="btn-logout" icon="log-out" size="large" style="margin-right: 20px;" @click="exitToLogin">注销</Button> -->
        </div>
      </div>
      <!-- 已打开过页面的快捷导航 -->      
      <tags-page-opened :pageOpenedList="pageOpenedList"></tags-page-opened>
      <!-- 单页内容展示区域 -->
      <div class="single-page" :style="{left:hideMenuText?0:'200px'}">
        <div class="single-box" id="single-box">
          <keep-alive :include="cachePage">
            <router-view></router-view>
          </keep-alive>
        </div>
      </div>
      <div class="copyright" :style="{left:hideMenuText?0:'200px'}">
        Copyright © 深圳市众善行文化传播有限公司版权所有
      </div>
    </div>

    <!-- 修改昵称密码 -->
    <Modal v-model="dialogShow" title="修改昵称/密码" :mask-closable="false" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="账号" prop="loginName">
              <Input v-model="formDialog.loginName" placeholder="请输入账号" disabled></Input>
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
            <FormItem label="修改密码">
              <Select v-model="passType" placeholder="请选择" style="width: 100px;">
                <Option v-for="item in type" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="passType==1">
          <Col span="12">
            <FormItem label="密码" prop="loginPass">
              <Input v-model="formDialog.loginPass" placeholder="请输入密码" type="password"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="确认密码">
              <Input v-model="loginPass" placeholder="请确认密码" type="password"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">重置</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import util from '@/libs/util'
  import sidebar from '@/components/sidebar'
  import tagsPageOpened from '@/components/tagsPageOpened'
  import breadcrumbNav from '@/components/breadcrumbNav'
  export default {
    name: 'zsx_main',
    components: {
      sidebar,
      tagsPageOpened,
      breadcrumbNav
    },
    data () {
      return {
        hideMenuText: false,
        // exitUrl: 'web/sys/user/quit/',
        exitUrl: 'web/sys/user/quit',
        modify: 'web/sys/user/update',
        typeMap:{
          0:"否",
          1:"是"
        },
        type:[
          {
            value: 0,
            label:"否"
          },
          {
            value: 1,
            label:"是"
          }
        ],
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
        isAgent: false,
        agentAddress: '',
        dialogSubmitLoading: false,
        dialogShow: false,
        passType: 0,
        chinaJson: {},
        user: {
          id: '',
          loginName: '',
          nickName: '',
        },
        formDialog: {
          id: '',
          loginName: '',
          loginPass: '',
          nickName: '',
        },
        rules: {
          loginPass: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    // 计算属性 引入vuex进行状态管理，从store实例中读取状态最简单的方法就是在计算属性中返回某个状态
    computed: {
      menuList () {
        return this.$store.state.menuList
      },
      // 所有打开的页面
      pageOpenedList () {
        return this.$store.state.pageOpenedList
      },
      // 面包屑数组
      currentPath () {
        return this.$store.state.currentPath
      },
      cachePage () {
        return this.$store.state.cachePage
      }
    },        
    methods: {
      exitToLogin () {
        let vm = this
        vm.$Modal.confirm({
          title: '确认退出',
          content: '点击“取消”将留在当前页，点击“确定”将转向登录页。',
          onOk: function () {
            vm.$http.get(vm.exitUrl).then(res=>{
              if(res&&res.data){
                var resData = res.data
                if(resData.code==1){
                  vm.$Message.success('退出成功！')
                  vm.$store.dispatch('exitLogin')
                }
              }
            })
          }
        })
      },
      toggleClick (e) {
        this.hideMenuText = !this.hideMenuText
        e && e.preventDefault();
      },
      clickDropdown(name){
        var vm = this,key
        if(name=='modify'){
          // 修改密码
          for(key in vm.formDialog){
            vm.formDialog[key] = vm.user[key]
          }
          vm.dialogShow = true
        }else if(name=='logout'){
          vm.exitToLogin()
        }
      },
      resetDialogForm(name){
        name = name || 'formDialog'
        var vm = this
        vm.passType = 0
        vm.formDialog.nickName = vm.user.nickName + ''
        // 不能清除当前用户信息
        // vm.$refs[name].resetFields()
      },
      submitDialogForm(name){
        var vm = this
        vm.$refs[name].validate(function (valid) {
          if (valid) {
            var url='',data={},params={},method='post'
            url = vm.modify + '?type=' + vm.passType
            data = vm.util.deepcopy(vm.formDialog)
            if(vm.passType){
              // 修改密码
              if(vm.formDialog.loginPass == vm.loginPass){
                data.loginPass = hex_md5(data.loginPass)
              }else{
                vm.$Message.info('您输入的确认密码和密码不一致，请重新输入')
                return false
              }
            }else{
              // 不修改密码
              delete data.loginPass
            }
            params = {
              url,
              method,
              data
            }
            vm.dialogSubmitLoading = true
            vm.$http(params).then(res=>{
              vm.dialogSubmitLoading = false
              if(res&&res.status==200){
                if(res.data.code==1){
                  vm.$Message.success('修改成功')
                  vm.dialogShow = false
                  if(sessionStorage.sysUser){
                    var sysUser = JSON.parse(sessionStorage.sysUser)
                    var nickName = vm.formDialog.nickName + ''
                    if(typeof(sysUser.nickName) != 'undefined'){
                      sysUser.nickName = nickName
                      sessionStorage.sysUser = JSON.stringify(sysUser)
                    }
                    vm.user.nickName = nickName
                  }
                }else{
                  if(res.data.message){
                    vm.$Message.info(res.data.message)
                  }
                }
              }
            })
          }
        })
      },
    },
    watch: {
      passType(val){
        var vm = this
        vm.formDialog.loginPass = ''
        vm.loginPass = ''
      }
    },
    mounted () {
      let vm = this
      // 解决刷新时已打开快捷导航状态丢失
      var currentPath = sessionStorage.currentPath,pageOpenedList=sessionStorage.pageOpenedList
      if (pageOpenedList) {
        vm.$store.commit('setPageOpenedList', JSON.parse(pageOpenedList))
      }
      if (currentPath) {
        vm.$store.commit('setCurrentPath', JSON.parse(currentPath))
      }
      var obj = {},key,_obj={}
      if(sessionStorage.sysUser){
        obj = JSON.parse(sessionStorage.sysUser)
      }
      for(key in vm.user){
        _obj[key] = obj[key] || ''
      }
      vm.user = vm.util.deepcopy(_obj)
      vm.formDialog = vm.util.deepcopy(_obj)
    }
  }
</script>

<style scoped>
  .main .side-menu{
    position: absolute;
    top: 0;
    height: 100%;
    width: 200px;
    /* background: rgb(73, 80, 96); */
    background: #515a6e;
    z-index: 1;
    /* overflow: auto; */
    overflow: hidden;
    transition: left .3s;
  }
  .side-menu .logo{
    padding: 10px 0;
    /* text-align: center; */
  }
  .side-menu .logo img{
    /* max-width: 80%; */
    max-width: 100%;
  }
  .main .all-right{
    box-sizing: border-box;
    position: absolute;
    padding-left: 200px;
    top: 0;
    width: 100%;
    height: 100%;
    transition: padding-left .3s;
  }
  .main .all-right .main-header{
    height: 60px;
    line-height: 60px;
    background: #fff;
    border-bottom: 1px solid #eee;
  }
  .navicon-con{float: left}
  .header-middle-con{float: left}
  .header-avator-con{float: right}
  .main .all-right .single-page{
    box-sizing: border-box;
    position: absolute;
    top:100px;
    left: 200px;
    right: 0;
    bottom: 60px;
    background: #f5f7f9;
    overflow: auto;
    padding: 10px;
    transition: left .3s;
    overflow: auto;
  }
  .single-box{
    background-color: #fff;
    padding: 10px;
    height: 100%;
    border: 1px solid #eee;
    overflow: auto;
    /* background: url('../../assets/images/welcome.jpg') no-repeat center;
    background-size: cover; */
  }
  .main .all-right .copyright{
    position: absolute;
    height: 60px;
    bottom: 0;
    right: 0;
    left: 200px;
    text-align: center;
    line-height: 60px;
    background: #f5f7f9;
    transition: left .3s;
  }
</style>
