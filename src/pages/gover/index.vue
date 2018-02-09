<template>
  <div class="policy">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="标题" prop="title">
        <Input v-model="formSearch.title" placeholder="标题" size="small" style="width: 120px"></Input>
      </FormItem>
      <FormItem label="关联地区">
        <Cascader :data="derail_address_arr_ss" v-model="derail_address_obj_s" @on-change="searchAddrChange" filterable size="small" style="margin-top: 5px;"></Cascader>
      </FormItem>
      <FormItem label="状态" prop="status">
        <Select v-model="formSearch.status" placeholder="请选择" style="width: 80px;" size="small" clearable>
          <Option value="0">未发布</Option>
          <Option value="1">已发布</Option>
        </Select>
      </FormItem>
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="90">
        <Row>
          <Col span="12">
            <FormItem label="标题" prop="title">
              <Input v-model="formDialog.title" placeholder="请输入标题"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="所属地区" prop="aa">
              <Cascader :data="derail_address_arr" v-model="derail_address_obj_sub" @on-change="subAddrChange" filterable style="margin-top: 5px"></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="政务来源" prop="governmentSource">
              <Input v-model="formDialog.governmentSource" placeholder="请输入政务来源"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="来源Url" prop="sourceUrl">
              <Input v-model="formDialog.sourceUrl" placeholder="请输入来源Url"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="政务发布时间" prop="governmentDate">
              <Date-picker type="date" v-model="formDialog.governmentDate" :editable="false" placeholder="请选择日期"></Date-picker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="政务时间规则" prop="dateRule">
              <Input v-model="formDialog.dateRule" placeholder="请输入政务时间规则"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="图片" prop="images">
              <Row>
                <Col span="12">
                  <div style="width:130px;border:1px solid #eee;">
                    <img v-if="formDialog.image" style="max-width:100%;" :src="formDialog.image" />
                    <img v-else style="max-width:100%;" src="static/images/img-upload-default.png"/>
                  </div>
                </Col>
                <Col span="12" style="text-align:right;">
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
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="状态" prop="status">
              <Select v-model="formDialog.status" placeholder="请选择政务状态" clearable style="width: 150px;">
                <Option value="0">未发布</Option>
                <Option value="1">已发布</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="内容" prop="content">
              <Input v-model="formDialog.content" placeholder="富文本"></Input>
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
  import paging from '@/components/paging'
  export default {
    name: 'policy',
    components: {
      mainTable,
      paging
    },
    data: function () {
      return {
        url: {
          add: 'gover/add.do',
          edit: 'gover/edit.do',
          delete: 'gover/delete.do'
        },
        pager: {
          url: 'gover/dataGrid.do'
        },
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        derail_address_arr: [],
        derail_address_obj_sub: [],
        derail_address_obj_s: [],
        derail_address_arr_ss: [],
        formSearch: {
          title: '',
          status: '',
          areaId: ''
        },
        formDialog: {
          id: '0',
          title: '',
          provinceId: '',
          cityId: '',
          areaId: '',
          image: '',
          content: '',
          governmentSource: '',
          sourceUrl: '',
          governmentDate: '',
          dateRule: '',
          status: ''
        },
        columns: [
          {
            type: 'selection',
            width: 80,
            align: 'center',
            fixed: 'left'
          }, {
            title: '标题',
            key: 'title',
            width: 200,
            sortable: true
          }, {
            title: '图片',
            key: 'image',
            width: 120,
            render: function (create, params) {
              if (params.row.image == '' || params.row.image == 'null') {
                return create('span', '暂无图片')
              } else {
                return create('img', {
                  style: {
                    maxWidth: '100px',
                    margin: '10px'
                  },
                  attrs: {
                    src: params.row.image
                  }
                })
              }
            }
          },
          {
            title: '来源地址',
            key: 'sourceUrl',
            width: 250,
            render: (create, params) => {
              var vm = this
              return create('a', {
                style: {},
                attrs: {
                  href: params.row.sourceUrl,
                  target: '_blank'
                }
              }, params.row.sourceUrl)
            }
          }, {
            title: '所属省',
            key: 'provinceId',
            width: 180,
            sortable: true,
            render: (create, params) => {
              var vm = this
              var txt = ''
              var addrArr = [params.row.provinceId]
              txt = vm.getProvinceCityArea(addrArr, vm.derail_address_arr)
              return create('span', txt)
            }
          }, {
            title: '所属市',
            key: 'cityId',
            width: 180,
            sortable: true,
            render: (create, params) => {
              var vm = this
              var txt = ''
              var addrArr = [params.row.provinceId, params.row.cityId]
              txt = vm.getProvinceCityArea(addrArr, vm.derail_address_arr)
              return create('span', txt)
            }
          }, {
            title: '所属区',
            key: 'areaId',
            width: 180,
            sortable: true,
            render: (create, params) => {
              var vm = this
              var txt = ''
              var addrArr = [params.row.provinceId, params.row.cityId, params.row.areaId]
              txt = vm.getProvinceCityArea(addrArr, vm.derail_address_arr)
              return create('span', txt)
            }
          }, {
            title: '政策来源',
            key: 'policySoucre',
            width: 120,
            sortable: true
          }, {
            title: '政策时间',
            key: 'policyDate',
            width: 180,
            sortable: true
          }, {
            title: '创建时间',
            key: 'createTime',
            width: 180,
            sortable: true
          }, {
            title: '时间规则',
            key: 'dateRule',
            width: 140,
            sortable: true
          }, {
            title: '状态',
            key: 'status',
            width: 80,
            render: function (create, params) {
              var map = {
                0: '未发布',
                1: '已发布'
              }
              return create('span', map[params.row.status])
            }
          }, {
            title: '操作',
            key: 'action',
            width: 200,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              var vm = this
              return create('div', [
                create('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: function () {
                      console.log('预览')
                    }
                  }
                }, '预览'),
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
    methods: {
      addRow () {
        this.$store.commit('addRow', this)
      },
      resetDialogForm (name) {
        let vm = this
        vm.formDialog.id = '0'
        vm.formDialog.image = ''
        vm.$refs[name].resetFields()
      },
      getProvinceCityArea () {},
      searchAddrChange () {},
      subAddrChange () {},
      handleSuccess () {},
      handleFormatError () {},
      initDialog (data) {},
      changePager (data) {
        this.util.changePager(this, data)
      },
      paging () {
        this.util.paging(this)
      },
      initData () {}
    },
    computed: {
      label () {
        return this.$store.state.label
      }
    },
    created () {
      let vm = this
      vm.initData()
      vm.$store.commit('initPager', vm)
      vm.paging(vm)
    },
    mounted () {
      
    },
    watch: {}
  }
</script>

<style scoped>

</style>
