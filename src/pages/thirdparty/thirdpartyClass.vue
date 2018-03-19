<template>
  <div class="thirdparty-class">
    <Form inline>
      <FormItem>
        <Button type="primary" @click="addRow" size="small">{{label.add}}</Button>
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
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import page from '@/mixins/page'
  export default {
    name: 'thirdpartyClass',
    components: {
      mainTable
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'thirdpartyClass/add.do',
          edit: 'thirdpartyClass/edit.do',
          delete: 'thirdpartyClass/delete.do'
        },
        pager: {
          data: [
            {
              id: '948818526680346624',
              name: '阿里云-云市场',
              thirdpartyKey: '24697083',
              thirdpartySecret: '006d099557db912ee6bb9d8030829868',
              orgName: '',
              thirdpartyUser: '深圳市众善行',
              thirdpartyPass: 'zsx88888888',
              thirdpartyCode: '1c334e54b3974fe681125643fe20e3cf',
              appName: '',
              isComm: '0'
            }, {
              id: '948818816473198592',
              name: '环信',
              thirdpartyKey: '1101180104178346#qq',
              thirdpartySecret: 'YXA6Pv54YoCXalATvmLDn3bWYwRuNtY',
              orgName: '1101180104178346',
              thirdpartyUser: 'xiayang730@sohu.com',
              thirdpartyPass: '3431265',
              thirdpartyCode: 'YXA67-NfUPD8EeeZNs-bqOrVXQ',
              appName: 'qq',
              isComm: '1'
            }
          ],
          url: 'thirdpartyClass/dataGrid.do'
        },
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
                vm.createEditBtn(create, params.row),
                vm.createDelBtn(create, params.row.id)
              ])
            }
          }
        ],
        rules: {}
      }
    },
    computed: {},
    methods: {
      resetDialogForm (name) {
        let vm = this
        vm.$refs[name].resetFields()
      },
      initDialog (data) {},
      initData () {}
    },
    created () {},
    mounted () {},
    watch: {}
  }
</script>

<style scoped>

</style>
