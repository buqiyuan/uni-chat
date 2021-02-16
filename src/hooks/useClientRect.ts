import { nextTick, ref, Ref } from '@vue/composition-api'

/**
 * @param selector {string} 元素选择器
 * @description 获取元素宽高等
 */
export const useClientRect = (selector: string): Ref<UniApp.NodeInfo> => {
  const clientRect = ref<UniApp.NodeInfo>({
    bottom: 0,
    context: undefined as any,
    dataset: undefined,
    height: 0,
    id: '',
    left: 0,
    right: 0,
    scrollLeft: 0,
    scrollTop: 0,
    top: 0,
    width: 0,
  })

  const getTabBarHeight = () => {
    const info = uni.createSelectorQuery().select(selector)
    info
      .boundingClientRect((data) => {
        //data - 各种参数
        clientRect.value = data
      })
      .exec()
  }

  nextTick(() => {
    getTabBarHeight()
    setTimeout(getTabBarHeight, 500)
  })

  return clientRect as Ref<UniApp.NodeInfo>
}
