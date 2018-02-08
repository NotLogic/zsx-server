<template>
  <div class="sensitiveWords">
    <Form inline>
      <FormItem>
        <Button type="primary" @click="addRow" size="small">{{label.add}}</Button>
      </FormItem>
      <FormItem>
        <Upload name="execlFile"
                action="sensitiveWord/execl.do"
                :on-success="upExeclSuccess"
                :format="['xlsx']"
                :on-format-error="handleFormatError"
                :show-upload-list="false">
          <Button type="primary" size="small">{{label.uploadExcel}}</Button>
        </Upload>
      </FormItem>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging :total="pager.total" :currPage="pager.currPage" :pagesize="pager.pagesize" :page-size-opts="pageSizeOpts"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="敏感词" prop="word">
              <Input v-model="formDialog.word" placeholder="请输入敏感词"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">
          {{label.submit}}
        </Button>
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
        url: {
          add: 'sensitiveWord/add.do',
          edit: 'sensitiveWord/edit.do',
          delete: 'sensitiveWord/delete.do',
          paging: '',
          refurbish: 'sensitiveWord/refurbish.do' //词库立即生效
        },
        pager: {
          url: 'sensitiveWord/dataGrid.do',
          pagesize: 50
        },
        currDialog: 'add',
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
      initDialog (data) {},
      initData () {}
    },
    mounted () {
      let vm = this
      vm.initData()
      vm.$store.commit('initPager', vm)
      vm.util.paging(vm)
    }
  }
</script>

<style scoped>

</style>
