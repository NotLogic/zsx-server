<template>
  <div class="thirdparty-class">
    <Form inline>
      <FormItem>
        <Button type="primary" @click="addRow" size="small">添加</Button>
      </FormItem>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="90">
        <Row>
          <Col span="12">
            <FormItem label="分类名称" prop="name">
              <Input v-model="formDialog.name" placeholder="请输入分类名称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="第三方秘钥" prop="thirdpartyKey">
              <Input v-model="formDialog.thirdpartyKey" placeholder="请输入第三方秘钥"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="第三方秘串" prop="thirdpartySecret">
              <Input v-model="formDialog.thirdpartySecret" placeholder="请输入第三方秘串"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="第三方编码" prop="thirdpartyCode">
              <Input v-model="formDialog.thirdpartyCode" placeholder="请输入第三方编码"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="第三方账号" prop="thirdpartyUser">
              <Input v-model="formDialog.thirdpartyUser" placeholder="请输入第三方账号"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="第三方密码" prop="thirdpartyPass">
              <Input v-model="formDialog.thirdpartyPass" placeholder="请输入第三方密码"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="企业名称" prop="orgName">
              <Input v-model="formDialog.orgName" placeholder="请输入企业名称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="应用名称" prop="appName">
              <Input v-model="formDialog.appName" placeholder="请输入应用名称"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="是否共用配置" prop="isComm">
              <Select v-model="formDialog.isComm" placeholder="请选择是否共用配置" style="width: 140px;">
                <Option value="0">否</Option>
                <Option value="1">是</Option>
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
  export default {
    name: 'thirdpartyClass',
    components: {
      mainTable
    },
    data () {
      return {
        currDialog: 'edit',
        dialogShow: false,
        dialogSubmitLoading: false,
        data: [
          {
            id: '213',
            name: 'ghjk',
            thirdpartyKey: 'fgh',
            thirdpartySecret: 'xcv',
            thirdpartyCode: 'sdfsdf',
            thirdpartyUser: '123w',
            thirdpartyPass: '123',
            orgName: '213',
            appName: 'asd',
            isComm: '1'
          }
        ],
        formDialog: {
          id: '',
          name: '',
          thirdpartyKey: '',
          thirdpartySecret: '',
          orgName: '',
          thirdpartyUser: '',
          thirdpartyPass: '',
          thirdpartyCode: '',
          appName: '',
          isComm: '0'
        },
        columns: [
          {
            title: '分类id',
            key: 'id',
            width: 200,
            fixed: 'left'
          }, {
            title: '分类名称',
            key: 'name',
            width: 160
          }, {
            title: '第三方秘钥',
            key: 'thirdpartyKey',
            width: 250
          }, {
            title: '第三方秘串',
            key: 'thirdpartySecret',
            width: 300
          }, {
            title: '第三方编码',
            key: 'thirdpartyCode',
            width: 250
          }, {
            title: '第三方账号',
            key: 'thirdpartyUser',
            width: 200
          }, {
            title: '第三方密码',
            key: 'thirdpartyPass',
            width: 200
          }, {
            title: '企业名称',
            key: 'orgName',
            width: 180
          }, {
            title: '应用名称',
            key: 'appName',
            width: 150
          }, {
            title: '是否共用配置',
            key: 'isComm',
            width: 120,
            render: function (create, params) {
              var map = {
                '0': '否',
                '1': '是'
              }
              return create('span', map[params.row.isComm])
            }
          }, {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 200,
            render: (create, params) => {
              var vm = this
              return create('div', [
                create('Button', {
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
                }, '编辑'),
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
      resetDialogForm (name) {
        let vm = this
        vm.formDialog.id = '0'
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {},
      initDialog (data) {}
    },
    mounted () {
      this.$store.state.pager.data = this.data
    }
  }
</script>

<style scoped>

</style>
