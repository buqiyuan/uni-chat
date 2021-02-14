<template>
  <view class="message-item" @tap="nav2chat">
    <image class="message-logo" :lazy-load="true" :src="messageItem.logo" />
    <view class="message-body">
      <view class="message-head">
        <view class="message-title">
          {{ messageItem.title }}
        </view>
        <view class="message-time">
          {{ dayjs(messageItem.lastTime).format('DD/MM') }}
        </view>
      </view>
      <view class="message-footer">
        <view class="new-message">
          {{ messageItem.message }}
        </view>
        <view class="message-unread">
          {{ messageItem.unread }}
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, PropType, SetupContext } from '@vue/composition-api'
import dayjs from 'dayjs'

interface IProps {
  messageItem: Group
}

export default defineComponent({
  name: 'group-item',
  props: {
    messageItem: {
      type: Object as PropType<Group>,
      default: () => ({}),
    },
  },
  setup(props: IProps, ctx: SetupContext) {
    const nav2chat = () => {
      ctx.root.$Router.push({
        name: 'chat',
        params: {
          id: props.messageItem.groupId,
        },
      })
    }

    return {
      nav2chat,
      dayjs,
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
  }

  .message-body {
    flex: auto;
    display: flex;
    flex-direction: column;
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
