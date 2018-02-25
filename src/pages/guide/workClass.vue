<template>
  <div class="work-class">
    <Form :model="formSearch" ref="formSearch" :rules="searchRules" inline :label-width="60">
        <FormItem label="分类名称" prop="className">
            <Input v-model="formSearch.className" placeholder="分类名称" size="small" style="width: 120px"></Input>
        </FormItem>
        <FormItem label="关联地区">
            <Cascader :data="provinceCityData" v-model="derail_address_obj_s" @on-change="searchAddrChange" filterable size="small" style="margin-top: 5px;"></Cascader>
        </FormItem>
        <FormItem label="状态" prop="classStatus">
            <Select v-model="formSearch.classStatus" placeholder="请选择" style="width: 80px;" size="small" clearable>
                <Option value="0">无效</Option>
                <Option value="1">有效</Option>
            </Select>
        </FormItem>
        <FormItem label="分类类别" prop="classType">
            <Select v-model="formSearch.classType" size="small" style="width: 80px;">
              <Option value="0">个人</Option>
              <Option value="1">企业</Option>
            </Select>
        </FormItem>
        <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <!-- 弹出框 -->
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="分类名称" prop="className">
              <Input v-model="formDialog.className" placeholder="请输入分类名称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="分类类别" prop="classType">
              <Select v-model="formDialog.classType">
                <Option value="0">个人</Option>
                <Option value="1">企业</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="关联区域" prop="area">
              <Cascader :data="provinceCityData" v-model="provinceCity" filterable @on-change="addrChange"></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="分类状态" prop="classStatus">
              <Select v-model="formDialog.classStatus" placeholder="请选择状态">
                <Option value="0">无效</Option>
                <Option value="1">有效</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="分类图标" prop="classIcon">
              <div style="width:140px;">
                <img v-if="formDialog.classIcon" style="max-width:100%;" :src="formDialog.classIcon" />
                <img v-else style="max-width:100%;" src="static/images/img-upload-default.png"/>
              </div>
            </FormItem>
          </Col>
          <Col span="12">    
            <Upload name="upfile"
                    action="ueditor/upload.do"
                    :on-success="handleSuccess"
                    :show-upload-list="false"
                    :format="['jpg','jpeg','png']"
                    :on-format-error="handleFormatError">
              <Button type="ghost" icon="ios-cloud-upload-outline">{{label.uploadImg}}</Button>
            </Upload>
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
  import util from '@/libs/util'
  export default {
    name: 'workClass',
    components: {
      mainTable
    },
    data: function () {
      return {
        url: {
          add: 'workClass/add.do',
          edit: 'workClass/edit.do',
          delete: 'workClass/delete.do'
        },
        pager: {
          url: 'workClass/dataGrid.do'
        },
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        derail_address_obj_s: [],
        provinceCityData: [],
        provinceCity: [],
        formSearch: {
          input: '',
          className: '',
          classStatus: '',
          classType: '',
          cityCode: ''
        },
        formDialog: {
          id: '',
          className: '',
          classIcon: '',
          classType: '',
          cityCode: '',
          classStatus: '1'
        },
        columns: [
          {
            title: '编号',
            key: 'id',
            fixed: 'left',
            width: 200
          },
          {
            title: '分类名称',
            key: 'className'
          },
          {
            title: '关联区域',
            key: 'cityCode',
            render: (create, params) => {
              var txt = '无cityCode'
              if (params.row.cityCode) {
                txt = this.getAddrByCityId(params.row.cityCode)
              }
              return create('span', txt)
            }
          },
          {
            title: '分类状态',
            key: 'classStatus',
            render: function (create, params) {
              var map = {
                '0': '无效',
                '1': '有效'
              }
              return create('span', map[params.row.classStatus])
            }
          },
          {
            title: '分类图标',
            key: 'classIcon',
            render: function (create, params) {
              if (params.row.classIcon) {
                return create('img', {
                  style: {
                    margin: '5px 0',
                    maxWidth: '100%',
                    maxHeight: '100%'
                  },
                  attrs: {
                    src: params.row.classIcon
                  }
                })
              } else {
                return create('span', '暂无图标')
              }
            }
          },
          {
            title: '分类类型',
            key: 'classType',
            render: function (create, params) {
              var map = {
                '0': '个人',
                '1': '企业'
              }
              return create('span', map[params.row.classType])
            }
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
                create('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
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
                      this.$store.dispatch('delRow', {
                        'vm': this,
                        'params': params
                      })
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        rules: {
          className: [
            {required: true, message: '请填写分类名称', trigger: 'blur'}
          ],
          classType: [
            {required: true, message: '分类类别不能为空', trigger: 'change'}
          ]
        },
        searchRules: {}
      }
    },
    methods: {
      addRow () {
        this.$store.commit('addRow', this)
      },
      initDialog (data) {
        let _data = util.extend(data)
        this.formDialog.cityCode = _data.cityCode
        this.provinceCity = [_data.cityCode.toString().slice(0, 2) + '0000', _data.cityCode.toString().slice(0, 4) + '00', _data.cityCode.toString()]
        this.formDialog.classStatus = _data.classStatus
      },
      resetSearch (name) {
        let vm = this
        vm.derail_address_obj_s = []
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
      },
      submitSearch (name) {
        let vm = this
        vm.$store.dispatch('submitSearch', {
          'vm': vm,
          'name': name
        })
      },
      resetDialogForm (name) {
        this.provinceCity = []
        this.$refs[name].resetFields()
      },
      searchAddrChange () {},
      addrChange () {},
      handleSuccess () {},
      handleFormatError () {},
      getAddrByCityId (cityId) {
        return cityId
      },
      paging () {
        this.util.paging(this)
      },
      initData () {
        let vm = this
      }
    },
    // 计算属性
    computed: {
      label () {
        return this.$store.state.label
      }
    },
    watch: {},
    created () {
      let vm = this
      vm.initData()
      vm.$store.commit('initPager', vm)
      vm.paging(vm)
    },
    // 生命周期钩子函数VNode替换原始dom时触发，钩子函数函数
    mounted () {
      
    }
  }
</script>

<style scoped>

</style>
