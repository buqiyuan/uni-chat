import { nextTick, ref, Ref } from '@vue/composition-api'

/**
 * @param selector {string} 元素选择器
 * @description 获取元素宽高等
 */
export const useClientRect = async (selector: string): Promise<Ref<UniApp.NodeInfo>> => {
  const clientRect = ref<UniApp.NodeInfo>()

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

  return clientRect as Ref<UniApp.NodeInfo>
}
