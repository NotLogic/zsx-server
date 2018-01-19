<template>
  <div class="work-matter">
    办事事项
    <Form inline>
      <Button type="primary" @click="addRow" size="small">添加</Button>
    </Form>
    <Form ref="formSearch" inline :label-width="80">
        <FormItem label="分类名称" prop="searchClassName">
            <Input v-model="formSearch.className" placeholder="分类名称" size="small" style="width: 120px"></Input>
        </FormItem>
        <FormItem label="关联地区">
            <Cascader :data="provinceCityData" v-model="derail_address_obj_s" @on-change="searchAddrChange" filterable size="small" style="margin-top: 5px;"></Cascader>
        </FormItem>
        <FormItem label="状态" prop="searchClassStatus">
            <Select v-model="formSearch.classStatus" placeholder="请选择" style="width: 80px;" size="small" clearable>
                <Option value="0">无效</Option>
                <Option value="1">有效</Option>
            </Select>
        </FormItem>
        <FormItem label="分类类别" prop="SearchClassType">
            <Select v-model="formSearch.classType" size="small" style="width: 80px;">
              <Option value="0">个人</Option>
              <Option value="1">企业</Option>
            </Select>
        </FormItem>
        <Button type="primary" style="margin-top: 5px;" @click="submitSearch('formSearch')" size="small">查找</Button>
        <Button type="ghost" style="margin-left: 8px;margin-top: 5px;" @click="_resetSearch('formSearch')" size="small">清空</Button>
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
                      :on-format-error="handleFormatError"
                      :max-size="2048">
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
    components: {
      mainTable,
      paging
    },
    data () {
      return {
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
            width: 200,
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
                    maxWidth: '100px',
                    maxHeight: '100px'
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
                      // this.$store.commit('editRow', {
                      //   'vm': this,
                      //   'create': create,
                      //   'params': params
                      // })
                      var vm = this
                      vm.$store.dialogShow = true
                      vm.$store.currDialog = 'edit'
                      // var _formDialog = $.extend({}, this.pager.data[index])
                      // if (typeof(initDialogData) != 'undefined') {
                      //     _formDialog = initDialogData
                      // }
                      // $.each(_formDialog, function (key, val) {
                      //     if (typeof(vm.formDialog[key]) == 'undefined') {
                      //         delete _formDialog[key];
                      //     }
                      //     if (util.isNumber(val)) {
                      //         _formDialog[key] = String(val);
                      //     }
                      // })
                      // this.formDialog = _formDialog;
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
            { required: true, message: '请填写分类名称', trigger: 'blur' }
          ],
          classType: [
            { required: true, message: '分类类别不能为空', trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      addRow () {
        this.$store.commit('addRow')
      },
      initDialog (data) {
        console.log(data)
      },
      _resetSearch (name) {
        var vm = this
        // 重置一些this.$refs[name].resetFields()无法重置的内容
        // vm.$store.commit('reserForm', name)
        vm.$refs[name].resetFields()
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
      dialogShow () {
        return this.$store.state.dialogShow
      },
      dialogSubmitLoading () {
        return this.$store.state.dialogSubmitLoading
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
