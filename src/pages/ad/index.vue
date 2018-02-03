<template>
  <div class="ad">
    <!-- 高级搜索 -->
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="关键字" prop="title">
        <Input v-model="formSearch.title" placeholder="标题" size="small"></Input>
      </FormItem>
      <FormItem label="广告位置" prop="postion">
        <Select v-model="formSearch.postion" placeholder="请选择" size="small" clearable style="width:150px;">
          <Option v-for="item in adPostionData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="广告状态" prop="lockStatus">
        <Select v-model="formSearch.lockStatus" placeholder="请选择" size="small" clearable style="width: 80px;">
          <Option value="1">正常</Option>
          <Option value="2">禁用</Option>
          <Option value="3">过时</Option>
        </Select>
      </FormItem>
      <FormItem label="投放级别" prop="areaType">
        <Select v-model="formSearch.areaType" placeholder="请选择" size="small" @on-change="areaTypeChange_s">
          <Option value="0">全部</Option>
          <Option value="4">区级</Option>
          <Option value="3">市级</Option>
          <Option value="2">省级</Option>
          <Option value="1">全国</Option>
        </Select>
      </FormItem>
      <FormItem label="关联地区" prop="source">
        <Cascader :data="derail_address_arr_s" v-model="derail_address_obj_s" :filterable="true" size="small"
                  style="margin-top: 5px"></Cascader>
      </FormItem>
      <FormItem label="展示时间">
        <FormItem prop="startTime">
          <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.startTime" size="small"
                       :clearable="false"></DatePicker>
        </FormItem>
        <FormItem>至</FormItem>
        <FormItem prop="endTime">
          <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.endTime" size="small"
                       :clearable="false"></DatePicker>
        </FormItem>
      </FormItem>
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable>
    <!-- 分页 -->
    <paging></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="24">
            <FormItem label="标题" prop="title">
              <Input v-model="formDialog.title" placeholder="请输入标题"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="广告内容" prop="context">
              <Input v-model="formDialog.context" placeholder="请输入广告内容"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <Col span="12">
              <FormItem label="主图" prop="imagePath">
                <div class="image_upload_list" style="width:100px;height:100px;">
                  <img v-if="formDialog.imagePath!=null && formDialog.imagePath!=''" :src="formDialog.imagePath"/>
                  <img v-else src="static/images/img-upload-default.png" style="max-width: 100%;max-height:100%;"/>
                </div>
              </FormItem>
            </Col>
          </Col>
          <Col span="12">
            <FormItem>
              <Upload  name="upfile"
                       action="ueditor/upload.do"
                       :show-upload-list="false"
                       :on-success="handleSuccess">
                <Button type="ghost" icon="ios-cloud-upload-outline">上传</Button>
              </Upload>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="链接地址" prop="href">
              <Input type="url" v-model="formDialog.href" placeholder="请输入链接地址">
              </Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="广告位置" prop="postion">
              <Select v-model="formDialog.postion" placeholder="请选择"  clearable @on-change="postionChange">
                <Option v-for="item in adPostionData" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="排序" prop="sort" inline>
              <InputNumber :max="10" :min="1" v-model="formDialog.sort"
                            :disabled="formDialog.sort==1&&formDialog.isUp==2"></InputNumber>
              <Button type="default" v-if="formDialog.sort==1"
                        @click="formDialog.isUp = formDialog.isUp==1 ?2:1">{{formDialog.isUp==1 ? '置顶' :
                '取消置顶'}}
              </Button>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="">
              <span v-if="true" style="font-size: 80%;color: #ff4d44;padding-left: 3px">
                数值越小优先级越高
              </span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="开始时间" prop="startTime">
              <DatePicker type="date" placeholder="点击选择时间" v-model="formDialog.startTime" :clearable="false"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="结束时间" prop="endTime">
              <DatePicker type="date" placeholder="点击选择时间" v-model="formDialog.endTime" :clearable="false"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="投放级别" prop="areaType">
              <Select v-model="formDialog.areaType" placeholder="请选择" @on-change="areaTypeChange">
                <Option value="4">区级</Option>
                <Option value="3">市级</Option>
                <Option value="2">省级</Option>
                <Option value="1">全国</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="关联地区" prop="derail_address_obj">
              <Cascader :data="derail_address_arr" v-model="derail_address_obj" placeholder="选择关联地区"
                        clearabled="false"></Cascader>
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
    name: 'ad',
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        currDialog: 'edit',
        dialogShow: false,
        dialogSubmitLoading: false,
        data: [
          {
            id: 1231232,
            userId: 12321213,
            title: 'asdsad',
            imagePath: 'sdfsdfdsf',
            lockStatus: 1,
            postion: 1,
            href: 'sdfsdfsdf',
            sort: 1,
            clickNum: 12,
            detailAddress: 'sdfsdf',
            startTime: '',
            endTime: '',
            isUp: 1,
            areaType: 1,
            context: 'sddsff'
          }
        ],
        derail_address_arr: [],
        derail_address_obj: [],
        derail_address_arr_s: [],
        derail_address_obj_s: [],
        adPostionData: [
          {
            value: '1',
            label: '首页banner'
          }, {
            value: '2',
            label: '首页新闻列表'
          }, {
            value: '3',
            label: '首页新闻详情'
          }, {
            value: '4',
            label: '政务banner'
          }, {
            value: '5',
            label: '招商banner'
          }, {
            value: '6',
            label: '办事指南详情'
          }, {
            value: '7',
            label: '便民工具'
          }, {
            value: '8',
            label: '广场帖子列表'
          }, {
            value: '9',
            label: '帖子详情'
          }
        ],
        formSearch: {
          startTime: '',
          endTime: '',
          province: 0,
          city: 0,
          type: null,
          lockStatus: null,
          title: null,
          areaType: '0'
        },
        formDialog: {
          id: '',
          userId: '',
          title: '',
          imagePath: '',
          lockStatus: '1',
          postion: '1',
          href: '',
          sort: 1,
          clickNum: '',
          detailAddress: '',
          startTime: '',
          endTime: '',
          isUp: '1',
          areaType: '1',
          context: ''
        },
        columns: [
          {
            'title': 'ID',
            'key': 'id',
            'width': 180,
            'sortable': true
          },

          {
            'title': '标题',
            'key': 'title',
            'width': 150,
            'sortable': true
          },

          {
            'title': '主图',
            'key': 'imagePath',
            'width': 120,
            'sortable': true,
            render: function (create, params) {
              return create('img', {
                attrs: {
                  src: params.row.imagePath,
                  width: 80,
                  height: 80
                },
                style: {
                  'border': '1px solid transparent',
                  'border-radius': '4px',
                  'margin': '10px 0'
                }
              })
            }
          },
          {
            'title': '链接地址',
            'key': 'href',
            'width': 250,
            'sortable': true
          },
          {
            'title': '点击次数',
            'key': 'clickNum',
            'width': 120,
            'sortable': true
          },
          {
            'title': '广告位置',
            'key': 'postion',
            'width': 120,
            'sortable': true,
            render: (create, params) => {
              var map = [
                {
                  value: '1',
                  label: '首页banner'
                }, {
                  value: '2',
                  label: '首页新闻列表'
                }, {
                  value: '3',
                  label: '首页新闻详情'
                }, {
                  value: '4',
                  label: '政务banner'
                }, {
                  value: '5',
                  label: '招商banner'
                }, {
                  value: '6',
                  label: '办事指南详情'
                }, {
                  value: '7',
                  label: '便民工具'
                }, {
                  value: '8',
                  label: '广场帖子列表'
                }, {
                  value: '9',
                  label: '帖子详情'
                }
              ]
              return create('span', map[params.row.postion])
            }
          },
          {
            'title': '关联地区',
            'key': 'detailAddress',
            'width': 170,
            'sortable': true,
            render: function (create, params) {
              var map = {
                1: '', 2: ' (省)', 3: ' (市)', 4: ' (区)'
              }
              return create('span', params.row.detailAddress + map[params.row.areaType])
            }

          },
          {
            'title': '排序',
            'key': 'sort',
            'width': 100,
            'sortable': true
          },
          {
            'title': '状态',
            'key': 'lockStatus',
            'width': 100,
            'sortable': true,
            render: function (create, params) {
              var map = {
                1: '正常', 2: '禁用', 3: '过时'
              }
              if (params.row.isUp == 2) {
                return create('span', map[params.row.lockStatus] + '(置顶)')
              } else {
                return create('span', map[params.row.lockStatus])
              }
            }
          },
          {
            'title': '创建人',
            'key': 'createBy',
            'width': 120,
            'sortable': true
          },

          {
            'title': '开始时间',
            'key': 'startTime',
            'width': 160,
            'sortable': true
          },

          {
            'title': '结束时间',
            'key': 'endTime',
            'width': 160,
            'sortable': true
          },
          {
            'title': '创建时间',
            'key': 'createTime',
            'width': 160,
            'sortable': true
          },
          {
            title: '操作',
            key: 'action',
            width: 200,
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
                    type: 'warning',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      console.log('禁用')
                    }
                  }
                }, '禁用'),
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
      resetSearch (name) {
        var vm = this
        vm.$refs[name].resetFields()
      },
      submitSearch (name) {
        console.log('搜索')
      },
      resetDialogForm (name) {
        let vm = this
        vm.$refs[name].resetFields()
      },
      areaTypeChange () {},
      areaTypeChange_s () {},
      handleSuccess () {},
      postionChange () {},
      initDialog () {}
    },
    mounted () {
      this.$store.state.pager.data = this.data
    }
  }
</script>

<style scoped>

</style>
