const getters = {
  bodyHeight: (state: any): string => `calc(100vh - ${state.app.tabBarHeight + state.app.topBarHeight}px)`,
  keyboardHeight: (state: any): string => state.app.keyboardHeight + 'px', // 软键盘高度
}

export default getters
