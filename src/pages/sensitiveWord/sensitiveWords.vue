<template>
  <div class="sensitiveWords">
    <Form inline>
      <FormItem>
        <Button type="primary" @click="addRow" size="small">添加</Button>
      </FormItem>
      <FormItem>
        <Upload name="execlFile"
                action="sensitiveWord/execl.do"
                :on-success="upExeclSuccess"
                :format="['xlsx']"
                :on-format-error="handleFormatError"
                :show-upload-list="false">
          <Button type="primary" size="small">导入敏感词Excel</Button>
        </Upload>
      </FormItem>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging :page-size-opts="pageSizeOpts"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" @on-cancel="resetDialogForm('formDialog')">
      <i-form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="敏感词" prop="word">
              <Input v-model="formDialog.word" placeholder="请输入敏感词"></Input>
            </FormItem>
          </Col>
        </Row>
      </i-form>
      <div slot="footer">
        <i-button @click="resetDialogForm('formDialog')">{{label.clear}}</i-button>
        <i-button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">
          {{label.submit}}
        </i-button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  export default {
    name: 'sensitiveWords',
    components: {
      paging,
      mainTable
    },
    data () {
      return {
        currDialog: 'edit',
        dialogShow: false,
        dialogSubmitLoading: false,
        data: [
          {
            id: '12324',
            word: 'asd'
          }
        ],
        pageSizeOpts: [50, 100, 150, 200],
        formDialog: {
          id: '',
          word: ''
        },
        columns: [
          {
            title: '编号',
            key: 'id'
          },
          {
            title: '敏感词',
            key: 'word'
          },
          {
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
        rules: {
          word: [{ required: true, message: '请填写分类名称', trigger: 'blur' }]
        }
      }
    },
    computed: {
      pager () {
        return this.$store.state.pager
      },
      label () {
        return this.$store.state.label
      }
    },
    methods: {
      addRow () {
        this.$store.commit('addRow', this)
      },
      upExeclSuccess () {},
      handleFormatError () {},
      resetDialogForm (name) {
        let vm = this
        vm.formDialog.id = '0'
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {
        let vm = this
        vm.$store.dispatch('submitDialogForm', {
          'vm': this,
          'name': name
        })
      },
      initDialog (data) {}
    },
    mounted () {
      this.$store.state.pager.pagesize = 50
      this.$store.state.pager.data = this.data
    }
  }
</script>

<style scoped>

</style>
