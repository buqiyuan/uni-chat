<template>
  <view>
    <view @tap="isShowMask = true">
      <view
        v-show="isShowMask"
        v-if="chatType === 'group' && (isShowMask || (isShowed && currentUser.userId !== data.userId))"
        class="mask"
        :class="{ show: isShowMask }"
        @click="isShowCard = false"
      >
        <view class="user-card" :class="{ show: isShowCard }" @tap.stop>
          <image
            class="user-avatar"
            :class="{ offline: data.online == 0 }"
            :src="apiUrl + userGather[data.userId].avatar"
          ></image>
          <view class="username">{{ userGather[data.userId].username }}</view>
          <view v-if="friendGather[data.userId]" class="add-friend-btn" @tap="nav2chat(data.userId)">发送消息</view>
          <view v-else class="add-friend-btn" @tap="addFriend(data.userId)">添加好友</view>
        </view>
      </view>
      <image
        class="user-avatar"
        :class="{ offline: data.online == 0 }"
        :src="apiUrl + (currentUser.userId === data.userId ? currentUser.avatar : userGather[data.userId].avatar)"
        @tap="isShowMask = true"
      ></image>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, PropType } from '@vue/composition-api'
import store from '@/store'

export default defineComponent({
  name: 'UserAvatar',
  props: {
    data: {
      type: Object as PropType<User>,
      default: () => ({}),
    },
    size: {
      type: Number as PropType<number | string>,
      default: 80,
    },
  },
  setup(_, { root }) {
    const { chatType } = root.$Route.query

    const isShowMask = ref(false)
    const isShowCard = ref(false)
    const isShowed = ref(false)
    watch(
      () => isShowMask.value,
      (val) => {
        isShowed.value = true
        setTimeout(() => {
          isShowCard.value = isShowMask.value
        }, 50)
      }
    )
    watch(
      () => isShowCard.value,
      (val) => {
        setTimeout(() => {
          isShowMask.value = isShowCard.value
        }, 320)
      }
    )
    // 当前用户，也就是我自己
    const currentUser = computed((): User => store.getters['app/user'])
    const userGather = computed((): FriendGather => store.getters['chat/userGather'])
    const friendGather = computed((): FriendGather => store.getters['chat/friendGather'])
    const apiUrl = computed((): string => store.getters['app/apiUrl'])
    const socket = computed((): SocketIOClient.Socket => store.getters['chat/socket'])
    // 小丑竟是我自己？
    // const isMe = computed(() => {
    //   return (msgItem: GroupMessage | FriendMessage) => currentUser.value.userId == msgItem.userId
    // })
    const addFriend = (friendId: string) => {
      // 设置按钮loading,避免网络延迟重复点击造成多次执行
      socket.value.emit('addFriend', {
        userId: currentUser.value.userId,
        friendId,
        createTime: new Date().valueOf(),
      })
    }
    const nav2chat = (userId: string) => {
      root.$Router.replace({
        name: 'chat',
        params: {
          id: userId,
          chatType: 'friend',
        },
      })
    }

    return {
      isShowMask,
      chatType,
      isShowed,
      isShowCard,
      friendGather,
      userGather,
      apiUrl,
      currentUser,
      addFriend,
      nav2chat,
    }
  },
})
</script>

<style lang="scss" scoped>
.user-avatar {
  @include el-to-circle(80);
  background-color: white;
  &.offline {
    filter: grayscale(100%);
  }
}
.mask {
  position: fixed;
  overflow: hidden;
  z-index: -999;
  &.show {
    left: 0;
    bottom: 0;
    top: 0;
    right: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.3);
  }
  .user-card {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 60vh;
    transform: translateY(100%);
    background-color: white;
    padding: rpx(60);
    overflow: hidden;
    transition: transform 0.3s;
    &.show {
      transform: translateY(0);
    }
    .user-avatar {
      display: block;
      margin: 0 auto;
      @include el-to-circle(120);
      padding: rpx(8);
      border: 1px solid #eee;
    }
    .username {
      margin-top: rpx(40);
      font-size: rpx(40);
      font-weight: 700;
      text-align: center;
    }
    .add-friend-btn {
      margin-top: rpx(50);
      padding: rpx(20) rpx(40);
      border-radius: rpx(10);
      text-align: center;
      color: white;
      background-color: #00c9fd;
      &:active {
        background-color: #068aac;
      }
    }
  }
}
</style>
