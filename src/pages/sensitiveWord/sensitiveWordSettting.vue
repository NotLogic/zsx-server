<template>
  <div class="sensitive-word-settting">
    <Form inline>
      <FormItem>
        <Button type="primary" @click="addRow" size="small">{{label.add}}</Button>
      </FormItem>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="100">
        <FormItem label="匹配规则">
          <RadioGroup v-model="formDialog.matchType">
            <Radio label="1">最小匹配规则</Radio>
            <Radio label="2">最大匹配规则</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否设为默认">
          <RadioGroup v-model="formDialog.isdefault">
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="敏感词替换为" prop="rpWord">
          <Input v-model="formDialog.rpWord" placeholder="请输替换内容"></Input>
        </FormItem>
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
  export default {
    name: 'sensitiveWordSettting',
    components: {
      mainTable
    },
    data: function () {
      return {
        url: {
          add: 'sensitiveWordSettting/add.do',
          edit: 'sensitiveWordSettting/edit.do',
          delete: 'sensitiveWordSettting/delete.do',
          defaultRule: 'sensitiveWordSettting/setting.do' //设置默认规则
        },
        pager: {
          data: [
            {
              id: '946583771071037440',
              rpWord: "qweqwe",
              matchType: "1",
              isdefault: "1"
            }, {
              id: '946583771071037441',
              rpWord: "sd",
              matchType: "2",
              isdefault: "0"
            }, {
              id: '946583771071037442',
              rpWord: "qw123",
              matchType: "1",
              isdefault: "0"
            }
          ],
          url: 'sensitiveWordSettting/dataGrid.do'
        },
        currDialog: 'add',
        dialogShow: false,
        dialogSubmitLoading: false,
        formDialog: {
          id: '',
          rpWord: "",
          matchType: "1",
          isdefault: "0"
        },
        columns: [
          {
            title: 'id',
            key: 'id'
          },
          {
            title: '替换规则',
            key: 'rpWord'
          },
          {
            title: '匹配规则',
            key: 'matchType',
            render: function (create, params) {
              var map = {
                1: "最小匹配规则",
                2: "最大匹配规则"
              }
              return create('span', map[params.row.matchType])
            }
          },
          {
            title: '是否默认',
            key: 'isdefault',
            render: function (create, params) {
              var map = {
                0: "否",
                1: "是"
              }
              return create('span', map[params.row.isdefault])
            }
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
                vm.util.createEditBtn(create, params.row, vm),
                (function(){
                  if(params.row.isdefault == '1'){
                    return create('Button', {
                      props: { type: 'primary', size: 'small' ,disabled: true},
                      style: { marginRight: '5px' }
                    }, '设为默认')
                  }else{
                    return create('Button', {
                      props: { type: 'primary', size: 'small' },
                      style: { marginRight: '5px' },
                      on: {
                        click: function () {
                          vm.setDefaultRule(params.index)
                        }
                      }
                    }, '设为默认');
                  }
                })(),
                vm.util.createDelBtn(create, params.row.id, vm)
              ])
            }
          }
        ],
        rules: {
          rpWord: [{required: true, message: '请填写分类名称', trigger: 'blur'}]
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
        this.util.addRow(this)
      },
      upExeclSuccess () {},
      handleFormatError () {},
      resetDialogForm (name) {
        let vm = this
        vm.formDialog.matchType = "1"
        vm.formDialog.isdefault = "0"
        vm.$refs[name].resetFields()
      },
      submitDialogForm (name) {
        this.util.submitDialogForm(this, name)
      },
      setDefaultRule (index) {
        console.log('设为默认index：',index)
      },
      initDialog () {},
      paging () {
        this.util.paging(this)
      },
      initData () {}
    },
    created () {
      let vm = this
      vm.initData()
      vm.$store.commit('initPager', vm)
      vm.paging(vm)
    },
    mounted () {
    }
  }
</script>

<style scoped>

</style>
