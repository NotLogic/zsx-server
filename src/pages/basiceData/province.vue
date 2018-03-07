<template>
  <div class="province">
    <div style="padding: 10px 0">
      <Button type="primary" size="small" style="margin-right: 10px;" @click="addRow('province')">{{label.add}}</Button>
      <Button type="primary" size="small" @click="checkData">校验所有数据</Button>
    </div>
    <!-- <main-table :columns="provinceColumns" :data="provinceData" :height="685"></main-table> -->
    <main-table :columns="provinceColumns" :data="provinceData"></main-table>

    <!-- 市弹窗 -->
    <Modal v-model="cityDialogShow" title="市" :mask-closable="false" width="750">
      <div style="margin-bottom: 10px;">
        <Button type="primary" @click="addRow('city')" size="small">{{label.add}}</Button>
      </div>
      <!-- <main-table :columns="cityColumns" :data="cityData" :height="500" :size="'small'"></main-table> -->
      <main-table :columns="cityColumns" :data="cityData" :size="'small'"></main-table>
      <div slot="footer">
        <Button type="primary" @click="closeModal('cityDialogShow')">{{label.sure}}</Button>
      </div>
    </Modal>

    <!-- 区弹窗 -->
    <Modal v-model="areaDialogShow" title="区" :mask-closable="false" width="750">
      <div style="margin-bottom: 10px;">
        <Button type="primary" @click="addRow('area')" :size="'small'">{{label.add}}</Button>
      </div>
      <!-- <main-table :columns="areaColumns" :data="areaData" size="small" :height="500"></main-table> -->
      <main-table :columns="areaColumns" :data="areaData" size="small"></main-table>
      <div slot="footer">
        <Button type="primary" @click="closeModal('areaDialogShow')">{{label.sure}}</Button>
      </div>
    </Modal>

    <!-- 添加/编辑 弹窗 -->
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem v-if="choice == 'province'" :key="choice" label="省份名称" prop="provinceName">
              <Input v-model="formDialog.provinceName" placeholder="请输入省份名称"></Input>
            </FormItem>
            <FormItem v-if="choice == 'city'" :key="choice" label="市名称" prop="cityName">
              <Input v-model="formDialog.cityName" placeholder="请输入市名称"></Input>
            </FormItem>
            <FormItem v-if="choice == 'area'" :key="choice" label="区名称" prop="areaName">
              <Input v-model="formDialog.areaName" placeholder="请输入区名称"></Input>
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
  import util from '@/libs/util'
  import mainTable from '@/components/mainTable'
  import axios from 'axios'
  export default {
    name: 'province',
    components: {
      mainTable
    },
    data () {
      return {
        url: {
          add: 'province/add.do',
          edit: 'province/edit.do',
          delete: 'province/delete.do',
        },
        currDialog: 'edit',
        dialogShow: false,
        cityDialogShow: false,
        areaDialogShow: false,
        dialogSubmitLoading: false,
        editInd: 0,
        formDialog: {
          id: '',
          provinceName: '',
          cityName: '',
          areaName: ''
        },
        choice: '',
        chinaJson: {},
        chinaData: [],
        provinceData: [],
        cityData: [],
        areaData: [],
        provinceColumns: [
          {
            title: '省code',
            key: 'id',
            width: 200,
            fixed: 'left'
          }, {
            title: '省份',
            key: 'provinceName',
            render: (create, params) => {
              let vm = this
              return create('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: function () {
                    vm.showCity(params.row.id)
                  }
                }
              }, params.row.provinceName)
            }
          }, {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this
              return create('div', [
                (function (vm, create, params) {
                  return create('Button', {
                    props: { type: 'primary', size: 'small' },
                    style: { marginRight: '5px' },
                    on: {
                      click: function () {
                        // vm.checkCity(params)
                      }
                    }
                  }, '校验')
                })(vm, create, params),
                (function (vm, create, params) {
                  return create('Button', {
                    props: { type: 'primary', size: 'small' },
                    style: { marginRight: '5px' },
                    on: {
                      click: function () {
                        vm.editRow(params.row, 'province')
                      }
                    }
                  }, vm.label.edit)
                })(vm, create, params),
                (function (vm, create, params) {
                  return create('Button', {
                    props: { type: 'error', size: 'small' },
                    on: {
                      click: function () {
                        // vm.deleteRow(params.index, params.row.id, '100000', 'province')
                      }
                    }
                  }, vm.label.delete)
                })(vm, create, params)
              ])
            }
          }
        ],
        cityColumns: [
          {
            title: '市code',
            key: 'id',
            width: 200,
            fixed: 'left'
          }, {
            title: '市',
            key: 'cityName',
            render: (create, params) => {
              let vm = this
              return create('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: function () {
                    vm.showArea(params.row.id)
                  }
                }
              }, params.row.cityName)
            }
          }, {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this
              return create('div', [
                (function (vm, create, params) {
                  return create('Button', {
                    props: { type: 'primary', size: 'small' },
                    style: { marginRight: '5px' },
                    on: {
                      click: function () {
                        // vm.checkCity(params)
                      }
                    }
                  }, '校验')
                })(vm, create, params),
                (function (vm, create, params) {
                  return create('Button', {
                    props: { type: 'primary', size: 'small' },
                    style: { marginRight: '5px' },
                    on: {
                      click: function () {
                        vm.editRow(params.row, 'city')
                      }
                    }
                  }, vm.label.edit)
                })(vm, create, params),
                (function (vm, create, params) {
                  return create('Button', {
                    props: { type: 'error', size: 'small' },
                    on: {
                      click: function () {
                        // vm.deleteRow(params.index, params.row.id, '100000', 'province')
                      }
                    }
                  }, vm.label.delete)
                })(vm, create, params)
              ])
            }
          }
        ],
        areaColumns: [
          {
            title: '区code',
            key: 'id',
            width: 200,
            fixed: 'left'
          }, {
            title: '区',
            key: 'areaName'
          }, {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this
              return create('div', [
                create('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: function () {
                      // vm.checkCity(params)
                    }
                  }
                }, '校验'),
                create('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: function () {
                      vm.editRow(params.row, 'area')
                    }
                  }
                }, vm.label.edit),
                create('Button', {
                  props: { type: 'error', size: 'small' },
                  on: {
                    click: function () {
                      // vm.deleteRow(params.index, params.row.id, '100000', 'province')
                    }
                  }
                }, vm.label.delete)
              ])
            }
          }
        ],
        rules: {
          provinceName: [{ required: true, message: '省份名称不能为空', trigger: 'blur' }],
          cityName: [{ required: true, message: '省份名称不能为空', trigger: 'blur' }],
          areaName: [{ required: true, message: '省份名称不能为空', trigger: 'blur' }]
        }
      }
    },
    computed: {
      label () {
        return this.$store.state.label
      }
    },
    methods: {
      closeModal (name) {
        this[name] = false
      },
      editRow (data, choice) {
        let vm = this
        let _data = vm.util.extend(data)
        vm.choice = choice
        vm.editInd = _data["_index"]
        vm.currDialog = 'edit'
        for (let key in vm.formDialog) {
          if (typeof(_data[key]) != 'undefined') {
            vm.formDialog[key] = _data[key]
          }
        }
        vm.dialogShow = true
      },
      showCity (provinceId) {
        var vm = this
        vm.choice = 'city'
        vm.cityData = vm.getCityData(provinceId)
        vm.cityDialogShow = true
      },
      showArea (cityId) {
        var vm = this
        vm.choice = 'area'
        vm.areaData = vm.getAreaData(cityId)
        vm.areaDialogShow = true
      },
      getCityData (provinceId) {
        var vm = this
        var data = util.extend(vm.chinaJson[provinceId])
        var dataArr = []
        for (let key in data) {
          dataArr.push({
            'id': key,
            'cityName': data[key]
          })
        }
        return dataArr
      },
      getAreaData (cityId) {
        var vm = this
        var data = util.extend(vm.chinaJson[cityId])
        var dataArr = []
        for (let key in data) {
          dataArr.push({
            'id': key,
            'areaName': data[key]
          })
        }
        return dataArr
      },
      resetDialogForm (name) {
        var vm = this
        // if (vm.formDialog.provinceName) vm.formDialog.provinceName = ''
        // if (vm.formDialog.cityName) vm.formDialog.cityName = ''
        // if (vm.formDialog.areaName) vm.formDialog.areaName = ''
        vm.formDialog.provinceName = ''
        vm.formDialog.cityName = ''
        vm.formDialog.areaName = ''
        // vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {
        this.util.submitDialogForm(this, name)
      },
      addRow (choice) {
        let vm = this
        vm.choice = choice
        vm.$store.commit('addRow', vm)
      },
      // 校验所有数据
      checkData () {},
      initPostDialog (data) {
        let _data = this.util.extend(data)
        for (let key in _data) {
          if (!_data[key]) {
            delete _data[key]
          }
        }
        return _data
      }
    },
    mounted () {
      let vm = this
      vm.$http.get('/static/data/address.json').then(res => {
        vm.chinaJson = util.extend(res.data)
        vm.chinaData = util.getChinaDataByJson(util.extend(res.data))
        let provinceData = []
        util.extend(vm.chinaData).forEach(item => {
          provinceData.push({
            'id': item.value,
            'provinceName': item.label
          })
        })
        vm.provinceData = provinceData
      })
      // 为什么全局的axios不行， vm.$http.all   not a function
      // vm.$http.all([vm.$http.get('/static/data/address.json'), vm.$http.get('/static/data/accessData.json')]).then(vm.$http.spread(function(acct, perms){
      // axios.all([vm.$http.get('/static/data/address.json'), vm.$http.get('/static/data/accessData.json')]).then(axios.spread(function(res1, res2){
      //   console.log('res1: ', res1)
      //   console.log('res2: ', res2)
      // }))
    },
    watch: {
      'dialogShow': function(val,oldVal){
            if(!val){
              this.currDialog = 'add'
              this.editInd = 0
            }
        }
    }
  }
</script>

<style scoped>

</style>
