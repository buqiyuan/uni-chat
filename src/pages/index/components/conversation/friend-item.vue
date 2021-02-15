<template>
  <view class="message-item" @tap="nav2chat">
    <image class="message-logo" :lazy-load="true" :src="apiUrl + messageItem.avatar" />
    <view class="message-body">
      <view class="message-head">
        <view class="message-title">
          {{ messageItem.username }}
        </view>
        <view class="message-time">
          {{ formatTime(lastMessage.time) }}
        </view>
      </view>
      <view class="message-footer">
        <view class="new-message">
          {{ lastMessage.content }}
        </view>
        <view v-if="messageItem.unread" class="message-unread">
          {{ messageItem.unread }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType, SetupContext, computed, ref, watchEffect } from '@vue/composition-api'
import { formatTime } from '@/utils/common'
import store from '@/store'

interface IProps {
  messageItem: Friend
}

export default defineComponent({
  name: 'FriendItem',
  props: {
    messageItem: {
      type: Object as PropType<Friend>,
      default: () => ({}),
    },
  },
  setup(props: IProps, ctx: SetupContext) {
    console.log(props.messageItem, 'friend-item')
    const lastMessage = ref<FriendMessage>()

    watchEffect(() => {
      lastMessage.value = props.messageItem.messages?.slice(-1)[0]
    })
    // 服务器地址
    const apiUrl = computed((): string => store.getters['app/apiUrl'])
    //TODO 最新的一条消息（APP端检测不到值的变化。。。）
    // const lastMessage = computed((): FriendMessage => props.messageItem?.messages?.slice(-1)[0] as FriendMessage)

    const nav2chat = () => {
      ctx.root.$Router.push({
        name: 'chat',
        params: {
          id: props.messageItem.userId,
        },
      })
    }

    return {
      apiUrl,
      lastMessage,
      nav2chat,
      formatTime,
    }
  },
})
</script>

<style lang="scss" scoped>
.message-item {
  display: flex;
  width: 100%;
  padding: rpx(26) rpx(22);
  @include click-bg-active();

  .message-logo {
    @include el-to-circle(92);
    flex-shrink: 0;
  }

  .message-body {
    flex: auto;
    display: flex;
    flex-direction: column;
    min-width: 0;
    margin: 0 rpx(16);

    .message-head {
      display: flex;
      justify-content: space-between;

      .message-title {
        font-size: rpx(34);
      }

      .message-time {
        font-size: rpx(26);
      }
    }

    .message-footer {
      display: flex;
      justify-content: space-between;

      .new-message {
        font-size: rpx(28);
        color: #d3dae2;
        @include text-ellipsis();
      }

      .message-unread {
        padding: rpx(6) rpx(14);
        font-size: rpx(26);
        background-color: #d3dae2;
        border-radius: rpx(28);
      }
    }
  }
}
</style>
