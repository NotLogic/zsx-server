import util from '@/libs/util'
import { appRoutes } from '@/router/routes'
export default {
  exitToLogin (state, vm) {
    // localStorage的用户信息只有再用户不保存时删除
    if (sessionStorage.user) {
      sessionStorage.removeItem('user')
    }
    vm.$router.push({
      name: 'login'
    })
  },
  resetSearch (state, name) {
    this.resetForm(name)
    // 搜索dispatch
  },
  addRow (state, vm) {
    vm.dialogShow = true
  },
  editRow (state, payload) {
    for (let key in payload.vm.formDialog) {
      // 有些值需要number类型，数据类型不要转换
      // if (typeof payload.data[key] === 'number') {
      //   payload.vm.formDialog[key] = payload.data[key].toString()
      // } else {
      //   payload.vm.formDialog[key] = payload.data[key]
      // }
      payload.vm.formDialog[key] = payload.data[key]
    }
    if (typeof payload.initDialog === 'function') {
      payload.initDialog(payload.data)
    }
    payload.vm.dialogShow = true
  },
  // 重置提交表单 预处理 + reset，公共的只有reset只有一行，就不放到vuex中了吧； 提交成功后要调用，从vuex中调用组件中的函数这样好吗？
  resetDialogForm (state, payload) {
    payload.vm.$refs[payload.name].resetFields()
  },
  // 获取用户权限数据
  getAccessData (state) {
    // http.get('').then(res => {
    //   console.log('res: ', res)
    // })
  },
  // 从路由中初始化左侧菜单数据
  updateMenulist (state) {
    let menuList = []
    let _appRoutes = util.extend(appRoutes)
    _appRoutes.forEach((item, index) => {
      // 根据 accessArr 改变item.meta.access
      if (state.accessArr.length) { // 更改所有的父路由
        state.accessArr.forEach(accessArrItem => {
          if (item.name === accessArrItem.pageName) {
            item.meta.access = accessArrItem.access
          }
        })
      }
      // 父元素access为1
      if (item.meta.access !== 'undefined' && item.meta.access) {
        if (item.children.length && state.accessArr.length) {
          state.accessArr.forEach(accessArrItem => {
            item.children.forEach(child => {
              if (child.name === accessArrItem.pageName) {
                child.meta.access = accessArrItem.access
              }
            })
          })
        }
        if (item.children.length === 1) {
          if (item.children[0].meta.access) {
            menuList.push(item)
          }
        } else {
          //  子路由不只一个
          let len = menuList.push(item) // 为什么这里的menuList.push(item)===length
          let childrenArr = []
          childrenArr = item.children.filter(child => {
            if (child.meta.access !== 'undefined' && child.meta.access) {
              return child
            }
          })
          menuList[len - 1].children = childrenArr
        }
      }
    })
    state.menuList = menuList
  },
  // 更新面包屑数组
  setCurrentPath (state, pathArr) {
    state.currentPath = pathArr
  },
  // 新增标签（缓存页面的name）
  increateTag (state, tagObj) {
    state.cachePage.push(tagObj.name)
    state.pageOpenedList.push(tagObj)
    sessionStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  // 移除标签
  removeTag (state, name) {
    for (let i = 0; i < state.pageOpenedList.length; i++) {
      if (state.pageOpenedList[i].name === name) {
        state.pageOpenedList.splice(i, 1)
      }
    }
  },
  // 设置当前页name
  setCurrentPageName (state, name) {
    state.currentPageName = name
  },
  setTagsList (state, list) {
    state.tagsList.push(...list)
  },
  // 关闭一个页面，该页面不再缓存
  closePage (state, name) {
    for (let i = 0; i < state.cachePage.length; i++) {
      if (state.cachePage[i].name === name) {
        state.cachePage.splice(i, 1)
      }
    }
  },
  // 关闭所有（除主页home）
  closeAllPage (state) {
    state.pageOpenedList.splice(1)
    state.cachePage = []
  },
  // 关闭其他页
  closeOtherPage (state, currentPageName) {
    let arr = [[].concat(state.pageOpenedList)[0]]
    if (currentPageName === 'home') {
      state.pageOpenedList = arr
    } else {
      state.pageOpenedList = arr.concat(state.pageOpenedList.filter(item => {
        return item.name === currentPageName
      }))
    }
    state.cachePage = [currentPageName]
  },
  // 打开页面，缓存该页面 只在新增标签时才缓存页面
  openPage (state, name) {
    // state.cachePage.push(name)
  },
  // 解决刷新时已经打开的页面数组状态丢失问题
  updatePageOpenedList (state, arrList) {
    state.pageOpenedList = arrList
  },
  // 清空已打开的左侧菜单
  clearOpenedSubmenu (state) {
    state.openedSubmenuArr = []
  },
  // 清空快捷导航菜单数组
  clearPageOpenedList (state) {
    state.pageOpenedList.splice(1)
    sessionStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
  },
  // 清空面包屑
  clearCurrentPath (state) {
    state.currentPath.splice(1)
    sessionStorage.currentPath = JSON.stringify(state.currentPath)
  },
  // 在main.vue中初始化pageOpenedList，解决刷新时状态丢失问题
  setPageOpenedList (state, arr) {
    state.pageOpenedList = arr
  }
}
