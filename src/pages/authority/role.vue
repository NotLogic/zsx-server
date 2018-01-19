<template>
  <div class="role">
    <div style="padding: 15px 0;">
      <Button type="primary" @click="addRow" size="small">添加</Button>
    </div>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging :total="pager.total"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="角色名称" prop="name">
              <Input v-model="formDialog.name" placeholder="请输入角色名称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="排序" prop="seq">
              <Input v-model="formDialog.seq"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <FormItem label="描述" prop="description">
              <Input type="textarea" v-model="formDialog.description" placeholder="请输入描述" :rows="3"></Input>
          </FormItem>
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
  import accessTree from '@/components/tree'
  import paging from '@/components/paging'
  import util from '@/libs/util'
  export default {
    name: 'role',
    components: {
      mainTable,
      paging,
      accessTree
    },
    data () {
      return {
        treeData: [
          {
            title: 'parent 1',
            expand: true,
            children: [
              {
                title: 'parent 1-1',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-1-1'
                  },
                  {
                    title: 'leaf 1-1-2'
                  }
                ]
              },
              {
                title: 'parent 1-2',
                expand: true,
                children: [
                  {
                    title: 'leaf 1-2-1'
                  },
                  {
                    title: 'leaf 1-2-1'
                  }
                ]
              }
            ]
          }
        ],
        pager: {
          data: [
            {
              id: '1',
              name: '超管',
              seq: 0,
              description: '我是超管'
            }, {
              id: '3',
              name: '哈哈',
              seq: 2,
              description: '哈哈哈'
            }
          ],
          total: 100
        },
        dialogShow: false,
        dialogSubmitLoading: false,
        formDialog: {
          id: '',
          name: '',
          seq: 0,
          description: ''
        },
        columns: [
          {
            'title': 'id',
            'key': 'id',
            'sortable': true
          }, {
            'title': '名称',
            'key': 'name',
            'sortable': true
          }, {
            'title': '序号',
            'key': 'seq',
            'sortable': true
          }, {
            'title': '描述',
            'key': 'description',
            'sortable': true
          }, {
            'title': '操作',
            'key': 'action',
            'align': 'center',
            'fixed': 'right',
            render: (create, params) => {
              if (params.row.name === '超管') {
                return create('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$store.commit('editRow', {
                        'vm': this,
                        'params': params
                      })
                    }
                  }
                }, '编辑')
              } else {
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
                        console.log(this)
                      }
                    }
                  }, '授权'),
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
                          'params': params
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
                        console.log(this)
                      }
                    }
                  }, '删除')
                ])
              }
            }
          }
        ],
        rules: {
          name: [
            { required: true, message: '角色名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      addRow () {
        this.$store.commit('addRow', {
          'vm': this
        })
      },
      resetDialogForm (name) {
        this.$refs[name].resetFields()
      },
      submitDialogForm (name) {}
    },
    computed: {
      // pager () {
      //   return this.$store.state.pager
      // },
      label () {
        return this.$store.state.label
      },
      currDialog () {
        return this.$store.state.currDialog
      }
    },
    mounted () {
      console.log(util)
    }
  }
</script>

<style scoped>

</style>
