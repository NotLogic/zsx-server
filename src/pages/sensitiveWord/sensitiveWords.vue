<template>
  <div class="sensitiveWords">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="敏感词" prop="searchWord">
            <Input v-model="formSearch.word" placeholder="敏感词" size="small"></Input>
        </FormItem>
        <Button type="ghost" style="margin-right: 8px;margin-top: 5px;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin-right: 8px;margin-top: 5px;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="primary" style="margin-right: 8px;margin-top: 5px;" @click="refurbish" size="small">敏感词库立即生效</Button>
        <Button type="primary" style="margin-right: 8px;margin-top: 5px;" @click="addRow" size="small">{{label.add}}</Button>
        <Upload name="execlFile"
                action="sensitiveWord/execl.do"
                :on-success="upExeclSuccess"
                :format="['xlsx']"
                :on-format-error="handleFormatError"
                :show-upload-list="false"
                style="display:inline-block;">
          <Button type="primary" size="small" style="margin-top:5px;">{{label.uploadExcel}}</Button>
        </Upload>
    </Form>
    <!-- <mainTable :columns="columns" :data="pager.data" :height="610"></mainTable> -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage" :pagesize="pager.pagesize" :page-size-opts="pageSizeOpts"></paging>
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
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import page from '@/mixins/page'
  export default {
    name: 'sensitiveWords',
    components: {
      paging,
      mainTable
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'sensitiveWord/add.do',
          edit: 'sensitiveWord/edit.do',
          delete: 'sensitiveWord/delete.do',
          refurbish: 'sensitiveWord/refurbish.do' //词库立即生效
        },
        pager: {
          data: [
            {
              id: '955404688858189825',
              word: '安局办公楼'
            }, {
              id: '946291305121988608',
              word: '龚平'
            }, {
              id: '946291305197486080',
              word: '黄色网站'
            }
          ],
          url: 'sensitiveWord/dataGrid.do',
          pagesize: 50
        },
        pageSizeOpts: [50, 100, 150, 200],
        formSearch: {
            word: ""
        },
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
                vm.createEditBtn(create, params.row),
                vm.createDelBtn(create, params.row.id)
              ])
            }
          }
        ],
        rules: {
          word: [{ required: true, message: '请填写分类名称', trigger: 'blur' }]
        }
      }
    },
    computed: {},
    methods: {
      upExeclSuccess () {},
      handleFormatError () {},
      resetDialogForm (name) {
        this.$refs[name].resetFields()
      },
      resetSearch (name) {
        this.$refs[name].resetFields()
        this.submitSearch(name)
      },
      // 敏感词库立即生效
      refurbish () {},
      upExeclSuccess (res) {
        if(res.code){
          this.$Message.success("上传成功！")
        } 
      },
      handleFormatError () {
        this.$Message.error('文件格式错误，请选择xlsx格式的文件')
      },
      initDialog (data) {},
      initData () {}
    },
    created () {},
    mounted () {
    },
    watch: {
    }
  }
</script>
