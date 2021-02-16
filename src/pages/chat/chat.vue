<template>
  <view class="chat-room">
    <top-bar>
      <template #left>
        <navigator open-type="navigateBack">
          <icon-font icon="icon-zuojiantou" />
        </navigator>
      </template>
      <template #middle>
        <text class="top-bar-title">{{ currentChatItem.username || currentChatItem.groupName }}</text>
      </template>
      <template #right>
        <view class="tools">
          <icon-font icon="icon-caidan" />
        </view>
      </template>
    </top-bar>
    <!--    聊天消息列表-->
    <scroll-view
      :scroll-into-view="msgId"
      :style="{ '--message-scroll-height': tabBarRect.height + chatInputRect.height + 'px' }"
      show-scrollbar
      scroll-y="true"
      class="message-list"
      @scrolltoupper="scrolltoupper"
    >
      <template v-for="msgItem in currentChatItem.messages">
        <view
          :id="`msgItem-${msgItem._id}`"
          :key="msgItem._id"
          :class="{ 'my-self': isMe(msgItem) }"
          class="message-item"
        >
          <image class="avatar" :src="apiUrl + (isMe(msgItem) ? currentUser.avatar : currentChatItem.avatar)"></image>
          <view class="message-body">
            <view class="username">{{ isMe(msgItem) ? currentUser.username : currentChatItem.username }}</view>
            <view class="bubble">
              <rich-text class="talk" :nodes="msgItem.content"></rich-text>
              <!--              <view class="talk" v-html="msgItem.content"></view>-->
            </view>
          </view>
        </view>
      </template>
    </scroll-view>
    <!--    聊天输入框-->
    <chat-input />
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, nextTick, SetupContext } from '@vue/composition-api'
import TopBar from '@/components/top-bar/index.vue'
import ChatInput from './components/chat-input.vue'
import store from '@/store'
import { useClientRect } from '@/hooks/useClientRect'
import { getChatArr } from '@/pages/index/components/conversation/getChatArr'

export default defineComponent({
  name: 'Chat',
  components: { TopBar, ChatInput },
  setup(_, { root }: SetupContext) {
    const { id, chatType } = root.$Route.query
    console.log(root.$Route.query, 'ctx.root.$Route.query')
    const state = reactive({
      title: '',
      msgId: '',
      currentChatId: id, // 当前聊天对象的id
      currentChatKey: chatType == 'group' ? 'groupId' : 'userId', // 当前聊天对象id的key名称
    })

    const tabBarRect = useClientRect('.top-bar')
    const chatInputRect = useClientRect('.chat-input')

    const apiUrl = computed(() => store.getters['app/apiUrl'])

    const { groupGather, friendGather, currentUser } = getChatArr()

    // 当前聊天对象
    const currentChatItem = computed((): Friend | Group | any => {
      const currentChatKey = state.currentChatKey
      if (currentChatKey === 'groupId') {
        return Object.values(groupGather.value).find((item) => item[currentChatKey] === state.currentChatId) || {}
      } else if (currentChatKey === 'userId') {
        return Object.values(friendGather.value).find((item) => item[currentChatKey] === state.currentChatId) || {}
      }
      return {}
    })

    nextTick(async () => {
      state.msgId = `msgItem-${currentChatItem.value.messages?.slice(-1)[0]._id}`
    })

    // 小丑竟是我自己？
    const isMe = (msgItem: GroupMessage | FriendMessage) => {
      return currentUser.value.userId == msgItem.userId
    }

    // 下滑快到顶部的时候，加载历史消息
    const scrolltoupper = () => {
      console.log('到顶了')
    }

    return {
      ...toRefs(state),
      apiUrl,
      currentUser,
      currentChatItem,
      tabBarRect,
      chatInputRect,
      isMe,
      scrolltoupper,
    }
  },
})
</script>

<style lang="scss" scoped>
.chat-room ::v-deep {
  height: 100%;
  background-color: #eaedf4;
  .top-bar-title {
    @include position-center;
    @include text-ellipsis(1);
  }
  .message-list {
    height: calc(100vh - var(--message-scroll-height));

    .message-item {
      display: flex;
      margin: rpx(20) rpx(16);
      &.my-self {
        transform: rotateY(180deg);
        .avatar,
        .talk,
        .username {
          transform: rotateY(180deg);
        }
        .username {
          text-align: right;
        }
      }
      .avatar {
        @include el-to-circle(80);
        background-color: white;
      }
      .message-body {
        position: relative;
        max-width: 70vw;
        margin-left: rpx(28);
        .bubble {
          position: relative;
          background-color: white;
          border-radius: rpx(16);
          &:after {
            content: '';
            position: absolute;
            right: 100%;
            top: 0;
            width: rpx(20);
            height: rpx(20);
            border-width: 0;
            border-style: solid;
            border-color: transparent;
            border-bottom-width: rpx(18);
            border-bottom-color: white;
            border-radius: 0 0 0 rpx(64);
          }
          .talk {
            display: block;
            padding: rpx(20);
            color: #333;
          }
        }
      }
    }
  }
}
</style>
