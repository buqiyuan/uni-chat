import { Module } from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import state, { AppState } from './state'
import { RootState } from '@/store'

const app: Module<AppState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

export default app
