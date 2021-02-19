<template>
  <view>
    <view :class="{ mask: isOpenTools }" @tap="closePanel"></view>
    <view class="chat-input">
      <view class="input-msg">
        <editor
          id="input-box"
          :emoji="emoji"
          :change:emoji="renderScript.receiveEmoji"
          @input="changeText"
          @ready="onEditorReady"
          @focus.prevent="onfocus"
          @touchstart="showKeyboard"
          @tap="renderScript.getCursorPosition"
        >
        </editor>
        <button
          class="send-btn"
          :class="{ 'send-enable': message.length > 11 }"
          type="primary"
          size="mini"
          @tap="preSendMessage"
        >
          发送
        </button>
      </view>
      <view>
        <!-- 底部聊天工具栏 -->
        <chat-input-tools v-model="isOpenTools" />
      </view>
    </view>
  </view>
</template>

<script>
import { defineComponent, reactive, toRefs, provide } from '@vue/composition-api'
import ChatInputTools from '@/components/chat-input-tools/index.vue'
import { useSendMessage } from './useSendMessage'
import { isH5 } from '@/utils/platform'
import { webSite } from '@/common/constant'

export default defineComponent({
  name: 'ChatInput',
  components: { ChatInputTools },
  setup(_, { emit, root }) {
    const state = reactive({
      emoji: '', // 选择表情
      message: '',
      isOpenTools: false, // 是否打开工具面板
      editorContext: null, // 文本框对象
    })
    const { chatType } = root.$Route.query

    const { sendMessage } = useSendMessage()

    // 设置表情
    provide('set-emoji', (emoji) => {
      state.emoji = `<img width="20" height="20" src="${webSite}${emoji}">`
    })

    const onBlur = () => {
      // uni.hideKeyboard()
    }

    // 输入框聚焦
    const onfocus = () => {
      // state.isOpenTools = false
      uni.getSelectedTextRange({
        success: (res) => {
          console.log('getSelectedTextRange res', res.start, res.end)
        },
        fail: (err) => {
          console.log('getSelectedTextRange err', err)
        },
      })
    }

    // 显示键盘并关闭面板
    const showKeyboard = () => {
      if (!isH5) {
        closePanel()
      }
    }

    // 输入文本
    const changeText = (e) => {
      state.message = e.detail?.html || ''
      // state.message = inputBoxRef.value!.$el.innerHTML
    }
    function onEditorReady() {
      // #ifdef APP-PLUS || H5 ||MP-WEIXIN
      uni
        .createSelectorQuery()
        .select('#input-box')
        .context((res) => {
          state.editorContext = res.context
          state.editorContext.setContents({ html: state.message })
          console.log(res, 'shen')
        })
        .exec()
      // #endif
    }

    // 关闭面板
    const closePanel = () => {
      state.isOpenTools = false
      uni.hideKeyboard()
    }

    // 发送消息之前做一些处理校验
    const preSendMessage = () => {
      state.editorContext.getContents({
        success: async (res) => {
          const text = res.html
          // console.log(text, '将要发送的文本消息，这里用的是富文本')
          if (text.trim().length < 8) {
            console.log('不能发送空消息!')
            // uni.showToast('不能发送空消息!')
            return
          }

          if (chatType === 'group') {
            await sendMessage({ type: 'group', message: text, messageType: 'text' })
          } else {
            await sendMessage({ type: 'friend', message: text, messageType: 'text' })
          }
          state.editorContext.clear({})
          emit('send-message')
        },
      })
    }

    return {
      ...toRefs(state),
      onEditorReady,
      showKeyboard,
      onfocus,
      closePanel,
      changeText,
      onBlur,
      preSendMessage,
    }
  },
})
</script>

<script module="renderScript" lang="renderjs">
import a from './chatInputRender.js'
export default a
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 88;
}
.chat-input {
  position: fixed;
  bottom: var(--keyboard-eight, 0);
  left: 0;
  right: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  background-color: #eaedf4;
  caret-color: #00c9fd;

  .input-msg {
    display: flex;
    padding: rpx(12) rpx(18) 0;
    #input-box {
      //width: calc(100% - #{rpx(112)});
      min-height: unset;
      height: unset;
      padding: rpx(10) rpx(18);
      background-color: white;
      border-radius: rpx(32);
    }
    .send-btn {
      display: flex;
      flex-shrink: 0;
      margin-left: rpx(12);
      align-items: center;
      align-self: flex-end;
      padding: 0 rpx(28);
      border-radius: rpx(32);
      height: min-content;
      background-color: #b1effe;
      &::after {
        border: none;
      }
      &.send-enable {
        background-color: #00c9fd;
      }
    }
  }
}
</style>
