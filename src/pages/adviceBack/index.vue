<template>
  <div class="adviceBack">
    <div id="search-wrapper">
      <Form :model="formSearch" ref="formSearch" inline :label-width="70">
          <!-- <FormItem label="关键词" prop="key">
              <Input v-model="formSearch.key" placeholder="昵称/内容" size="small"></Input>
          </FormItem> -->
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
          <!-- <Button type="ghost" style="margin: 5px 8px 24px 0" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
          <Button type="primary" style="margin: 5px 8px 24px 0" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button> -->
          <Button v-if="hasPerm('adviceBack_index:delete')" type="error" style="margin: 5px 8px 24px 0" :disabled="batchIdArr.length==0" @click="batchDel" size="small">批量删除</Button>
          <!-- <Button type="primary" style="margin: 5px 8px 24px 0" @click="exportData" size="small">导出</Button> -->
          <Button v-if="hasPerm('adviceBack_index:add')" type="primary" style="margin:5px 8px 24px 0;" @click="addRow()" size="small">{{label.add}}</Button>
          <Button type="primary" style="margin:5px 8px 24px 0;" @click="initEcahrs(defaultEchartsData)" size="small">重置图表</Button>
      </Form>
    </div>
    <!-- <mainTable :columns="columns" :data="pager.data" @updateSelect="updateSelect" :height="tableHeight"></mainTable> -->
    <div class="advice-content-wrapper">
      <div style="width: 500px;">
        <Tree :data="pageTreeData" show-checkbox multiple :load-data="loadData" @on-select-change="treeSelectChange" @on-check-change="treeCheckChange" :multiple="false"></Tree>
      </div>
      <div class="my-echarts-wrapper">
        <!-- 反馈统计数据 -->
        <div v-if="!myEcharts" style="text-align: center;">意见反馈统计图</div>
        <div id="my-echarts" style="height:600px;"></div>
      </div>
    </div>

    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <!-- skipType：{{formDialog.skipType}} <br>
        skipUrl：{{formDialog.skipUrl}} -->
        <Row>
          <Col span="12">
            <FormItem label="模块名称" prop="text">
              <Input v-model="formDialog.text" placeholder="请输入模块名称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="父级" prop="parentId">
              <Select v-model="formDialog.parentId" placeholder="请选择/输入关键字搜索" filterable>
                <Option v-for="item in parentId" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="是否跳转" prop="isSkip">
              <Select v-model="formDialog.isSkip" placeholder="请选择">
                <Option v-for="item in isSkip" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="状态" prop="status">
              <Select v-model="formDialog.status" placeholder="请选择">
                <Option v-for="item in status" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="formDialog.isSkip==1">
          <Col span="12">
            <FormItem label="跳转方式" prop="skipType">
              <Select v-model="formDialog.skipType" placeholder="请选择">
                <Option v-for="item in skipType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="跳转URL" prop="skipUrl">
              <Input v-model="formDialog.skipUrl" placeholder="请输入跳转URL"></Input>
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
import mainTable from "@/components/mainTable";
import paging from "@/components/paging";
import page from "@/mixins/page";
export default {
  name: "adviceBack_index",
  components: {
    mainTable,
    paging
  },
  mixins: [page],
  data() {
    return {
      url: {
        add: "feedback/add",
        edit: "feedback/update",
        delete: "feedback/delete",
        search: "feedback/dataSearch",
        all: 'feedback/dataGrid',
        count: 'web/user/feedback/count/statistics',
        getCountByParentId: 'web/user/feedback/count/parent/'
      },
      myEcharts: null,
      defaultEchartsData: [],
      noPaging: true,
      initialData: [],
      pageTreeData: [],
      pager: {
        data: [],
        // url: 'feedback/dataGrid',
        url: "feedback/parent"
      },
      parentId: [],
      parentIdMap: {},
      status: [
        {
          value: "0",
          label: "启用"
        },
        {
          value: "1",
          label: "禁用"
        }
      ],
      statusMap: {
        "0": "启用",
        "1": "禁用"
      },
      isSkip: [
        {
          value: "0",
          label: "否"
        },
        {
          value: "1",
          label: "是"
        }
      ],
      isSkipMap: {
        "1": "是",
        "0": "否"
      },
      skipType: [
        {
          value: "0",
          label: "内部"
        },
        {
          value: "1",
          label: "外部"
        }
      ],
      skipTypeMap: {
        "0": "内部",
        "1": "外部"
      },
      batchIdArr: [],
      formSearch: {
        st: "",
        et: "",
        key: "",
        phone: "",
        userId: ""
      },
      columns: [
        {
          type: "selection",
          width: 80,
          fixed: "left",
          align: "center"
        },
        {
          title: "ID",
          key: "id",
          width: 150
        },
        {
          title: "所属模块",
          key: "text",
          width: 300,
          render: (create, params) => {
            var vm = this;
            var arr = [
              // create("Button", {
              //   props: {
              //     type: "text",
              //     icon: "arrow-right-b"
              //   },
              //   style: {
              //     float: "left"
              //     // backgroundColor: 'aqua'
              //   },
              //   on: {
              //     click: function() {
              //       vm.addChildren(params.row.id, params.index);
              //     }
              //   }
              // }),
              create(
                "Button",
                {
                  props: {
                    type: "text"
                  },
                  style: {
                    float: "left",
                    marginLeft: "10px"
                    // backgroundColor: 'pink'
                  },
                  on: {
                    click: function() {
                      vm.editRow(params.row);
                    }
                  }
                },
                params.row.text
              )
            ];
            return create("div", arr);
          }
        },
        {
          title: "父级",
          key: "parentId",
          width: 150
        },
        {
          title: "状态",
          key: "status",
          sortable: true,
          render: (create, params) => {
            var vm = this;
            return create("span", vm.statusMap[params.row.status]);
          }
        },
        {
          title: "是否跳转",
          key: "isSkip",
          width: 150,
          render: (create, params) => {
            var vm = this;
            return create("span", vm.isSkipMap[params.row.isSkip]);
          }
        },
        {
          title: "跳转方式",
          key: "skipType",
          width: 150,
          render: (create, params) => {
            var vm = this;
            return create("span", vm.skipTypeMap[params.row.skipType]);
          }
        },
        {
          title: "跳转URL",
          key: "skipUrl"
          // "width": 200,
        },
        {
          title: "操作",
          key: "action",
          width: 140,
          align: "center",
          fixed: "right",
          render: (create, params) => {
            return create("div", [
              this.createEditBtn(create, params.row),
              this.createDelBtn(create, params.row.id)
            ]);
          }
        }
      ],
      formDialog: {
        id: "",
        text: "",
        parentId: '0', //  上一级
        status: "0", // 0 起用  1禁用
        isSkip: "1", //是否可以跳转  0否   1 是
        skipType: "", //  0  内部   1外部
        skipUrl: "" //  跳转路径
      },
      rules: {
        text: [{ required: true, message: "模块名称不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    addRow (id) {
      this.currDialog = 'add'
      this.dialogShow = true
      if(typeof(id) != 'undefined'){
        id = id.toString()
        this.formDialog.parentId = id
      }
    },
    paging() {
      var vm = this;
      var pager = vm.pager;
      var method = pager.method;
      var params = {
        url: pager.url,
        method: method
      };
      var ajaxData = {
        id: 0
      };
      if (method == "get") {
        params.params = ajaxData;
      } else {
        params.data = ajaxData;
      }
      vm.$http2(params).then(res => {
        let resData = res.data;
        if (resData.code == 1) {
          pager.data = resData.data;
          if (typeof vm.initOther == "function") {
            vm.initOther(resData.data);
          }
        }
      }).catch(err => {});
    },
    addChildren(id, index) {
      // array.splice(1,0,"张四")  在指定位置插入元素
      var vm = this;
      var pager = vm.pager,
        ajaxData = {
          id: id || 0
        };
      var method = pager.method;
      var params = {
        url: pager.url,
        method: method
      };
      if (method == "get") {
        params.params = ajaxData;
      } else {
        params.data = ajaxData;
      }
      vm.$http2(params).then(res => {
        let resData = res.data;
        if (resData.code == 1) {
          var childrenData = resData.data;
          if(childrenData.length){
            var data = this.util.deepcopy(pager.data);
            data.splice(index + 1, 0, ...childrenData);
            pager.data = data;
          }else{
            vm.$Message.info('没有子集了')
          }
        }
      }).catch(err => {});
    },
    updateSelect(selection) {
      var vm = this,
        batchIdArr = [],
        len = selection.length;
      if (len) {
        for (var i = 0; i < len; i++) {
          batchIdArr.push(selection[i].postId);
        }
      }
      vm.batchIdArr = batchIdArr;
    },
    initOther(data) {
      var vm = this;
      var _data = vm.util.deepcopy(data),
        pageTreeData = [],
        item = {},
        key;
      for (var i = 0; i < _data.length; i++) {
        item = _data[i];
        item.title = item.text || item.id;
        item.children = [];
        item.loading = false;
        item.render = vm.treeRowRender
        pageTreeData.push(item);
      }
      vm.pageTreeData = pageTreeData;
      vm.initialData = _data;
    },
    // 树形
    loadData(item, callback) {
      var vm = this;
      var id = item.id,
        checked = item.checked;
      var pager = vm.pager,
        ajaxData = {
          id: id || 0
        };
      var method = pager.method;
      var params = {
        url: pager.url,
        method: method
      };
      if (method == "get") {
        params.params = ajaxData;
      } else {
        params.data = ajaxData;
      }
      vm.$http2(params).then(res => {
        let resData = res.data;
        if (resData.code == 1) {
          var childrenData = resData.data,
            key,
            item,
            i,
            _data = [],
            arr = [];
          var len = childrenData.length;
          if (len) {
            for (i = 0; i < childrenData.length; i++) {
              item = childrenData[i];
              item.title = item.text || item.id;
              item.children = [];
              item.render = vm.treeRowRender
              if (checked) {
                // 如果父级已被选中，展开时将所有子级的id推入batchIdArr
                arr.push(item.id);
              }
              item.loading = false;
              _data.push(item);
            }
            vm.batchIdArr = vm.batchIdArr.concat(arr);
          } else {
            vm.$Message.info("没有子集了！");
          }
          callback(_data);
        }
      }).catch(err => {});
    },
    treeSelectChange(data) {
      if (data.length) {
        this.editRow(data[0]);
      }
    },
    treeCheckChange(data) {
      var vm = this,
        arr = [],
        len = data.length,
        i,
        item;
      for (i = 0; i < len; i++) {
        item = data[i];
        arr.push(item.id);
      }
      vm.batchIdArr = arr;
    },
    initEcharts(id,txt){
      var vm = this
      var params = {
        url: vm.url.getCountByParentId + id,
        method: 'get'
      }
      vm.$http(params).then(res=>{
        if(res&&res.status==200){
          var resData = res.data
          if(resData.code==1){
            var echartsData = resData.data.children,total=resData.data.value
            if(total){
              vm.initEcahrs(echartsData,txt)
            }else{
              vm.$Message.info(txt + '暂无数据')
            }
          }else{
            vm.$Message.info(resData.message)
          }
        }
      })
    },
    treeRowRender(h, { root, node, data }) {
      var vm = this,arr=[]
      var addBtn = h("Button", {
        props: {
          icon: "md-add",
          type: "primary",
          size: 'small',
        },
        style: {
          width: "52px",
          marginRight: '10px'
        },
        on: {
          click: () => {
            // 在当前行点添加，添加的应该是父级是此行的
            vm.addRow(data.id);
            // vm.addRow(data.parentId);
          }
        }
      })
      var editBtn = h("Button", {
        props: {
          icon: "md-create",
          type: "primary",
          size: 'small',
        },
        style: {
          width: "52px",
          marginRight: '10px'
        },
        on: {
          click: () => {
            vm.editRow(data);
          }
        }
      })
      var deleteBtn = h("Button", {
        props: {
          icon: "md-close",
          type: "error",
          size: 'small',
        },
        style: {
          width: "52px",
          marginRight: '10px'
        },
        on: {
          click: () => {
            vm.$Modal.confirm({
              title: '确认',
              content: '确认删除这条数据吗？',
              onOk: function () {
                vm.delRow(data)
              }
            })
          }
        }
      })
      if(vm.hasPerm('adviceBack_index:add')){
        arr.push(addBtn)
      }
      if(vm.hasPerm('adviceBack_index:edit')){
        arr.push(editBtn)
      }
      if(vm.hasPerm('adviceBack_index:delete')){
        arr.push(deleteBtn)
      }
      return h("span",
        [
          // h("span", data.title),
          // 渲染按钮，点击触发编辑功能
          h('Button',{
            props: {
              type: "text",
              size: 'small',
            },
            on: {
                click: () => {
                  vm.initEcharts(data.id,data.title)
                  // vm.editRow(data);
                }
              }
          },data.title),
          h("span",{
            style: {
              float: 'right'
            }
          },arr)
        ]
      );
    },
    // 树形  end
    resetSearch(name) {
      this.$refs[name].resetFields();
      this.paging(1);
      // this.submitSearch(name)
    },
    initDialog(data) {
      var vm = this;
      if (typeof data.status == "number") {
        // data.status = data.status.toString();
        vm.formDialog.status = data.status.toString()
      }
      if (typeof data.isSkip == "number") {
        // data.isSkip = data.isSkip.toString();
        vm.formDialog.isSkip = data.isSkip.toString()
      }
      if (typeof data.skipType == "number") {
        // data.skipType = data.skipType.toString();
        vm.formDialog.skipType = data.skipType.toString()
      }
      if (typeof data.parentId == "number") {
        // data.parentId = data.parentId.toString();
        vm.formDialog.parentId = data.parentId.toString()
      }
    },
    resetDialogForm(name) {
      name = name || "formDialog";
      let vm = this;
      vm.formDialog.parentId = ''
      vm.$refs[name].resetFields();
    },
    // 批量操作
    batchoperation(parmas) {
      var vm = this;
      if (typeof parmas != "object") {
        vm.$Message.error("传参错误");
        return;
      }
      parmas.method = parmas.method || "post";
      vm.$http2(parmas).then(res => {
        var resData = res.data;
        if (resData.code == 1) {
          vm.$Message.success("操作成功");
          vm.batchIdArr = [];
          vm.paging();
        } else {
          vm.$Message.error(resData.message);
        }
      }).catch(err => {});
    },
    delRow(data) {
      var vm = this;
      if (!data.id) {
        vm.$Message.error("id获取失败");
        return;
      }
      var parmas = {
        method: "post",
        url: vm.url.delete,
        data: {
          ids: [data.id]
        }
      };
      vm.batchoperation(parmas);
    },
    batchDel() {
      var vm = this;
      vm.$Modal.confirm({
        title: "确认",
        content: "确认删除这些数据吗？",
        onOk: function() {
          var parmas = {
            method: "post",
            url: vm.url.delete,
            data: {
              ids: vm.batchIdArr
            }
          };
          vm.batchoperation(parmas);
        }
      });
    },
    exportData() {
      var vm = this;
      vm.$Message.info(vm.label.wait);
    },
    initEcahrs(data,txt){
      var vm = this
      var xData=[],_txt=txt||'锵锵意见反馈统计图'
      data.forEach(item=>{
        xData.push(item.name)
      })
      var option = {
          title: {
            text: _txt,
            left: "center",
            top: '20px',
            textStyle: {
              fontSize: 14,
              align: 'center'
            },
          },
          xAxis: {
            data: xData,
          },
          yAxis: {
            show: true
          },
          tooltip: {
          trigger: "item"
        },
        series: [
          {
            name: '反馈数量',
            type: 'bar',  
            roam: true,
            left: 'center',
            top: 'center',
            label: {  
              normal: {  
                show: true,
              },  
              emphasis: {  
                show: false  
              }  
            },
            data:data  //数据
          },
        ],
      };
      if(!vm.myEcharts){
        vm.$nextTick(function(){
          var dom = document.getElementById("my-echarts");
          var myChart = echarts.init(dom);
          myChart.on('click',function(params){
            var _data = params.data.children
            if(_data.length){
              vm.initEcahrs(_data, params.data.name)
            }else{
              vm.$Message.info('没有子集数据了')
            }
          });
          window.addEventListener("resize", function () {
              myChart.resize();
          });
          myChart.setOption(option, true);
          vm.myEcharts = myChart
        })
      }else{
        vm.myEcharts.setOption(option, true)
      }
    },
    initAllAdviceBack(){
      var vm = this
      vm.$http.post(vm.url.all).then(res=>{
        var resData = res.data
        if(resData.code==1){
          var data = resData.data,i,item,arr=[{value: '0',label: '顶级菜单'}],map={'0': '顶级菜单'}
          for(i=0;i<data.length;i++){
            item=data[i]
            map[item.id] = item.text
          }
          for(i=0;i<data.length;i++){
            item=data[i]
            arr.push({
              value: item.id.toString(),
              label: item.parentId == 0 ? item.text : map[item.parentId] + ' > ' + item.text
            })
          }
          vm.parentId = arr
          vm.parentIdMap = map
        }
      }).catch(err=>{})
    },
    initCount(){
      var vm = this
      vm.$http.get(vm.url.count).then(res=>{
        if(res&&res.data){
          var resData = res.data
          if(resData.code == 1){
            vm.defaultEchartsData = resData.data
            vm.initEcahrs(resData.data)
          }else{
            vm.$Message.info(resData.message)
          }
        }
        
      })
    },
    initData(){
      this.initAllAdviceBack()
      this.initCount()
    }
  },
  watch: {
    ["formDialog.isSkip"](val) {
      this.formDialog.skipType = "";
      this.formDialog.skipUrl = "";
    }
  }
};
</script>

<style scoped>
.advice-content-wrapper{
  position: relative;
}
.my-echarts-wrapper{
  position: absolute;
  left: 500px;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
