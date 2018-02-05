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
    <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable>
    <paging :total="pager.total"></paging>
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
              <Input v-model="formDialog.apiName" placeholder="请输入接口名称" :disabled="onOffDisabled"></Input>
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
          <Col span="12" v-show="showApiIcon">
            <FormItem label="工具图标" prop="apiIcon">
              <Upload name=""
                      action=""
                      :on-success="uploadSuccess"
                      :show-upload-list="false">
                <Button type="primary" size="small">工具图标</Button>
              </Upload>
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
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">
          {{label.submit}}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  export default {
    name: 'thirdpartySetting',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        url: {
          add: 'thirdpartySetting/add.do',
          edit: 'thirdpartySetting/edit.do',
          delete: 'thirdpartySetting/delete.do',
          paging: 'thirdpartySetting/dataGrid.do',
          debugger: 'thirdpartySetting/debug.do'
        },
        currDialog: 'edit',
        dialogShow: false,
        dialogSubmitLoading: false,
        data: [
          {
            id: '213213213',
            thirdpartyClassid: 'asdsadasd',
            thirdpartyType: '2',
            apiName: 'sdfsdaf',
            apiUrl: 'sdfdsag',
            apiIcon: 'dfgdfg',
            apiDesc: 'dfgdsfg',
            apiKey: 'dfgdfgfdg',
            apiSecret: 'dfgdfg',
            apiCode: 'dfgfdg',
            apiStatus: '1'
          }
        ],
        showApiIcon: false,
        isComm: false,
        onOffDisabled: false,
        thirdpartyClassidMap: {},
        thirdpartyClassid: [],
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
              return create('Button', {
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
              }, '编辑')
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
      pager () {
        return this.$store.state.pager
      }
    },
    methods: {
      addRow () {
        this.$store.commit('addRow', this)
      },
      debugging () {
        this.debuggerDialogShow = true
      },
      resetDialogForm (name) {
        let vm = this
        vm.formDialog.id = '0'
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {},
      uploadSuccess () {},
      resetSearch (name) {
        var vm = this
        vm.$refs[name].resetFields()
      },
      submitSearch (name) {
        console.log('搜索')
      },
      initDialog (data) {}
    },
    mounted () {
      this.$store.state.pager.data = this.data
    }
  }
</script>

<style scoped>

</style>
