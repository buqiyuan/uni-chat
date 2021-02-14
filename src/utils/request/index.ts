import MinRequest from './MinRequest'
import { minCache } from '@/utils/MinCache'

const minRequest = new MinRequest()

// 请求拦截器
minRequest.interceptors.request((request) => {
  const token = minCache.get('token')
  // const userInfo = uni.getStorageSync('userInfo')
  if (token) {
    // 全局 token
    request.header.token = token
  }
  if (request.contentType == 'fd') {
    request.header['Content-Type'] = 'multipart/form-data'
    const fd = new FormData()
    Object.keys(request.data).forEach((key) => fd.append(key, request.data[key]))
    request.data = fd
  } else if (request.contentType == 'fd') {
    request.header['Content-Type'] = 'multipart/form-data'
  }

  return request
})

// 响应拦截器
minRequest.interceptors.response((response) => {
  if (response.statusCode == 401) {
    uni.showModal({
      showCancel: false,
      content: response.data.msg,
      success: (res) => {
        if (res.confirm) {
          uni.redirectTo({
            url: '/pages/login/login',
          })
        }
      },
    })
  }
  return response
})

// 设置默认配置
minRequest.setConfig((config) => {
  // config.baseURL = 'http://192.168.1.157:9000/v1'
  config.baseURL = process.env.VUE_APP_API_URL || 'http://192.168.31.195:3000'
  return config
})

export default minRequest
