import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import * as getters from './gettets'
import * as mutations from './mutations'

window.Vuex || Vue.use(Vuex)

export default new Vuex({
  state,
  getters,
  mutations
})
