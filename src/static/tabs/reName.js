const fs = require('fs')
const path = require('path')

const fileList = fs.readdirSync('./')
fileList.forEach((fileItem) => {
  try {
    fs.renameSync(fileItem, fileItem.replace('skin_tab_icon_', ''))
  } catch (e) {
    console.log(e)
  }
})
