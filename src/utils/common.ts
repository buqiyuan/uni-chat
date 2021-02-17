// import { ResponseResult } from '@/utils/request/types'
import dayjs from 'dayjs'

// 处理所有后端返回的数据
export function processReturn(res: any) {
  // code 0:成功 1:错误 2:后端报错
  const { code, msg, data } = res.data as ServerRes
  if (code) {
    uni.showToast({ title: msg, icon: 'none' })
    return
  }
  if (msg) {
    uni.showToast({ title: msg, icon: 'success' })
  }
  return data
}

// 判断一个字符串是否包含另外一个字符串
export function isContainStr(str1: string, str2: string) {
  return str2.indexOf(str1) >= 0
}

/**
 * 屏蔽词
 * @param text 文本
 */
export function parseText(text: string) {
  return text
}

/**
 * 判断是否URL
 * @param text 文本
 */
export function isUrl(text: string) {
  // 解析网址
  // eslint-disable-next-line no-useless-escape
  const UrlReg = new RegExp(/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/)
  return UrlReg.test(text)
}

/**
 * 消息时间格式化
 * @param time
 */
export function formatTime(time: number) {
  // 大于前天
  if (dayjs(time).add(2, 'day').isBefore(dayjs(), 'day')) {
    return dayjs(time).format('M/D HH:mm')
  }
  // 大于昨天
  if (dayjs(time).add(1, 'day').isBefore(dayjs(), 'day')) {
    return `前天 ${dayjs(time).format('HH:mm')}`
  }
  // 昨天
  if (dayjs(time).isBefore(dayjs(), 'day')) {
    return `昨天 ${dayjs(time).format('HH:mm')}`
  }
  // 大于五分钟不显示秒
  // if (new Date().valueOf() > time + 300000) {
  //   return moment(time).format('HH:mm');
  // }
  return dayjs(time).format('HH:mm')
}

/**
 * 群名/用户名校验
 * @param name
 */
export function nameVerify(name: string): boolean {
  const nameReg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
  if (name.length === 0) {
    uni.showToast({ title: '请输入名字', icon: 'none' })
    return false
  }
  if (!nameReg.test(name)) {
    uni.showToast({ title: '名字只含有汉字、字母、数字和下划线 不能以下划线开头和结尾', icon: 'none' })
    return false
  }
  if (name.length > 16) {
    uni.showToast({ title: '名字太长', icon: 'none' })
    return false
  }
  return true
}

/**
 * 密码校验
 * @param password
 */
export function passwordVerify(password: string): boolean {
  const passwordReg = /^\w+$/gis
  if (password.length === 0) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return false
  }
  if (!passwordReg.test(password)) {
    uni.showToast({ title: '密码只含有字母、数字和下划线', icon: 'none' })
    return false
  }
  if (password.length > 16) {
    uni.showToast({ title: '密码最多16位,请重新输入', icon: 'none' })
    return false
  }
  return true
}
