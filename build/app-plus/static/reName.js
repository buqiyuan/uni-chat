const fs = require('fs')
const path = require('path')
const basePath = path.join(__dirname, './chat_tools')
const fileList = fs.readdirSync(basePath)
fileList.forEach((fileItem) => {
  try {
    const reName = fileItem.replace('chat_tool_', '')
    fs.renameSync(`${basePath}\\${fileItem}`, `${basePath}\\${reName}`)
  } catch (e) {
    console.log(e)
  }
})
