import http from '@/libs/http'
import util from '@/libs/util'
export default {
  submitDialogForm ({ commit, state }, payload) {
    // 成功后重置表单
    payload.vm.dialogShow = false
    payload.vm.resetDialogForm(payload.name)
    commit('submitDialogForm')
  },
  submitSearch ({ commit, state }, payload) {
    console.log(payload)
    commit('submitSearch')
  },
  delRow ({ commit, state }, payload) {
    commit('delRow')
  }
}
