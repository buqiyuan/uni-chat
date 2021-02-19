/**
 * @description 获取应用目录
 * 应用私有资源目录，对应常量1: plus.io.PRIVATE_WWW，仅应用自身可读
    应用私有文档目录，对应常量2: plus.io.PRIVATE_DOC，仅应用自身可读写
    应用公共文档目录，对应常量3: plus.io.PUBLIC_DOCUMENTS，多应用时都可读写，常用于保存应用间共享文件
    应用公共下载目录，对应常量4: plus.io.PUBLIC_DOWNLOADS，多应用时都可读写，常用于保存下载文件
 */
export const getFilePath = (constant: 1 | 2 | 3 | 4): Promise<PlusIoFileSystem> => {
  return new Promise((resolve, reject) => {
    plus.io.requestFileSystem(
      constant,
      (fs) => {
        console.log(fs.root?.fullPath, 'Request file system success!')
        // 可通过fs进行文件操作
        resolve(fs)
      },
      (e) => {
        reject(e)
        console.log('获取文件: ' + e.message)
      }
    )
  })
}
