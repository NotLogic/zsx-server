<template>
  <div class="work-class">
    <Form inline>
      <FormItem>
        <Button type="primary" @click="addRow" size="small">添加</Button>
      </FormItem>
    </Form>
    <Form :model="formSearch" ref="formSearch" :rules="rules" inline :label-width="80">
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
        <Button type="primary" style="margin-top: 5px;" @click="submitSearch('formSearch')" size="small">查找</Button>
        <Button type="ghost" style="margin-left: 8px;margin-top: 5px;" @click="resetSearch('formSearch')" size="small">清空</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging :total="pager.total"></paging>
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
              <Upload name="upfile"
                      action="ueditor/upload.do"
                      :on-success="handleSuccess"
                      :show-upload-list="false"
                      :format="['jpg','jpeg','png']"
                      :on-format-error="handleFormatError">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传文件</Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">清空</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  // import util from '@/libs/util'
  export default {
    name: 'workClass',
    components: {
      mainTable,
      paging
    },
    data: function () {
      return {
        dialogShow: false,
        dialogSubmitLoading: false,
        derail_address_obj_s: [],
        provinceCityData: [
          {
            label: '北京',
            value: '110000',
            children: [
              {
                label: '东区',
                value: '111100',
                children: [
                  {
                    label: '东门',
                    value: '111111'
                  }, {
                    label: '西门',
                    value: '111112'
                  }
                ]
              }, {
                label: '西区',
                value: '111200',
                children: [
                  {
                    label: '南门',
                    value: '111113'
                  }, {
                    label: '北门',
                    value: '111114'
                  }
                ]
              }
            ]
          }, {
            label: '河南',
            value: '220000',
            children: [
              {
                label: '郑州',
                value: '221100',
                children: [
                  {
                    label: '这区',
                    value: '221111'
                  }, {
                    label: '那区',
                    value: '221112'
                  }
                ]
              }, {
                label: '许昌',
                value: '221200',
                children: [
                  {
                    label: '许昌县',
                    value: '221211'
                  }, {
                    label: '襄城县',
                    value: '221212'
                  }
                ]
              }
            ]
          }
        ],
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
            fixed: 'left'
          },
          {
            title: '分类名称',
            key: 'className'
          },
          {
            title: '关联区域',
            key: 'cityCode',
            render: (create, params) => {
              var txt = this.getAddrByCityId(params.row.cityCode)
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
              if (params.row.classIcon === '' || params.row.classIcon === 'null') {
                return create('span', '暂无图标')
              } else {
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
                      this.$store.commit('editRow', {
                        'vm': this,
                        'params': params,
                        'initDialog': this.initDialog(params.row)
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
                        'create': create,
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
        }
      }
    },
    methods: {
      addRow () {
        this.$store.commit('addRow', this)
      },
      initDialog (data) {
        this.formDialog.cityCode = data.cityCode
        this.provinceCity = [data.cityCode.toString().slice(0, 2) + '0000', data.cityCode.toString().slice(0, 4) + '00', data.cityCode.toString()]
        this.formDialog.classStatus = data.classStatus
      },
      resetSearch (name) {
        // 重置一些this.$refs[name].resetFields()无法重置的内容
        // vm.$store.commit('reserForm', name)
        this.derail_address_obj_s = []
        this.$refs[name].resetFields()
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
        return '数据成功'
      },
      initData () {}
    },
    // 计算属性
    computed: {
      pager () {
        return this.$store.state.pager
      },
      label () {
        return this.$store.state.label
      },
      currDialog () {
        return this.$store.state.currDialog
      }
    },
    watch: {},
    // 生命周期钩子函数VNode替换原始dom时触发，不是对象，切记
    mounted () {
      // console.log('原始DOM被VNode替换')
      this.initData()
    }
  }
</script>

<style scoped>

</style>
