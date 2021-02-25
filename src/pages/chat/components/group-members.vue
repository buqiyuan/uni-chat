<template>
  <!--    右侧群详情抽屉-->
  <u-popup v-model="isShowDrawer" mode="right" width="100%">
    <top-bar>
      <template #left>
        <view @tap="isShowDrawer = !isShowDrawer">
          <icon-font icon="icon-zuojiantou" />
        </view>
      </template>
      <template #middle>
        <view class="chat-title">
          <text class="title">群聊成员</text>
        </view>
      </template>
    </top-bar>
    <scroll-view class="members" :scroll-y="true" :style="{ '--top-bar-height': tabBarRect.height + 'px' }">
      <uni-list :border="false">
        <template v-for="memberItem in groupUsers">
          <uni-list-item :key="memberItem.userId" clickable>
            <!-- 自定义 header -->
            <view slot="header" class="slot-box">
              <u-avatar :src="apiUrl + memberItem.avatar" :size="80"></u-avatar>
              <view class="username">{{ memberItem.username }}</view>
            </view>
            <!-- 自定义 footer-->
            <view slot="footer" class="slot-box">
              <u-button v-if="friendGather[memberItem.userId]" type="success" size="mini" @tap="nav2friend(memberItem)"
                >发消息</u-button
              >
              <u-button v-else type="primary" size="mini" @tap="addFriend(memberItem)">加好友</u-button>
            </view>
          </uni-list-item>
        </template>
      </uni-list>
    </scroll-view>
  </u-popup>
</template>

<script lang="ts">
import { defineComponent, watch, PropType, computed, reactive, toRefs } from '@vue/composition-api'
import TopBar from '@/components/top-bar/index.vue'
import lodash from 'lodash'
import store from '@/store'
import { useClientRect } from '@/hooks/useClientRect'

export default defineComponent({
  name: 'GroupMembers',
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
    const state = reactive({
      isShowDrawer: props.isShow, // 是否显示群详情
      isShowMembers: false, // 是否显示群成员
    })
    const tabBarRect = useClientRect('.top-bar')
    // 服务器地址
    const apiUrl = computed((): string => store.getters['app/apiUrl'])
    const socket = computed(() => store.getters['chat/socket'])
    const currentUser = computed(() => store.getters['app/user'])
    const friendGather = computed((): FriendGather => store.getters['chat/friendGather'])

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
    // 群成员排序,在线的排在前
    const groupUsers = computed((): Friend[] => {
      return lodash.orderBy(props.chatData.members, ['isManager', 'online', 'username'], ['desc', 'desc', 'asc'])
    })
    // 群成员排序,在线的排在前
    const onlineMembersNum = computed(() => {
      return props.chatData.members!.filter((item) => item.online).length
    })

    // 给好友发送消息
    const nav2friend = (user: Friend) => {
      root.$Router.replace({
        name: 'chat',
        params: {
          id: user.userId,
          chatType: 'friend',
        },
      })
    }

    // 添加好友
    const addFriend = (user: Friend) => {
      socket.value.emit('addFriend', {
        userId: currentUser.value.userId,
        friendId: user.userId,
        createTime: new Date().valueOf(),
      })
    }

    return {
      ...toRefs(state),
      nav2friend,
      addFriend,
      friendGather,
      tabBarRect,
      groupUsers,
      onlineMembersNum,
      apiUrl,
    }
  },
})
</script>

<style lang="scss" scoped>
.slot-box {
  display: flex;
  align-items: center;
  .username {
    margin-left: rpx(14);
  }
}
.members ::v-deep {
  height: calc(100vh - var(--top-bar-height));
  overflow-y: auto;
  .uni-list--border {
    display: none;
  }
}
</style>
