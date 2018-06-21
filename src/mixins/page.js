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
        'wait': '功能正在研发中，请稍后,谢谢...'
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
    submitSearch () {
      let vm = this
      var method = typeof vm.pager.searchMethod == 'undefined' ? vm.pager.method : vm.pager.searchMethod
      // 搜索操作
      vm.$http2({
        url: vm.url.search,
        method: method,
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
          var method = typeof vm.pager.addMethod != 'undefined' ? vm.pager.addMethod : vm.pager.method
          vm.dialogSubmitLoading = true
          var params = {
            url: ajaxUrl,
            method: method,
          }
          if(method=='post'){
            params.data = ajaxData
          }else if(method=='get'){
            params.params = ajaxData
          }
          vm.$http(params).then(res => {
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
      if(typeof vm.pageLoading != 'undefined'){
        vm.pageLoading = true
      }
      var params = {
        url: vm.pager.url,
        method: vm.pager.method,
      }
      var method = vm.pager.method
      if(method=='post'){
        params.data = vm.pagingFiltData(vm.pager)
      }else if(method=='get'){
        params.params = vm.pagingFiltData(vm.pager)
      }
      vm.$http2(params).then(res => {
        let resData = res.data
        resData = typeof resData == 'object' ? resData : JSON.parse(resData)
        if (resData.code == 1) {
          if(typeof vm.pageLoading != 'undefined'){
            vm.pageLoading = false
          }
          if (typeof vm.pagerResult == 'function') {
            // 返回数据预处理
            resData.data = vm.pagerResult(resData.data)
          }
          setTimeout(function(){
            vm.pager.data = resData.data
            vm.pager.total = resData.total
          },50)
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
      if (typeof obj.data != 'undefined') {
        delete obj.data
      }
      if (typeof obj.url != 'undefined') {
        delete obj.url
      }
      if (typeof obj.method != 'undefined') {
        delete obj.method
      }
      if (typeof obj.total != 'undefined') {
        delete obj.total
      }
      if (typeof obj.addMethod != 'undefined') {
        delete obj.addMethod
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
    createEditBtn (create, data, callback) {
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
            if(typeof callback == 'function'){
              callback(data)
            }else{
              vm.editRow(data)
            }
          }
        }
      }, '编辑')
    },
    editRow (data) {
      let vm = this
      let _data = {}
      for (let key in vm.formDialog) {
        _data[key] = data[key]
      }
      if (typeof vm.initDialog === 'function') {
        vm.initDialog(_data)
      }
      vm.formDialog = _data
      vm.currDialog = 'edit'
      vm.dialogShow = true
    },
    // 创建删除按钮
    createDelBtn (create, data, callback) {
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
                if(typeof callback == 'function'){
                  callback(idObj)
                }else{
                  vm.delRow(idObj)
                }
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
    // 创建预览按钮
    createPreviewBtn(create, data, callback){
      let vm = this
      return create('Button', {
        props: {
          type: 'success',
          size: 'small'
        },
        style: {
          marginRight: '5px'
        },
        on: {
          click: () => {
            if(typeof callback == 'function'){
              callback(data)
            }else{
              vm.$Message.error('预览请传回调函数')
            }
          }
        }
      }, '预览')
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
  watch: {
    dialogShow(val){
      if(!val && typeof this.resetDialogForm == 'function'){
        this.resetDialogForm()
      }
    }
  },
  created () {
    let vm = this
    if (typeof vm.initData === 'function') {
      vm.initData()
    }
    // 在这里修改pager会触发一次页面加载函数，所以不需要在下边再请求一次
    // 为什么dev的时候有时候会不进行数据初始化
    vm.initPager()
    vm.paging()
  }
}
export default page