const deepcopy = function (source) {
  if (!source) {
    return source;
  }
  let sourceCopy = source instanceof Array ? [] : {};
  for (let item in source) {
    sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item];
  }
  return sourceCopy;
}
const page = {
  data: function () {
    return {
      // 当前操作是新增还是编辑
      currDialog: 'add',
      // 主弹出框的显示隐藏
      dialogShow: false,
      // 主弹出框是否正在提交数据
      dialogSubmitLoading: false,
      // 删除行的key
      delRowKey: 'id',
      // 需不需要传id
      needId: false,
      // 按钮文字map
      label: {
        'edit': '编辑',
        'add': '添加',
        'clear': '清空',
        'submit': '提交',
        'delete': '删除',
        'search': '搜索',
        'debugging': '调试',
        'sure': '确定',
        'close': '关闭',
        'cancle': '取消',
        'uploadImg': '上传图片',
        'uploadExcel': '导入Excel',
        'wait': '还没做好请稍等'
      },
      mixinPager: {
        'url': '',
        'current': 1,
        'method': 'post',
        // 'order': '',
        'size': 10,
        // 'sort': '',
        // 'total': 0,
        'data': [],
      },
      map: {
        'sex': {
          '1': '男',
          '2': '女',
          '3': '保密'
        },
        'userType': {
          '1': '管理员',
          '2': '用户'
        },
        'status': {
          '1': '正常',
          '2': '停用'
        },
        'openClose': {
          '1': '打开',
          '2': '关闭'
        }
      }
    }
  },
  methods: {
    // 添加行
    addRow () {
      this.currDialog = 'add'
      this.dialogShow = true
    },
    // 搜索提交
    submitSearch (name) {
      let vm = this
      // 搜索操作
      vm.$http2({
        url: vm.url.search,
        method: vm.pager.method,
        data: vm.formSearch
      }).then(res => {
        var resData = res.data
        if(resData.code==1){
          vm.pager.data = resData.data
        }else{
          vm.$Message.error('搜索失败: ' + resData.message)
        }
      }).catch(err=>{})
    },
    // 新增/编辑主弹出框的提交
    submitDialogForm (name) {
      let vm = this
      vm.$refs[name].validate(function (valid) {
        if (valid) {
          if (vm.initPostDialog) {
            vm.initPostDialog(vm.formDialog)
          }
          let ajaxData = vm.editAddAjaxData(vm.currDialog)
          let ajaxUrl = vm.url[vm.currDialog]
          console.log('ajaxData: ',ajaxData)
          vm.dialogSubmitLoading = true
          vm.$http({
            url: ajaxUrl,
            method: vm.pager.method,
            data: ajaxData
          }).then(res => {
            vm.dialogSubmitLoading = false
            var resData = res.data
            if(resData.code==1){
              vm.$Message.success(vm.label[vm.currDialog]+'成功!')
              vm.paging();
              vm.dialogShow = false
              if(typeof vm.resetDialogForm == 'function'){
                vm.resetDialogForm()
              }
            }else{
              vm.$Message.error(vm.label[vm.currDialog]+'失败: ' + resData.message)
            }
          }).catch(err=>{
    
          })
        }
      })
    },
    // 更新页面的数据
    paging (currPage) {
      let vm = this
      if (currPage && Number(currPage)) {
        vm.changePager(currPage)
        return
      }
      vm.$http2({
        url: vm.pager.url,
        method: vm.pager.method,
        data: vm.pagingFiltData(vm.pager)
      }).then(res => {
        let resData = res.data
        resData = typeof resData == 'object' ? resData : JSON.parse(resData)
        if (resData.code == 1) {
          if (typeof vm.pagerResult == 'function') {
            // 返回数据预处理
            resData.data = vm.pagerResult(resData.data)
          }
          setTimeout(function(){
            vm.pager.data = resData.data
            vm.pager.total = resData.total
          },20)
        }
      }).catch(err=>{})
    },
    // 分页改变
    changePager (data) {
      let vm = this
      if (typeof data === 'object') {
        for (let key in data) {
          vm.pager[key] = data[key]
        }
      } else {
        vm.pager.currPage = data
      }
      vm.paging()
    },
    // 过滤提交的数据
    pagingFiltData(object) {
      let obj = deepcopy(object)
      for (let key in obj) {
        if (typeof obj[key] === 'string' && obj[key].trim() === '') {
          delete obj[key]
        }
      }
      if (obj.data) {
        delete obj.data
      }
      if (obj.url || obj.url === '') {
        delete obj.url
      }
      if (obj.method) {
        delete obj.method
      }
      if (obj.total) {
        delete obj.total
      }
      return obj
    },
    // 新增时不提交id
    editAddAjaxData (currDialog) {
      let vm = this
      let ajaxData = {}
      if(vm.needId){
        for (let key in vm.formDialog) {
          ajaxData[key] = vm.formDialog[key]
        }
      }else{
        if (currDialog === 'add') {
          for (let key in vm.formDialog) {
            if (key != 'id') {
              ajaxData[key] = vm.formDialog[key]
            }
          }
        } else if (currDialog === 'edit') {
          for (let key in vm.formDialog) {
            ajaxData[key] = vm.formDialog[key]
          }
        }
      }
      return ajaxData
    },
    // 创建编辑按钮
    createEditBtn (create, data) {
      let vm = this
      return create('Button', {
        props: {
          type: 'primary',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            vm.editRow(data)
          }
        }
      }, '编辑')
    },
    editRow (data) {
      console.log('编辑行原始数据： ',data)
      let vm = this
      let _data = {}
      for (let key in vm.formDialog) {
        _data[key] = data[key]
      }
      if (typeof vm.initDialog === 'function') {
        vm.initDialog(_data)
      }
      console.log('_data: ',_data)
      vm.formDialog = _data
      vm.currDialog = 'edit'
      vm.dialogShow = true
    },
    // 创建删除按钮
    createDelBtn (create, data) {
      let vm = this
      return create('Button', {
        props: {
          type: 'error',
          size: 'small'
        },
        on: {
          click: () => {
            vm.$Modal.confirm({
              title: '确认',
              content: '确认删除这条数据吗？',
              onOk: function () {
                let idObj = {}
                let key = vm.delRowKey || id
                let idData = null
                if (typeof data === 'object' && typeof vm.delResult === 'function'){
                  idData = vm.delResult(data)
                } else if (typeof data === 'string' || typeof data === 'number') {
                  idData = data
                }
                idObj[key] = idData
                vm.delRow(idObj)
              }
            })
          }
        }
      }, '删除')
    },
    delRow (data) {
      var vm = this
      vm.$http2({
        url: vm.url.delete,
        method: vm.pager.method,
        data: data
      }).then(res => {
        var resData = res.data
        if(resData.code==1){
          vm.$Message.success("删除成功！")
          vm.paging()
        }else{
          vm.$Message.error(resData.message)
        }
      }).catch(err=>{

      })
    },
    // 初始化pager   组件中pager的键覆盖mixinPager的键
    initPager (data) {
      let vm = this
      let pager = deepcopy(vm.pager)
      let mixinPager = deepcopy(vm.mixinPager)
      for(let key in pager) {
        mixinPager[key] = pager[key]
      }
      vm.pager = mixinPager
    }
  },
  created () {
    let vm = this
    if (typeof vm.initData === 'function') {
      vm.initData()
    }
    // 在这里修改pager会触发一次页面加载函数，所以不需要在下边再请求一次
    vm.initPager()
  }
}
export default page