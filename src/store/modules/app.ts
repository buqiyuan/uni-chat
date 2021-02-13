export interface AppIState {
  tabBarHeight: number
  topBarHeight: number
  keyboardHeight: number
}

export const app = {
  namespaced: true,
  state: (): AppIState => ({
    tabBarHeight: 0, // 底部tab栏高度
    topBarHeight: 0, // 顶部状态栏 + 标题栏高度
    keyboardHeight: 0, // 软键盘高度
  }),
  mutations: {
    setTabBarHeight(state: AppIState, height: number): void {
      // 这里的 `state` 对象是模块的局部状态
      state.tabBarHeight = height
    },
    setTopBarHeight(state: AppIState, height: number): void {
      // 这里的 `state` 对象是模块的局部状态
      state.topBarHeight = height
    },
    setKeyboardHeight(state: AppIState, height: number): void {
      // 这里的 `state` 对象是模块的局部状态
      state.keyboardHeight = height
    },
  },
}
