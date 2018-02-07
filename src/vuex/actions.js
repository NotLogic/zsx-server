import http from '@/libs/http'
import util from '@/libs/util'
export default {
  paging ({commit, state}, payload) {
    if (typeof payload === 'string') {
      state.pager.url = payload
    }
    let ajaxType = 'post'
    if (typeof payload === 'object') {
      for (let key in payload) {
        if (key === 'method' || key === 'type') {
          ajaxType = payload[key]
          continue
        }
        state.pager[key] = payload[key]
      }
    }
    http({
      url: state.pager.url,
      method: ajaxType,
      data: util.pagingFiltData(util.extend(state.pager))
    }).then(res => {
      if (res.data) {
        commit('paging', util.extend(res.data))
      }
    })
  },
  submitDialogForm (context, payload) {
    // 成功后重置表单
    payload.vm.dialogShow = false
    payload.vm.resetDialogForm(payload.name)
  },
  submitSearch (context, payload) {
    console.log(payload)
  },
  delRow (context, payload) {
    console.log(payload)
  }
}
