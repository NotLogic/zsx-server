<template>
  <div class="advice-content">
    <!-- <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      
      <Button type="default" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form> -->
    <mainTable :columns="columns" :data="pager.data" :loading="pageLoading"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :current="pager.current" :loading="pageLoading"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        
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
    name: 'adviceContent',
    mixins: [page],
    components: {
      mainTable,
      paging,
    },
    data(){
      return {
        url: {
          // 增删改查
          add: '',
          delete: '',
          edit: '',
          search: '',
          changeAd:'web/user/feedback/txt/slove/',
        },
        pager: {
          // 页面初始化
          url: 'web/user/feedback/txt/dataGrid',
          // 主区域表格数据
          data: [],
          method: 'get'
        },
        // 搜索表单
        formSearch: {
          
        },
        // 新增/编辑表单
        formDialog: {

        },
        columns: [
          // {
          //   'title': 'id',
          //   'key': 'id',
          //   'width': 100,
          //   'sortable': true
          // },
          {
            'title': '反馈用户',
            'key': 'nickName',
            'sortable': true
          },
          {
            'title': '反馈内容',
            'key': 'text',
            'sortable': true,
            'width': 500
          },
          {
            'title': '联系方式',
            'key': 'contactInformation',
            'sortable': true,
            render:(create,params)=>{
              var key=params.row.contactInformation
              var txt = key ? key : '无'
              return create('span', txt)
            }
          },
          {
            'title': '是否解决',
            'key': 'isOk',
            'sortable': true,
            'align': 'center',
            render: (create, params) => {
              var vm=this;
              var row = params.row.isOk,map=this.isOkMap
              var key = row.toString()
              var txt = map[key] ? map[key] : key
              if(key==1)
              {
                return create('span', txt);
              }
              else
              {
               return  create('Button', {
                      props: {
                        type: "primary",
                        size: 'small'
                      },
                      style: {
                        'margin-left': '5px'
                      },
                      on: {
                        click: () => {
                          vm.$Modal.confirm({
                            title: '确认',
                            content: "确认该反馈已解决了吗？",
                            onOk: function () {
                              vm.changeRow(params.row.id)
                            }
                          })
                        }
                      }
                    }, '确认已解决')
              }
            }
          },
          {
            'title': '创建时间',
            'key': 'createTime',
            'sortable': true,
            render: (create,params)=>{
              var vm=this,key=params.row.createTime,txt=key
              if(typeof key=='number'){
                txt = vm.util.timestampToTime(key)
              }
              return create('span',txt)
            }
          },
        ],
        rules: {},
        isOkMap:{
          "0":"未处理",
          "1":"已解决"
        },
      }
    },
    methods: {
      // 重置搜索表单
      resetSearch(name){
        name = name || 'formSearch'
        var vm = this
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
      },
      // 重置新增/编辑表单
      resetDialogForm(name){
        name = name || 'formDialog'
        var vm = this
        vm.$refs[name].resetFields()
      },
      //修改反馈意见的状态
      changeRow(data){
        var vm = this
        vm.$http2({
          url: vm.url.changeAd+data,
          method: vm.pager.method,
          data: data
        }).then(res => {
          var resData = res.data
          if(resData.code==1){
            vm.$Message.success('操作成功！')
            vm.paging()
          }else{
            vm.$Message.error(resData.message)
          }
        }).catch(err=>{

        })
      },
    },
  }
</script>
<style scoped>

</style>
