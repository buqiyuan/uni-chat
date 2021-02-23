import { MutationTree } from 'vuex'
import { minCache } from '@/utils/MinCache'
import {
  SET_USER,
  CLEAR_USER,
  SET_TOKEN,
  SET_MOBILE,
  SET_BACKGROUND,
  SET_ACTIVETABNAME,
  SET_LOADING,
  SET_KEYBOARD_HEIGHT,
} from './mutation-types'
import { AppState } from './state'

const mutations: MutationTree<AppState> = {
  [SET_USER](state, payload: User) {
    state.user = payload
    // 数据持久化
    minCache.set('user', payload, 3650 * 1000)
  },

  [CLEAR_USER](state) {
    state.user = {
      userId: '',
      username: '',
      password: '',
      avatar: '',
      createTime: 0,
    }
    minCache.set('user', '')
    minCache.set('token', '')
  },

  [SET_TOKEN](state, payload) {
    state.token = payload
    minCache.set('token', payload, 3 * 3600)
  },

  [SET_MOBILE](state, payload: boolean) {
    state.mobile = payload
  },

  [SET_BACKGROUND](state, payload: string) {
    state.background = payload
    localStorage.setItem('background', payload)
  },
  [SET_ACTIVETABNAME](state, payload: 'message' | 'contacts') {
    state.activeTabName = payload
  },
  [SET_LOADING](state, payload: boolean) {
    state.loading = payload
  },
  [SET_KEYBOARD_HEIGHT](state, height: number): void {
    // 这里的 `state` 对象是模块的局部状态
    state.keyboardHeight = height
  },
}

export default mutations
