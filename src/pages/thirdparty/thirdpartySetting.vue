<template>
  <div class="thirdparty-setting">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="接口名称" prop="apiName">
        <Input v-model="formSearch.apiName" placeholder="接口名称" size="small" style="width: 120px"></Input>
      </FormItem>
      <FormItem label="分类名称">
        <Select v-model="formSearch.thirdpartyClassid" placeholder="请选择分类名称" size="small" style="width: 125px;">
          <Option v-for="item in thirdpartyClassid" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="接口类别" prop="thirdpartyType">
        <Select v-model="formSearch.thirdpartyType" placeholder="请选择" size="small" clearable style="width: 75px;">
          <Option value="1">工具</Option>
          <Option value="2">API</Option>
        </Select>
      </FormItem>
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="debugging" size="small">{{label.debugging}}</Button>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="90">
        <Row>
          <Col span="12">
            <FormItem label="分类名称" prop="thirdpartyClassid">
              <Select v-model="formDialog.thirdpartyClassid" placeholder="请选择接口名称" style="width: 140px;">
                <Option v-for="item in thirdpartyClassid" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="接口名称" prop="apiName">
              <Input v-if="currDialog=='add'" v-model="formDialog.apiName" placeholder="请输入接口名称"></Input>
              <Input v-else v-model="formDialog.apiName" placeholder="请输入接口名称" disabled></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="接口路径" prop="apiUrl">
              <Input v-model="formDialog.apiUrl" placeholder="请输入接口路径"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row v-show="!isComm">
          <Col span="12">
            <FormItem label="接口秘钥" prop="apiKey">
              <Input v-model="formDialog.apiKey" placeholder="请输入接口秘钥"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="接口秘串" prop="apiSecret">
              <Input v-model="formDialog.apiSecret" placeholder="请输入接口秘串"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col v-show="!isComm" span="12">
            <FormItem label="接口编码" prop="apiCode">
              <Input v-model="formDialog.apiCode" placeholder="请输入接口编码"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="接口描述" prop="apiDesc">
              <Input v-model="formDialog.apiDesc" placeholder="请输入接口描述"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="接口分类" prop="thirdpartyType">
              <Select v-model="formDialog.thirdpartyType" placeholder="请选择接口分类" style="width: 140px;">
                <Option value="1">工具</Option>
                <Option value="2">API</Option>
              </Select>
            </FormItem>
          </Col>
          <Col v-if="formDialog.thirdpartyType=='1'" span="12">
            <FormItem label="工具图标" prop="apiIcon">
              <Row>
                <Col span="12">
                  <div style="width:130px;height:130px;border:1px solid #eee;">
                    <img v-if="formDialog.classIcon" style="max-width:100%;" :src="formDialog.classIcon"/>
                    <img v-else style="max-width:100%;" src="static/images/img-upload-default.png"/>
                  </div>
                </Col>
                <Col span="12" style="text-align:right;">
                  <Upload name=""
                          action=""
                          :on-success="uploadSuccess"
                          :show-upload-list="false">
                    <Button type="primary" size="small">工具图标</Button>
                  </Upload>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="接口状态" prop="apiStatus">
              <Select v-model="formDialog.apiStatus" placeholder="请选择接口状态" style="width: 140px;">
                <Option value="0">禁用</Option>
                <Option value="1">启用</Option>
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
    <!-- 调试 -->
    <Modal v-model="debuggerDialogShow" title="调试" :mask-closable="false" width="750" @on-cancel="resetDubberForm('debuggerFormDialog')">
      <Form :model="debuggerFormDialog" ref="debuggerFormDialog" :rules="rules" :label-width="90">
        <Row>
          <Col span="12">
            <FormItem label="调试接口名称">
              <Select v-model="debuggerFormDialog.settingId" filterable placeholder="请选择或输入调试接口名称">
                <Option v-for="item in debuggingApiNameMap" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="请求方式" prop="httpMethod">
              <Select v-model="debuggerFormDialog.httpMethod" placeholder="请选择请求方式" style="width: 140px;">
                <Option v-for="item in httpMethod" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="是否加密" prop="isEncrypt">
              <Select v-model="debuggerFormDialog.isEncrypt" placeholder="请选择是否加密" style="width: 140px;">
                <Option value="0">否</Option>
                <Option value="1">是</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="编码格式" prop="charSet">
              <Select v-model="debuggerFormDialog.charSet" placeholder="请选择编码格式" style="width: 140px;">
                <Option v-for="item in charSet" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="请求配置" prop="httpParameter">                        
              <Row>
                <Col span="18">
                  <Input v-model="debuggerFormDialog.httpParameter" disabled></Input>
                </Col>
                <Col span="6" style="text-align: right;">
                  <Button type="primary" @click="showHandleDialog('handleModal','httpParameter')" size="small">添加</Button>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="头部" prop="headers">
              <Row>
                <Col span="18">
                  <Input v-model="debuggerFormDialog.headers" disabled></Input>
                </Col>
                <Col span="6" style="text-align: right;">
                  <Button type="primary" @click="showHandleDialog('handleModal','headers')" size="small">添加</Button>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row v-show="messageShow">
          <Col span="20">
            {{message}}
          </Col>
          <Col span="4">
            <Button type="primary" @click="closeMessage" size="small">关闭</Button>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDubberForm('debuggerFormDialog')">取消</Button>
        <Button type="primary" @click="submitDebuggerDialogForm('debuggerFormDialog')">调试</Button>
      </div>
    </Modal>
    <!-- 添加请求配置、头部 -->
    <Modal v-model="handleModal" :title="settingHeaderTxt" :mask-closable="false" @on-cancel="handleCancle">
      <Row style="margin-bottom: 10px;">
        <Button type="primary" @click="showHandleDialog('addHandleModal')" size="small">{{label.add}}</Button>
      </Row>
      <Row v-show="isShow" style="margin-bottom: 10px;">
        <Col span="18">
          <Row style="text-align: center;" :gutter="16">
            <Col span="12">key</Col>
            <Col span="12">value</Col>
          </Row>
        </Col>
        <Col span="6"></Col>            
      </Row>
      <Row v-for="(item,index) in handleData" :key="index" style="margin-bottom: 10px;">
        <Col span="18">
          <Row :gutter="16">
            <Col span="12">
              <Input v-model="item.key" placeholder='key' size="small" disabled></Input>
            </Col>
            <Col span="12">
              <Input v-model="item.value" placeholder='value' size="small" disabled></Input>
            </Col>
          </Row>
        </Col>
        <Col span="6">
          <Button type="primary" @click="editHandle(index)" size="small" style="margin-left: 10px;margin-right: 10px;">编辑</Button>
          <Button type="error" @click="deleteHandle(index)" size="small">删除</Button>
        </Col>
      </Row>        
      <div slot="footer">
        <Button @click="handleCancle">取消</Button>            
        <Button type="primary" @click="handleBesure">确定</Button>
      </div>
    </Modal>
    <Modal v-model="addHandleModal" title="添加" :mask-closable="false" @on-cancel="addHandleCancle('addHandleDialog')">
      <Form :model="addHandleDialog" ref="addHandleDialog" :rules="rules" :label-width="80">
        <FormItem label="key" prop="key">
          <Input :autofocus="true" v-model="addHandleDialog.key" placeholder='key'></Input>
        </FormItem>
        <FormItem label="value" prop="value">
          <Input v-model="addHandleDialog.value" placeholder='value'></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addHandleCancle('addHandleDialog')">取消</Button>
        <Button type="primary" @click="addHandleBesure('addHandleDialog')">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import page from '@/mixins/page'
  export default {
    name: 'thirdpartySetting',
    components: {
      mainTable,
      paging
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'thirdpartySetting/add.do',
          edit: 'thirdpartySetting/edit.do',
          delete: 'thirdpartySetting/delete.do',
          debugger: 'thirdpartySetting/debug.do'
        },
        pager: {
          data: [
            {
              id: '948819372377862144',
              thirdpartyClassid: '948818526680346624',
              thirdpartyType: '2',
              apiName: '黄历',
              apiUrl: 'http://jisuhlcx.market.alicloudapi.com/huangli/date',
              apiIcon: '',
              apiDesc: '工具类型API直接访问即可',
              apiKey: '',
              apiSecret: '',
              apiCode: '',
              apiStatus: '1'
            }, {
              id: '948861862766120960',
              thirdpartyClassid: '948818816473198592',
              thirdpartyType: '2',
              apiName: '重置IM用户密码',
              apiUrl: 'http://a1.easemob.com/{0}/{1}/users/{2}/password',
              apiIcon: '',
              apiDesc: '0:org_name 1:app_name 2:{owner_username} 用户名',
              apiKey: '',
              apiSecret: '',
              apiCode: '',
              apiStatus: '1'
            }, {
              id: '948867166710992896',
              thirdpartyClassid: '948818816473198592',
              thirdpartyType: '2',
              apiName: '转让群组',
              apiUrl: 'http://a1.easemob.com/{0}/{1}/chatgroups/{2}',
              apiIcon: '',
              apiDesc: '0:org_name 1:app_name 2：群组ID',
              apiKey: '',
              apiSecret: '',
              apiCode: '',
              apiStatus: '1'
            }
          ],
          url: 'thirdpartySetting/dataGrid.do'
        },
        isComm: false,
        onOffDisabled: false,
        thirdpartyClassidMap: {
          '948818526680346624': '阿里云-云市场',
          '948818816473198592': '环信'
        },
        thirdpartyClassid: [
          {
            'value': '948818526680346624',
            'label': '阿里云-云市场'
          },
          {
            'value': '948818816473198592',
            'label': '环信'
          }
        ],
        formSearch: {
          apiName: '',
          thirdpartyClassid: '',
          thirdpartyType: ''
        },
        formDialog: {
          id: '',
          thirdpartyClassid: '',
          thirdpartyType: '2',
          apiName: '',
          apiUrl: '',
          apiIcon: '',
          apiDesc: '',
          apiKey: '',
          apiSecret: '',
          apiCode: '',
          apiStatus: '1'
        },
        debuggerDialogShow: false,
        debuggerFormDialog: {
          settingId: "",
          httpMethod: "",
          isEncrypt: "0",
          httpParameter: "",
          headers: "",
          // bodys: "",
          charSet: "UTF-8"
        },
        debuggingApiNameMap: [],
        httpMethod: [
          {
            value: "GET",
            label: "GET"
          },{
            value: "POST",
            label: "POST"
          },{
            value: "PUT",
            label: "PUT"
          },{
            value: "DELETE",
            label: "DELETE"
          }
        ],
        charSet: [
          {
            value: "ISO-8859-A",
            label: "ISO-8859-A"
          },{
            value: "UTF-8",
            label: "UTF-8"
          }
        ],
        messageShow: false,
        message: "",
        settingHeaderTxt: "",//判断新增的是请求配置还是头部，值为请求配置或头部
        handleModal: false,
        isShow: false,
        handleData: [],
        addHandleModal: false,
        handleAddEdit: true,
        addHandleDialog: {
          key: "",
          value: ""
        },
        rememberData:{//保存已添加的数据
          headers: [],
          httpParameter: []
        },
        columns: [
          {
            title: '配置ID',
            key: 'id',
            width: 160,
            fixed: 'left'
          }, {
            title: '接口名称',
            key: 'apiName',
            width: 230
          }, {
            title: '分类名称',
            key: 'thirdpartyClassid',
            width: 120,
            render: (create, params) => {
              var vm = this
              return create('span', vm.thirdpartyClassidMap[params.row.thirdpartyClassid])
            }
          }, {
            title: '接口类别',
            key: 'thirdpartyType',
            width: 90,
            render: function (create, params) {
              var map = {
                '1': '工具',
                '2': 'API'
              }
              return create('span', map[params.row.thirdpartyType])
            }
          }, {
            title: '接口路径',
            key: 'apiUrl',
            width: 380
          }, {
            title: '接口描述',
            key: 'apiDesc',
            width: 350
          }, {
            title: '使用量',
            key: 'applicationAmount',
            width: 100
          }, {
            title: '接口秘钥',
            key: 'apiKey',
            width: 250
          }, {
            title: '接口秘串',
            key: 'apiSecret',
            width: 250
          }, {
            title: '接口编码',
            key: 'apiCode',
            width: 250
          }, {
            title: '状态名称',
            key: 'apiStatus',
            width: 90,
            render: function (create, params) {
              var map = {
                '0': '禁用',
                '1': '启用'
              }
              return create('span', map[params.row.apiStatus])
            }
          }, {
            title: '工具图标',
            key: 'apiIcon',
            width: 150,
            render: function (create, params) {
              if (params.row.thirdpartyType != '1') return
              if (params.row.apiIcon == '' || params.row.apiIcon == 'null') {
                return create('span', '暂无图标')
              } else {
                return create('img', {
                  attrs: {
                    src: params.row.apiIcon
                  },
                  style: {
                    maxWidth: '120px',
                    margin: '10px 0'
                  }
                })
              }
            }
          }, {
            title: '操作',
            key: 'action',
            width: 100,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              var vm = this
              return vm.createEditBtn(create, params.row)
            }
          }
        ],
        rules: {}
      }
    },
    computed: {},
    methods: {
      debugging () {
        this.debuggerDialogShow = true
      },
      resetDialogForm (name) {
        let vm = this
        vm.$refs[name].resetFields()
      },
      uploadSuccess () {},
      resetSearch (name) {
        var vm = this
        vm.formSearch.thirdpartyClassid = ''
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
      },
      closeMessage: function(){
        this.messageShow = false
        this.message = ""
      },
      // 重置调试表单
      resetDubberForm: function(name){
        var vm = this;
        vm.debuggerDialogShow = false;
        vm.debuggerApiName = "";
        vm.debuggerFormDialog.isEncrypt = "0";
        vm.debuggerFormDialog.settingId = "";
        vm.debuggerFormDialog.httpMethod = "";
        vm.debuggerFormDialog.charSet = "UTF-8";
        vm.$refs[name].resetFields();
        vm.closeMessage();
        vm.handleData = [];
        vm.rememberData = {//清空已添加的数据
          headers: [],
          httpParameter: []
        };
      },
      // 提交调试表单
      submitDebuggerDialogForm: function(name){
        console.log('提交调试表单')
      },
      handleCancle: function(){
        var vm = this
        vm.settingHeaderTxt = ""
        vm.handleData = []
        vm.handleModal = false;
      },
      handleBesure: function(){
        var vm = this
        if(vm.settingHeader=="httpParameter"){
          vm.rememberData.httpParameter = vm.util.extend(vm.handleData)
          vm.debuggerFormDialog.httpParameter = vm.formatData(vm.handleData)
        }else if(vm.settingHeader=="headers"){
          vm.rememberData.headers = vm.util.extend(vm.handleData)
          vm.debuggerFormDialog.headers = vm.formatData(vm.handleData,true)
        }
        vm.handleAddEdit = true
        vm.handleCancle()
      },
      // 添加按钮
      showHandleDialog: function(name,choice){
        var vm = this
        vm[name] = true
        if(typeof(choice)=="undefined")return
        if(choice=="httpParameter"){
          vm.settingHeaderTxt = "添加请求配置"
        }else if(choice=="headers"){
          vm.settingHeaderTxt = "添加头部"
        }
        vm.settingHeader = choice;
        // // 数据回显
        vm.handleData = vm.util.extend(vm.rememberData[choice])
      },
      // 3添加
      addHandleBesure: function(name){
        var vm = this
        var key = "" + vm.addHandleDialog.key
        var value = "" + vm.addHandleDialog.value
        if(vm.handleAddEdit){
          // 添加
          vm.handleData.push({
              "key": key,
              "value": value
          })
        }else{
          // 编辑
          vm.handleData[vm.handleIndex].key = key
          vm.handleData[vm.handleIndex].value = value
        }
        vm.addHandleCancle(name)
      },
      addHandleCancle: function(name){
        var vm = this
        vm.$refs[name].resetFields()
        vm.addHandleModal = false
        vm.handleAddEdit = true
        vm.handleIndex = null
      },
      editHandle: function(index){
        var vm = this
        vm.addHandleModal = true
        vm.addHandleDialog.key = vm.handleData[index].key
        vm.addHandleDialog.value = vm.handleData[index].value
        vm.handleAddEdit = false
        vm.handleIndex = index //编辑的索引
      },
      deleteHandle: function(index){
        var vm = this;
        vm.$Modal.confirm({
          type: 'confirm',
          title: '确认',
          content: '确认删除这条数据吗？',
          onOk: function () {
            vm.handleData.splice(index,1);
          }
        })
      },
      formatData: function(data,hasSpace){
        let vm = this
        if(typeof(hasSpace)=="undefinde")hasSpace = false
        var _data = vm.util.extend(data)
        if(_data.length==0)return "";
        var str = "";
        for(var i=0;i<_data.length;i++){
          if(i==_data.length-1){
            if(hasSpace){
              str += '"' + _data[i].key.trim() + '":"' + _data[i].value.trim() + '"';
            }else{
              str += '"' + _data[i].key.split(" ").join("").trim() + '":"' + _data[i].value.split(" ").join("").trim() + '"';    
            } 
          }else{
            if(hasSpace){
              str += '"' + _data[i].key.trim() + '":"' + _data[i].value.trim() + '",'; 
            }else{
              str += '"' + _data[i].key.split(" ").join("").trim() + '":"' + _data[i].value.split(" ").join("").trim() + '",';    
            }
          }
        }
        str = "{" + str + "}";
        return str;
      },
      initDialog (data) {},
      initData () {}
    },
    created () {},
    mounted () {},
    watch: {}
  }
</script>
