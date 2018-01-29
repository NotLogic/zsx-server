// import http from '@/libs/http'
export default {
  paging (state, currPage) {
    console.log(currPage)
  },
  submitDialogForm (state, payload) {
    // 成功后重置表单
    state.dialogShow = false
    payload.vm.resetDialogForm(payload.name)
  },
  submitSearch (state, name) { },
  delRow (state, payload) {
    console.log(payload)
  }
}
