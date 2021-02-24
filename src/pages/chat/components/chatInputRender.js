import { isH5 } from '@/utils/platform'

export default {
  data() {
    return {
      lastEditRange: 0,
      domParser: null,
    }
  },
  mounted() {
    document.onselectionchange = this.getCursorPosition
  },
  methods: {
    // 获取光标位置
    getCursorPosition() {
      // 获取选定对象
      const selection = getSelection()
      // 设置最后光标对象
      this.lastEditRange = selection.getRangeAt(0)
      // console.log(this.lastEditRange, '最后的光标位置')
    },
    // 发送数据到逻辑层
    receiveEmoji(newValue, oldValue, ownerVm, vm) {
      const editorEl = document.querySelector('#input-box .ql-editor')
      const selection = window.getSelection ? window.getSelection() : document.getSelection()
      if (isH5) {
        editorEl.focus()
      }
      if (this.lastEditRange) {
        // 存在最后光标对象，选定对象清除所有光标并添加最后光标还原之前的状态
        selection.removeAllRanges()
        selection.addRange(this.lastEditRange)
      }
      const range = selection.getRangeAt(0)
      console.log(selection.createRange, 'selection.createRange')
      const hasR = range.createContextualFragment(newValue)
      let hasR_lastChild = hasR.lastChild
      while (
        hasR_lastChild &&
        hasR_lastChild.nodeName.toLowerCase() === 'br' &&
        hasR_lastChild.previousSibling &&
        hasR_lastChild.previousSibling.nodeName.toLowerCase() === 'br'
      ) {
        const e = hasR_lastChild
        hasR_lastChild = hasR_lastChild.previousSibling
        hasR.removeChild(e)
      }
      range.insertNode(hasR)
      if (hasR_lastChild) {
        range.setEndAfter(hasR_lastChild)
        range.setStartAfter(hasR_lastChild)
      }
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      // 无论如何都要记录最后光标对象
      this.lastEditRange = selection.getRangeAt(0)
      // ownerVm?.callMethod('onBlur')
    },
  },
}
