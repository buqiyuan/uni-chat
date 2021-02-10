import { nextTick } from '@vue/composition-api'

/**
 * @description 获取路由query参数
 */
export const useUrlQuery = async () => {
  await nextTick()
  const routes: any = getCurrentPages() // 获取当前打开过的页面路由数组
  return routes[routes.length - 1].options //获取路由参数
}
