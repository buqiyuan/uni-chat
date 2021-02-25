<template>
  <!--    右侧好友抽屉-->
  <u-popup v-model="isShowDrawer" mode="right" width="100%">
    <top-bar>
      <template #left>
        <view @tap="isShowDrawer = !isShowDrawer">
          <icon-font icon="icon-zuojiantou" />
        </view>
      </template>
      <template #middle>
        <view class="chat-title">
          <text class="title">个人资料</text>
        </view>
      </template>
      <template #right>
        <view class="tools" @tap="confirmShare">
          <u-icon name="zhuanfa"></u-icon>
        </view>
      </template>
    </top-bar>
    <view class="user-card">
      <u-avatar :src="apiUrl + chatData.avatar" mode="square" size="200"></u-avatar>
      <view class="username">{{ chatData.username }}</view>
    </view>
    <u-cell-group>
      <u-cell-item title="查找聊天记录" value="图片、视频、文件等"></u-cell-item>
      <u-cell-item title="聊天背景"></u-cell-item>
    </u-cell-group>
    <view class="exit-btn">
      <template v-if="friendGather[chatData.userId]">
        <u-button type="success" @tap="nav2chat(chatData.userId)">发送消息</u-button>
        <u-button type="error" style="margin-top: 12px" @tap="exitFriend(chatData.userId)">删除好友</u-button>
      </template>
      <u-button v-else type="primary" @tap="addFriend(chatData.userId)">添加好友</u-button>
    </view>
    <!-- 分享示例 -->
    <uni-popup id="popupShare" ref="popupShareRef" type="share" @change="change">
      <uni-popup-share title="分享到" @select="select"></uni-popup-share>
    </uni-popup>
  </u-popup>
</template>

<script lang="ts">
import { defineComponent, watch, PropType, computed, reactive, toRefs, ref } from '@vue/composition-api'
import TopBar from '@/components/top-bar/index.vue'
import store from '@/store'

export default defineComponent({
  name: 'FriendSetting',
  components: { TopBar },
  model: {
    prop: 'isShow',
    event: 'changeModel',
  },
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    chatData: {
      type: Object as PropType<Friend & Group>,
      default: () => ({}),
    },
  },
  emits: ['changeModel'],
  setup(props, { emit, root }) {
    const popupShareRef = ref<any>()
    const state = reactive({
      isShowDrawer: props.isShow, // 是否显示群详情
      isShowMembers: false, // 是否显示群成员
    })
    // 服务器地址
    const apiUrl = computed((): string => store.getters['app/apiUrl'])
    const friendGather = computed((): FriendGather => store.getters['chat/friendGather'])
    const currentUser = computed((): User => store.getters['app/user'])
    const socket = computed((): SocketIOClient.Socket => store.getters['chat/socket'])

    // TODO H5可以，APP端监听不到，可恶啊
    // const isShowDrawer = computed({
    //   get: () => props.isShow,
    //   set: (val) => emit('changeModel', val),
    // })
    watch(
      () => props.isShow,
      (val) => {
        state.isShowDrawer = val
      }
    )
    watch(
      () => state.isShowDrawer,
      (value) => emit('changeModel', value)
    )
    // 添加好友
    const addFriend = (friendId: string) => {
      // 设置按钮loading,避免网络延迟重复点击造成多次执行
      socket.value.emit('addFriend', {
        userId: currentUser.value.userId,
        friendId,
        createTime: new Date().valueOf(),
      })
    }
    // 好友私聊
    const nav2chat = (userId: string) => {
      root.$Router.replace({
        name: 'chat',
        params: {
          id: userId,
          chatType: 'friend',
        },
      })
    }
    // 删除好友
    const exitFriend = (userId: string) => {
      socket.value.emit('exitFriend', {
        userId: currentUser.value.userId,
        friendId: userId,
      })
    }
    // 分享
    const confirmShare = () => {
      popupShareRef.value.open()
    }
    // 选择要分享的平台
    const select = (e: any, done: () => any) => {
      uni.showToast({
        title: `您选择了第${e.index + 1}项：${e.item.text}`,
        icon: 'none',
      })
      done()
    }

    const change = (e: any) => {
      console.log('popup ' + e.type + ' 状态', e.show)
    }

    return {
      ...toRefs(state),
      popupShareRef,
      apiUrl,
      friendGather,
      exitFriend,
      addFriend,
      nav2chat,
      confirmShare,
      change,
      select,
    }
  },
})
</script>

<style lang="scss" scoped>
.user-card {
  display: flex;
  padding: rpx(80);
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .username {
    font-size: rpx(44);
    margin-top: rpx(30);
  }
}
.exit-btn {
  position: absolute;
  bottom: rpx(40);
  left: rpx(40);
  right: rpx(40);
}
</style>
