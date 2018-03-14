import http from '@/libs/http'
import util from '@/libs/util'
export function submitDialogForm ({ commit, state }, payload) {
  // 成功后重置表单
  payload.vm.dialogShow = false
  payload.vm.resetDialogForm(payload.name)
  commit('submitDialogForm')
}
export function submitSearch ({ commit, state }, payload) {
  console.log(payload)
  commit('submitSearch')
}
export function delRow ({ commit, state }, payload) {
  let delAjaxData = {}
  let delRowKey = payload.delRowKey || 'id'
  if (typeof(payload) == 'object') {
    delAjaxData[delRowKey] = payload.delRowVal
  } else if (typeof(payload) == 'string') {
    delAjaxData[delRowKey] = payload
  }
  console.log(delAjaxData)
  commit('delRow')
}
// 获取用户权限数据
export function getAccessData ({ commit, state }) {
  // http.get('').then(res => {
  //   console.log('res: ', res)
  // })
}
