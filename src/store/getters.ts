const getters = {
  bodyHeight: (state: any): string => `calc(100vh - ${state.app.tabBarHeight + state.app.topBarHeight}px)`,
}

export default getters
