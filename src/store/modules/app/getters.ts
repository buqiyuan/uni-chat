import { GetterTree } from 'vuex'
import { minCache } from '@/utils/MinCache'
import { AppState } from './state'
import { RootState } from '@/store'

const getters: GetterTree<AppState, RootState> = {
  user(state) {
    const user = minCache.get('user')
    if (!user) {
      return {}
    }
    state.user = user
    return state.user
  },
  mobile(state) {
    return state.mobile
  },
  background(state) {
    return localStorage.getItem('background')
  },
  activeTabName(state) {
    return state.activeTabName
  },
  token(state) {
    return state.token
  },
  apiUrl(state) {
    return state.apiUrl
  },
  loading(state) {
    return state.loading
  },
}

export default getters
