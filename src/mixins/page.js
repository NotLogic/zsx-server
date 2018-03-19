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
      // 主弹出框正在提交数据
      dialogSubmitLoading: false,
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
        'uploadExcel': '导入Excel'
      },
      mixinPager: {
        'url': '',
        'currPage': 1,
        'method': 'post',
        'order': '',
        'pagesize': 10,
        'sort': '',
        'total': 0,
        'data': []
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
      this.$store.dispatch('submitSearch', {
        'vm': this,
        'name': name
      })
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
          console.log("ajaxData: ",ajaxData)
          console.log("ajaxUrl: ",ajaxUrl)
          vm.$store.dispatch('submitDialogForm', {
            'vm': vm,
            'name': name
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
      // vm.$http({
      //   url: vm.pager.url,
      //   method: vm.pager.method,
      //   data: vm.pagingFiltData(vm.pager)
      // }).then(res => {
      //   if (res.data.data.code == 1) {
      //     let _data = res.data.data
      //     vm.pager.data = _data.data
      //     vm.pager.total = _data.total
      //   }
      // })
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
            for (let key in vm.formDialog) {
              vm.formDialog[key] = data[key]
            }
            if (typeof vm.initDialog === 'function') {
              vm.initDialog(data)
            }
            vm.currDialog = 'edit'
            vm.dialogShow = true
          }
        }
      }, '编辑')
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
                vm.$store.dispatch('delRow', data)
              }
            })
          }
        }
      }, '删除')
    },
    // 初始化pager 组件中pager的键覆盖mixinPager的键
    initPager (data) {
      let vm = this
      let pager = deepcopy(vm.pager)
      let mixinPager = deepcopy(vm.mixinPager)
      for(let key in pager) {
        mixinPager[key] = pager[key]
      }
      vm.pager = mixinPager
      console.log('vm.pager: ',vm.pager)
    }
  },
  computed: {},
  created () {
    let vm = this
    if (typeof vm.initData === 'function') {
      vm.initData()
    }
    vm.$store.commit('initPager', vm)
    vm.initPager()
    vm.paging()
  },
  mounted () {}
}
export default page