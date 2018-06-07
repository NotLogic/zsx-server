<template>
  <div class="adviceBack">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="关键词" prop="key">
            <Input v-model="formSearch.key" placeholder="昵称/内容" size="small"></Input>
        </FormItem>
        <!-- <FormItem label="反馈人ID" prop="userId">
            <Input v-model="formSearch.userId" placeholder="反馈人ID" size="small"></Input>
        </FormItem>
        <FormItem label="联系方式" prop="phone">
            <Input v-model="formSearch.phone" placeholder="联系方式" size="small"></Input>
        </FormItem>
        <FormItem label="反馈时间">
          <FormItem prop="st">
            <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.st" size="small" :clearable="false"></DatePicker>
          </FormItem>
          <FormItem>至</FormItem>
          <FormItem prop="et">
            <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.et" size="small" :clearable="false"></DatePicker>
          </FormItem>
        </FormItem> -->
        <Button type="ghost" style="margin: 5px 8px 24px 0" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="error" style="margin: 5px 8px 24px 0" :disabled="batchOprArr.length==0" @click="batchDel" size="small">批量删除</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0" @click="exportData" size="small">导出</Button>
        <Button type="primary" style="margin:5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data" @updateSelect="updateSelect"></mainTable>
    <paging @changePager="changePager" @paging="paging" :loading="pageLoading" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="模块名称" prop="text">
              <Input v-model="formDialog.text" placeholder="请输入模块名称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="父级" prop="parentId">
              <Select v-model="formDialog.parentId" placeholder="请选择/输入关键字搜索" filterable clearable>
                <Option v-for="item in parentId" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="是否跳转" prop="isSkip">
              <Select v-model="formDialog.isSkip" placeholder="请选择" clearable>
                <Option v-for="item in isSkip" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="跳转方式" prop="skipType">
              <Select v-model="formDialog.skipType" placeholder="请选择" clearable :disabled="isSkipDisabled">
                <Option v-for="item in skipType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="跳转URL" prop="skipUrl">
              <Input v-model="formDialog.skipUrl" placeholder="请输入跳转URL" :disabled="isSkipDisabled"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="状态" prop="status">
              <Select v-model="formDialog.status" placeholder="请选择" clearable>
                <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
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
    name: 'adviceBack_index',
    components: {
      mainTable,
      paging
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'feedback/add',
          edit: 'feedback/update',
          delete: 'feedback/delete',
          search: 'feedback/dataSearch',
        },
        pager: {
          data: [],
          url: 'feedback/dataGrid',
        },
        pageLoading: false,
        parentId: [],
        status: [
          {
            value: "0",
            label: '启用'
          },
          {
            value: "1",
            label: '禁用'
          }
        ],
        statusMap: {
          "0": '启用',
          "1": '禁用'
        },
        isSkip: [
          {
            value: "0",
            label: '是'
          },
          {
            value: "1",
            label: '否'
          }
        ],
        isSkipMap: {
          "0": '是',
          "1": '否'
        },
        skipType: [
          {
            value: "0",
            label: '内部'
          },
          {
            value: "1",
            label: '外部'
          }
        ],
        skipTypeMap: {
          "0": '内部',
          "1": '外部'
        },
        batchOprArr: [],
        batchIdArr: [],
        formSearch: {
          st: '',
          et: '',
          key:'',
          phone: '',
          userId: ''
        },
        isSkipDisabled: false,
        columns: [
          {
            'type': 'selection',
            'width': 80,
            'fixed': 'left',
            'align': 'center'
          },
          {
            "title": "ID",
            "key": "id",
            "width": 150,
            "sortable": true
          },
          {
            "title": "所属模块",
            "key": "text",
            "width": 150
          },
          {
            "title": "父级",
            "key": "parentId",
            "width": 150,
            "sortable": true
          },
          {
            "title": "状态",
            "key": "status",
            "sortable": true,
            "width": 150,
            render: (create, params) => {
              var vm = this;
              return create('span', vm.statusMap[params.row.status])
            }
          },
          {
            "title": "是否跳转",
            "key": "isSkip",
            "width": 150,
            "sortable": true,
            render: (create, params) => {
              var vm = this;
              return create('span', vm.isSkipMap[params.row.isSkip])
            }
          },
          {
            "title": "跳转方式",
            "key": "skipType",
            "width": 150,
            "sortable": true,
            render: (create, params) => {
              var vm = this;
              return create('span', vm.skipTypeMap[params.row.skipType])
            }
          },
          {
            "title": "跳转URL",
            "key": "skipUrl",
            "sortable": true,
            "width": 200,
          },
          {
            'title': '操作',
            'key': 'action',
            'width': 140,
            'align': 'center',
            'fixed': 'right',
            render: (create, params) => {
              return create('div',[
                this.createEditBtn(create, params.row),
                this.createDelBtn(create, params.row.id)
              ])
            }
          }
        ],
        formDialog: {
          id: '',
          text: '',
          parentId: '', //  上一级
          status: '0',  // 0 起用  1禁用
          isSkip: '',  //是否可以跳转  0 是  1  否
          skipType: '', //  0  内部   1外部
          skipUrl: ''  //  跳转路径
        },
        rules: {
          text: [
            { required: true, message: '模块名称不能为空', trigger: 'blur' }
          ],
        }
      }
    },
    methods: {
      updateSelect (selection) {
        this.batchOprArr = selection
      },
      resetSearch (name) {
        this.$refs[name].resetFields()
        this.submitSearch(name)
      },
      // 返回数据预处理
      pagerResult(data){
        var vm = this,key,_key,_data=[],item,_item
        var result = vm.util.deepcopy(data)
        var len = result.length
        if(!len)return []
        for(let i=0;i<len;i++){
          item = result[i]
          _item = {}
          for(key in item){
            if(typeof item[key]=='object'){
              for(_key in item[key]){
                _item[_key] = item[key][_key]
              }
            }else{
              _item[key] = item[key]
            }
          }
          _data.push(_item)
        }
        // 初始化模块选择
        let item2,parentIdArr = [{
          value: '0',
          label: '顶级'
        }]
        for(let i=0;i<_data.length;i++){
          item2 = _data[i]
          parentIdArr.push({
            value: item2.id,
            label: item2.text
          })
        }
        vm.parentId = parentIdArr
        return _data
      },
      resetDialogForm (name) {
        name = name || 'formDialog'
        let vm = this
        vm.$refs[name].resetFields()
      },
      batchDel () {
        console.log('批量删除数据： ',this.batchIdArr)
        var vm = this
        vm.$Message.info(vm.label.wait)
      },
      exportData () {
        var vm = this
        vm.$Message.info(vm.label.wait)
      },
    },
    watch: {
      batchOprArr (val){
        var vm = this,batchIdArr = [],len=val.length;
        if(len){
          for(var i=0;i<len;i++){
            batchIdArr.push(val[i].id)
          }
        }
        vm.batchIdArr = batchIdArr
      },
      ["formDialog.isSkip"](val){
        if(val==1){
          this.isSkipDisabled = true 
        }else{
          this.isSkipDisabled = false
        }
      }
    }
  }
</script>
