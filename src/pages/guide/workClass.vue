<template>
  <div class="work-class">
    办事分类
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
  import utils from '@/libs/utils.js'
  export default {
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        // 全局
        dialogShow: false,
        dialogSubmitLoading: false,
        label: {
          'edit': '编辑',
          'add': '新增'
        },
        currDialog: 'add',
        baseUrl: '',
        pager: {
          url: '',
          currPage: '',
          order: '',
          pagesize: '',
          sort: '',
          total: 100,
          data: [
            // 模拟数据
            {
              id: 123,
              className: '分类1',
              cityCode: 123456,
              classStatus: 1,
              classIcon: 'http://fanyi.bdstatic.com/static/translation/img/header/logo_cbfea26.png',
              classType: 0
            }
          ]
        },
        // 局部
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
                      this.getAddrByCityId(1)
                    }
                  }
                }, 'View'),
                create('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.getAddrByCityId(2)
                    }
                  }
                }, 'Delete')
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
        const vm = this
        vm.dialogShow = true
      },
      _resetSearch (name) {},
      searchAddrChange () {},
      addrChange () {},
      handleSuccess () {},
      handleFormatError () {},
      getAddrByCityId (cityId) {
        return '数据成功'
      },
      resetDialogForm (name) {
        const vm = this
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {
        const vm = this
        // 成功后重置表单
        vm.dialogShow = false
        vm.resetDialogForm(name)
      },
      // 全局
      pagingFiltData (obj) {
        for (let key in obj) {
          if (typeof obj[key] !== 'string') {
            continue
          }
          if (obj[key].trim() === '') {
            delete obj[key]
          }
        }
        delete obj.data
        return obj
      },
      paging (currPage) {
        const vm = this
        if (!isNaN(currPage)) {
          vm.pager.currPage = parseInt(currPage)
        }
        console.log(utils)
        // ss.ajax({
        //   type: ('type' in vm.pager) ? vm.pager.type : 'post',
        //   url: vm.baseUrl + vm.pager.url,
        //   data: vm.pagingFiltData(vm.pager),
        //   success: function (result) {
        //     var _result = result
        //     var _data = []
        //     var _res = {}
        //     if (typeof vm.pagerResult === 'function') {
        //       _result = vm.pagerResult(result)
        //     }
        //     _data = [].concat(_result.data)
        //     utils.extend(true, _res, vm.pager, _result)
        //     _res.data = _data
        //     vm.pager = _res
        //   }
        // })
      },
      initData () {}
    },
    watch: {
      'pager.currPage': function (val, oldVal) {
        console.log(val)
        this.paging()
      }
    },
    // 生命周期钩子函数VNode替换原始dom时触发，不是对象，切记
    mounted () {
      // console.log('原始DOM被VNode替换')
      this.initData()
      this.paging()
    }
  }
</script>

<style scoped>

</style>
