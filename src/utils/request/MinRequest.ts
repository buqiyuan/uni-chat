import { RequestOptions, RequestConfig, ResponseResult } from './types'
import { isAppPlus } from '@/utils/platform'
const config = Symbol('config')
const isCompleteURL = Symbol('isCompleteURL')
const requestBefore = Symbol('requestBefore')
const requestAfter = Symbol('requestAfter')

class MinRequest {
  [config]: RequestConfig = {
    baseURL: '',
    header: {
      'content-type': 'application/json',
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text',
  }

  interceptors = {
    request: (func: (...arg: any) => RequestConfig) => {
      if (func) {
        MinRequest[requestBefore] = func
      } else {
        MinRequest[requestBefore] = (request) => request
      }
    },
    response: (func: (...arg: any) => any) => {
      if (func) {
        MinRequest[requestAfter] = func
      } else {
        MinRequest[requestAfter] = (response) => response
      }
    },
  }

  static [requestBefore](config: RequestConfig) {
    return config
  }

  static [requestAfter](response: ResponseResult) {
    return response
  }

  static [isCompleteURL](url: string) {
    return /(http|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  setConfig(func: (config: RequestConfig) => any) {
    this[config] = func(this[config])
  }

  request(options: RequestOptions) {
    options.baseURL = options.baseURL || this[config].baseURL
    options.dataType = options.dataType || this[config].dataType
    // #ifdef MP-WEIXIN
    if (options.data) {
      const newData = {}
      Object.keys(options.data).forEach((key) => {
        // @ts-ignore
        if (options.data[key] != undefined) {
          // @ts-ignore
          newData[key] = options.data[key]
        }
      })
      options.data = newData
    }
    // #endif
    options.header = {
      ...options.header,
      ...this[config].header,
    }

    options.method = options.method?.toUpperCase() || this[config].method.toUpperCase()

    options = {
      ...options,
      ...MinRequest[requestBefore](options),
    }
    options.url = MinRequest[isCompleteURL](options.url) ? options.url : options.baseURL + options.url

    return new Promise((resolve, reject) => {
      options.success = function (res) {
        resolve(MinRequest[requestAfter](res))
      }
      options.fail = function (err) {
        reject(MinRequest[requestAfter](err))
      }
      if (isAppPlus && options.method == 'PATCH') {
        // @ts-ignore
        const xhr = new plus.net.XMLHttpRequest()
        xhr.onload = function (e: any) {
          console.log('onreadystatechange: ' + JSON.stringify(e))
        }
        xhr.onerror = function () {
          console.log('onreadystatechange: ' + xhr.readyState)
        }
        xhr.open('PATCH', 'http://demo.dcloud.net.cn/test/xhr/post.php')
        const data = { name: 'HBuilder', version: '0.1.0' }
        xhr.setRequestHeader('Content-Type', 'application/json')
        // 发送HTTP请求
        xhr.send(JSON.stringify(data))
      } else {
        uni.request(options)
      }
    })
  }

  get(url: string, data = {}, options = {} as RequestOptions) {
    options.url = url
    options.data = data
    options.method = 'GET'
    return this.request(options)
  }

  post(url: string, data = {}, options = {} as Partial<RequestOptions>) {
    options.url = url
    options.data = data
    options.method = 'POST'
    return this.request(options as RequestOptions)
  }

  patch(url: string, data = {}, options = {} as Partial<RequestOptions>) {
    options.url = url
    options.data = data
    options.method = 'PATCH'
    return this.request(options as RequestOptions)
  }

  put(url: string, data = {}, options = {} as Partial<RequestOptions>) {
    options.url = url
    options.data = data
    options.method = 'PUT'
    return this.request(options as RequestOptions)
  }

  delete(url: string, data = {}, options = {} as Partial<RequestOptions>) {
    options.url = url
    options.data = data
    options.method = 'DELETE'
    return this.request(options as RequestOptions)
  }
}

export default MinRequest
