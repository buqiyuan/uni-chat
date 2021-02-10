import { nextTick, onMounted, ref, Ref } from '@vue/composition-api'

export interface IClientRect {
  bottom: number
  dataset: any
  height: number
  id: string
  left: number
  right: number
  top: number
  width: number
}

/**
 * @param selector {string} 元素选择器
 * @description 获取元素宽高等
 */
export const useClientRect = async (selector: string): Promise<Ref> => {
  const clientRect = ref<IClientRect>()

  const getTabBarHeight = () => {
    const info = uni.createSelectorQuery().select(selector)
    info
      .boundingClientRect((data) => {
        //data - 各种参数
        clientRect.value = data
      })
      .exec()
  }

  await nextTick(getTabBarHeight)
  setTimeout(getTabBarHeight, 1000)
  setTimeout(getTabBarHeight, 3000)

  return clientRect
}
