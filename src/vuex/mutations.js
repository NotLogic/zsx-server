import util from '@/libs/util'
import { appRoutes } from '@/router/routes'
export function resetSearch (state, name) {
    
}
export function addRow (state, vm) {
  vm.currDialog = 'add'
  vm.dialogShow = true
}
export function editRow (state, payload) {
  for (let key in payload.vm.formDialog) {
    payload.vm.formDialog[key] = payload.data[key]
  }
  if (typeof payload.initDialog === 'function') {
    payload.initDialog(payload.data)
  }
  payload.vm.currDialog = 'edit'
  payload.vm.dialogShow = true
}
// 重置提交表单 预处理 + reset，公共的只有reset只有一行，就不放到vuex中了吧； 提交成功后要调用，从vuex中调用组件中的函数这样好吗？
export function resetDialogForm (state, payload) {
  payload.vm.$refs[payload.name].resetFields()
}
// 从路由中初始化左侧菜单数据
export function updateMenulist (state) {
  let menuList = []
  let _appRoutes = util.extend(appRoutes)
  console.log('state.accessArr: ',state.accessArr)
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
    if (item.meta && item.meta.access) {
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
          if (child.meta && child.meta.access) {
            return child
          }
        })
        menuList[len - 1].children = childrenArr
      }
    }
  })
  state.menuList = menuList
}
// 更新面包屑数组
export function setCurrentPath (state, pathArr) {
  state.currentPath = pathArr
}
// 新增标签（缓存页面的name）
export function increateTag (state, tagObj) {
  state.cachePage.push(tagObj.name)
  state.pageOpenedList.push(tagObj)
  sessionStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
}
// 移除标签
export function removeTag (state, name) {
  for (let i = 0; i < state.pageOpenedList.length; i++) {
    if (state.pageOpenedList[i].name === name) {
      state.pageOpenedList.splice(i, 1)
    }
  }
}
// 设置当前页name
export function setCurrentPageName (state, name) {
  state.currentPageName = name
}
export function setTagsList (state, list) {
  state.tagsList.push(...list)
}
// 关闭一个页面，该页面不再缓存
export function closePage (state, name) {
  for (let i = 0; i < state.cachePage.length; i++) {
    if (state.cachePage[i].name === name) {
      state.cachePage.splice(i, 1)
    }
  }
}
// 关闭所有（除主页home）
export function closeAllPage (state) {
  state.pageOpenedList.splice(1)
  state.cachePage = []
}
// 关闭其他页
export function closeOtherPage (state, currentPageName) {
  let arr = [[].concat(state.pageOpenedList)[0]]
  if (currentPageName === 'home') {
    state.pageOpenedList = arr
  } else {
    state.pageOpenedList = arr.concat(state.pageOpenedList.filter(item => {
      return item.name === currentPageName
    }))
  }
  state.cachePage = [currentPageName]
}
// 打开页面，缓存该页面 只在新增标签时才缓存页面
export function openPage (state, name) {
  // state.cachePage.push(name)
}
// 解决刷新时已经打开的页面数组状态丢失问题
export function updatePageOpenedList (state, arrList) {
  state.pageOpenedList = arrList
}
// 清空已打开的左侧菜单
export function clearOpenedSubmenu (state) {
  state.openedSubmenuArr = []
}
// 清空快捷导航菜单数组
export function clearPageOpenedList (state) {
  state.pageOpenedList.splice(1)
  sessionStorage.pageOpenedList = JSON.stringify(state.pageOpenedList)
}
// 清空面包屑
export function clearCurrentPath (state) {
  state.currentPath.splice(1)
  sessionStorage.currentPath = JSON.stringify(state.currentPath)
}
// 在main.vue中初始化pageOpenedList，解决刷新时状态丢失问题
export function setPageOpenedList (state, arr) {
  state.pageOpenedList = arr
}
// 将指定父级展开
export function setOpenedSubmenuArr (state, name) {
  state.openedSubmenuArr.push(name)
}
// 只展开一个
export function oneOpenedSubmenuArr (state, name) {
  state.openedSubmenuArr = [name]
}
// 关闭所有时清空左侧展开数组
export function clearAllOpenedSubmenuArr (state) {
  state.openedSubmenuArr = []
}
// 关闭其他时只剩一个
export function clearOtherOpenedSubmenuArr (state, name) {
  state.openedSubmenuArr = state.openedSubmenuArr.filter(item => {
    return item === name
  })
}
// 初始化每页的pager
export function initPager (state, vm) {
  let _data = util.extend(vm.pager)
  vm.pager = util.extend(state.pager)
  for (let key in _data) {
    vm.pager[key] = _data[key]
  }
}
// -----------------------  action 提交的mutation  -------------------------------
export function submitDialogForm (state) {
  console.log('state.pager.data: ',state.pager.data)
  console.log('新增或编辑')
}
export function submitSearch (state) {
  console.log('搜索操作')
}
export function delRow (state) {
    
}
