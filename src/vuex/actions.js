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
    console.log(util.pagingFiltData(util.extend(state.pager)))
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
    console.log(payload)
    commit('delRow')
  }
}
