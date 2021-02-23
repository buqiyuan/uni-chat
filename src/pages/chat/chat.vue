<template>
  <view class="chat-room">
    <top-bar>
      <template #left>
        <navigator open-type="navigateBack">
          <icon-font icon="icon-zuojiantou" />
        </navigator>
      </template>
      <template #middle>
        <view :data-status="onlineStatus" class="chat-title">
          <text class="title">{{ currentChatItem.username || currentChatItem.groupName }}</text>
        </view>
      </template>
      <template #right>
        <view class="tools">
          <icon-font icon="icon-caidan" />
        </view>
      </template>
    </top-bar>
    <!--    聊天消息列表-->
    <scroll-view
      v-if="isMounted"
      :scroll-into-view="msgId"
      :style="{ '--message-scroll-height': tabBarRect.height + chatInputRect.height + 'px' }"
      show-scrollbar
      scroll-y="true"
      class="message-list"
      @scrolltoupper="scrolltoupper"
    >
      <view v-if="isNoMore" class="no-more">都被你看光了，再翻也没有啦~</view>
      <image v-show="spinning" class="loading-icon" src="/static/status.gif"></image>
      <template v-for="msgItem in currentChatItem.messages">
        <view
          :id="`msgItem-${msgItem._id}`"
          :key="msgItem._id"
          :class="{ 'my-self': isMe(msgItem) }"
          class="message-item"
        >
          <user-avatar :data="msgItem" class="avatar" />
          <view class="message-body">
            <view class="username">{{
              isMe(msgItem) ? currentUser.username : userGather[msgItem.userId].username
            }}</view>
            <view class="bubble">
              <rich-text class="talk" :nodes="msgItem.content"></rich-text>
              <!--              <view class="talk" v-html="msgItem.content"></view>-->
            </view>
          </view>
        </view>
      </template>
    </scroll-view>
    <!--    聊天输入框-->
    <chat-input @send-message="onSendMessage" />
  </view>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  Data,
  computed,
  onUnmounted,
  onMounted,
  nextTick,
  SetupContext,
} from '@vue/composition-api'
import TopBar from '@/components/top-bar/index.vue'
import ChatInput from './components/chat-input.vue'
import UserAvatar from '@/components/user-avatar.vue'
import * as api from '@/apis'
import store from '@/store'
import { useClientRect } from '@/hooks/useClientRect'
import { useChatData } from '../index/components/conversation/useChatData'
import { processReturn } from '@/utils/common'

interface IState extends Data {
  title: string
  msgId: string
  pageSize: number
  isNoMore: boolean
  spinning: boolean // 加载历史消息loading
  isMounted: boolean // 静态dom是否渲染完成,避免由等待聊天数据列表渲染而造成的短暂白屏
  currentChatId: string // 当前聊天对象的id
  currentChatKey: 'groupId' | 'userId' // 当前聊天对象id的key名称
}

export default defineComponent({
  name: 'Chat',
  components: { TopBar, ChatInput, UserAvatar },
  setup(_, { root }: SetupContext) {
    const { id, chatType } = root.$Route.query
    console.log(root.$Route.query, 'ctx.root.$Route.query')
    const state: IState = reactive({
      title: '',
      msgId: '',
      pageSize: 10,
      isNoMore: false,
      spinning: false,
      isMounted: false, // 静态dom是否渲染完成,避免由等待聊天数据列表渲染而造成的短暂白屏
      currentChatId: id, // 当前聊天对象的id
      currentChatKey: chatType == 'group' ? 'groupId' : 'userId', // 当前聊天对象id的key名称
    })

    const tabBarRect = useClientRect('.top-bar')
    const chatInputRect = useClientRect('.chat-input')

    const userGather = computed((): FriendGather => store.getters['chat/userGather'])
    // 群聊或用户的在线状态
    const onlineStatus = computed(() => {
      if (chatType == 'group') {
        const keys = Object.keys(userGather.value)
        const onlineUsers = keys.filter((key) => userGather.value[key].online == 1).length
        return `${onlineUsers}人在线`
      } else {
        return userGather.value[state.currentChatId].online == 1 ? '手机在线-WIFI' : '离线'
      }
    })

    const { groupGather, friendGather, currentUser } = useChatData()

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
    // 消息滚动到底部
    const scroll2bottom = () => {
      state.msgId = ''
      nextTick(() => {
        state.msgId = `msgItem-${currentChatItem.value.messages?.slice(-1)[0]._id}`
      })
    }
    // 监听子组件发送消息
    const onSendMessage = () => {
      setTimeout(scroll2bottom, 500)
    }

    onMounted(() => {
      state.isMounted = true
      const timer = setTimeout(() => {
        if (currentChatItem.value.messages) {
          setTimeout(scroll2bottom)
          clearTimeout(timer)
        }
      }, 100)
      onUnmounted(() => clearTimeout(timer))
    })

    // 小丑竟是我自己？
    const isMe = computed(() => {
      return (msgItem: GroupMessage | FriendMessage) => currentUser.value.userId == msgItem.userId
    })
    /**
     * 获取群聊消息
     */
    const getGroupMessages = async () => {
      const current = currentChatItem.value.messages.length
      const currentMessage = currentChatItem.value.messages ?? []
      const data: PagingResponse = processReturn(
        await api.getGroupMessages({
          groupId: state.currentChatId,
          userId: currentUser.value.userId,
          current,
          pageSize: state.pageSize,
        })
      )
      if (data) {
        if (!data.messageArr.length || data.messageArr.length < state.pageSize) {
          state.isNoMore = true
        }
        // this.needScrollToBottom = false
        store.commit('chat/set_group_messages', [...data.messageArr, ...currentMessage])
        // eslint-disable-next-line no-restricted-syntax
        for (const user of data.userArr) {
          if (!userGather.value[user.userId]) {
            store.commit('chat/set_user_gather', user)
          }
        }
      }
    }

    /**
     * 获取私聊消息
     */
    const getFriendMessages = async () => {
      const { userId } = currentUser.value
      const friendId = state.currentChatId
      const current = currentChatItem.value.messages.length
      const currentMessage = currentChatItem.value.messages ?? []
      const data: PagingResponse = processReturn(
        await api.getFriendMessage({
          userId,
          friendId,
          current,
          pageSize: state.pageSize,
        })
      )
      if (data) {
        if (!data.messageArr.length || data.messageArr.length < state.pageSize) {
          state.isNoMore = true
        }
        // this.needScrollToBottom = false
        store.commit('chat/set_friend_messages', [...data.messageArr, ...currentMessage])
      }
    }

    /**
     * 获取历史消息
     * @params text
     */
    const getMoreMessage = async () => {
      if (state.isNoMore) {
        return false
      }
      state.spinning = true
      if (state.currentChatKey === 'groupId') {
        await getGroupMessages()
      } else {
        await getFriendMessages()
      }
      nextTick(() => {
        state.spinning = false
      })
    }

    // 下滑快到顶部的时候，加载历史消息
    const scrolltoupper = () => {
      getMoreMessage()
    }

    return {
      ...toRefs(state),
      currentUser,
      currentChatItem,
      tabBarRect,
      chatInputRect,
      isMe,
      userGather,
      onlineStatus,
      onSendMessage,
      scroll2bottom,
      scrolltoupper,
    }
  },
})
</script>

<style lang="scss" scoped>
.chat-room ::v-deep {
  height: 100%;
  background-color: #eaedf4;
  .chat-title {
    @include position-center;
    text-align: center;
    &::after {
      content: attr(data-status);
      position: absolute;
      top: rpx(40);
      left: 50%;
      transform: translateX(-50%);
      word-break: keep-all;
      white-space: nowrap;
      font-size: rpx(20);
    }
    .title {
      @include text-ellipsis(1);
    }
  }

  .message-list {
    //content-visibility: auto;
    overflow-anchor: none;
    height: calc(100vh - var(--message-scroll-height));
    .no-more {
      text-align: center;
      line-height: rpx(100);
      color: #9d9d9d;
    }

    .loading-icon {
      display: block;
      border-radius: 100%;
      padding: rpx(10);
      margin: rpx(20) auto;
      height: rpx(30);
      width: rpx(30);
      box-shadow: 0 0 8px 3px rgba(0, 0, 0, 0.1) inset;
    }

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
