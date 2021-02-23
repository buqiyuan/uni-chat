import { minCache } from '@/utils/MinCache'

export interface AppState {
  user: User
  token: string
  mobile: boolean
  background: string
  activeTabName: 'message' | 'contacts'
  apiUrl: string
  loading: boolean
  keyboardHeight: number
}

const appState: AppState = {
  user: {
    userId: '',
    username: '',
    password: '',
    avatar: '',
    createTime: 0,
  },
  token: minCache.get('token') || '',
  mobile: false,
  background: '',
  activeTabName: 'message',
  apiUrl: process.env.VUE_APP_API_URL!, // 后台api地址
  loading: false, // 全局Loading状态
  keyboardHeight: 0, // 软键盘高度
}

export default appState
