import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

import getters from '@/store/getters'
import { app } from './modules/app'
import { message } from './modules/message'

const store = new Vuex.Store({
  getters,
  modules: {
    app,
    message,
  },
})

export default store

type Store = typeof store

export const userStore = (): Store => {
  return store
}
