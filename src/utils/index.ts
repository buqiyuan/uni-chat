import RequireContext = __WebpackModuleApi.RequireContext

/**
 * @description防抖函数
 * @param fn
 * @param wait
 */
export const debounce = (fn: (...rest: any) => any, wait: number) => {
  let timer: number | null = null
  return function () {
    if (timer != null) {
      clearTimeout(timer)
    }
    timer = setTimeout(fn, wait)
  }
}
/**
 * @description 处理首字母大写 abc => Abc
 * @param str
 */
export const changeStr = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * @description 批量导入文件
 * @param {Object} context 上下文对象
 * @param {RegExp} reg 匹配规则
 * @returns {Object} 对象
 */
export const importAllModule = (context: RequireContext, reg = /\.vue$/) => {
  return context.keys().reduce((compObj: any, fileName) => {
    const compName = changeStr(fileName.replace(/^\.\//, '').replace(/\.\w+$/, ''))
    compObj[compName] = context(fileName).default || context(fileName)
    return compObj
  }, {})
}
