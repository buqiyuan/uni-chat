<template>
  <view>
    <view class="message-item" @tap.stop="nav2chat">
      <view class="group-avatar">
        <template v-for="memberItem in messageItem.members.slice(0, 4)">
          <image :key="memberItem.userId" class="avatar-item" :lazy-load="true" :src="apiUrl + memberItem.avatar" />
        </template>
      </view>
      <view class="message-body">
        <view class="message-head">
          <view class="message-title">
            {{ messageItem.groupName }}
          </view>
          <view v-if="lastMessage" class="message-time">
            {{ formatTime(lastMessage.time) }}
          </view>
        </view>
        <view v-if="lastMessage" class="message-footer">
          <view class="new-message">
            {{ lastMessage.username }}:
            <rich-text class="message-content" :nodes="lastMessage.content"></rich-text>
          </view>
          <view v-if="messageItem.unread" class="message-unread">
            {{ messageItem.unread }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watchEffect, SetupContext } from '@vue/composition-api'
import store from '@/store'
import { formatTime } from '@/utils/common'

interface IProps {
  messageItem: Group
}

export default defineComponent({
  name: 'GroupItem',
  props: {
    messageItem: {
      type: Object as PropType<Group>,
      default: () => ({}),
    },
  },
  setup(props: IProps, { root }: SetupContext) {
    console.log(props.messageItem, 'group-item')
    const lastMessage = ref<GroupMessage>()

    watchEffect(() => {
      lastMessage.value = props.messageItem.messages?.slice(-1)[0]
    })

    // 服务器地址
    const apiUrl = computed((): string => store.getters['app/apiUrl'])
    // TODO 最新的一条消息（APP端检测不到值的变化。。。）
    // const lastMessage = computed((): GroupMessage => props.messageItem.messages?.slice(-1)[0] as GroupMessage)

    const nav2chat = () => {
      root.$Router.push({
        name: 'chat',
        params: {
          id: props.messageItem.groupId,
          chatType: 'group',
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

  .group-avatar {
    @include el-to-circle(92);
    flex-shrink: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    .avatar-item {
      width: 50%;
      height: 50%;
    }
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
        .message-content {
          display: inline-block;
        }
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
