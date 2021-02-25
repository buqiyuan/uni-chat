import { onBeforeUnmount } from '@vue/composition-api'

/**
 * @param eventName 事件名称
 * @description 事件主线
 */
export const useEventBus = (eventName: string, callback: (...rest: any) => any) => {
  uni.$on(eventName, callback)
  // 组件销毁时，解除监听
  onBeforeUnmount(() => {
    uni.$off(eventName, callback)
  })
}
