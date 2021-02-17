import { ref, onBeforeUnmount } from '@vue/composition-api'

/**
 * @description 获取用户网络状态
 */
export const useNetworkStatus = () => {
  const isConnected = ref<number>() // 当前是否有网络连接
  const networkType = ref<string>('WIFI') // 网络类型

  const onNetworkChange = (res: UniApp.OnNetworkStatusChangeSuccess) => {
    console.log(res.isConnected, 'res.isConnected')
    console.log(res.networkType, 'res.networkType')
    isConnected.value = res.isConnected
    networkType.value = res.networkType
  }

  // 监听用户网络变化
  uni.onNetworkStatusChange(onNetworkChange)
  // 组件卸载时取消监听
  onBeforeUnmount(() => {
    uni.offNetworkStatusChange(onNetworkChange)
  })

  // 获取用户网络类型
  uni.getNetworkType({
    success: function (res) {
      console.log(res.networkType, networkType)
      networkType.value = res.networkType
    },
  })

  return {
    isConnected,
    networkType,
  }
}
