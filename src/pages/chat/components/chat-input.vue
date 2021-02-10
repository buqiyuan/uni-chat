<template>
  <view class="chat-input">
    <view class="input-msg">
      <!-- 聊天输入框 -->
      <textarea v-model="message" class="textarea" auto-height maxlength="1000" @blur="bindTextAreaBlur" />
      <button class="send-btn" :class="{ 'send-enable': message }" type="primary" size="mini" @tap="sendMessage">
        发送
      </button>
    </view>
    <view>
      <!-- 底部聊天工具栏 -->
      <chat-input-tools />
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import ChatInputTools from '@/components/chat-input-tools/index.vue'

export default defineComponent({
  name: 'ChatInput',
  components: { ChatInputTools },
  setup() {
    const state = reactive({
      message: '',
    })

    const bindTextAreaBlur = () => {
      console.log('失去焦点')
    }

    // 发送消息
    const sendMessage = () => {
      state.message = ''
    }

    return {
      ...toRefs(state),
      bindTextAreaBlur,
      sendMessage,
    }
  },
})
</script>

<style lang="scss" scoped>
.chat-input {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  background-color: #eaedf4;

  .input-msg {
    display: flex;
    padding: rpx(12) rpx(18) 0;
    .textarea {
      width: calc(100% - #{rpx(112)});
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
