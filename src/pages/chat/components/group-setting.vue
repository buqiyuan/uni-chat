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
          <text class="title">群聊设置</text>
        </view>
      </template>
      <template #right>
        <view class="tools" @tap="confirmShare">
          <u-icon name="zhuanfa"></u-icon>
        </view>
      </template>
    </top-bar>
    <u-cell-group :border="false">
      <u-cell-item
        title="群聊成员"
        :value="`共${groupUsers.length}人`"
        :border-bottom="false"
        @click="isShowMembers = !isShowMembers"
      ></u-cell-item>
    </u-cell-group>
    <view class="members">
      <u-row gutter="16" justify="around">
        <template v-for="memberItem in groupUsers.slice(0, 6)">
          <u-col :key="memberItem.userId" class="member-item" text-align="center" span="2">
            <u-avatar :src="apiUrl + memberItem.avatar" :size="80"></u-avatar>
            <view class="username">{{ memberItem.username }}</view>
          </u-col>
        </template>
      </u-row>
    </view>
    <u-gap height="16" bg-color="#eee"></u-gap>
    <u-cell-group title="群聊信息">
      <u-cell-item title="群聊名称" :value="chatData.groupName"></u-cell-item>
      <u-cell-item title="群公告" :value="change.notice"></u-cell-item>
    </u-cell-group>
    <view class="exit-btn">
      <u-button @click="exitGroup" type="error">退出群聊</u-button>
    </view>
    <!-- 分享示例 -->
    <uni-popup id="popupShare" ref="popupShareRef" type="share" @change="change">
      <uni-popup-share title="分享到" @select="select"></uni-popup-share>
    </uni-popup>
    <!--    群成员列表-->
    <group-members v-model="isShowMembers" :chat-data="chatData" />
  </u-popup>
</template>

<script lang="ts">
import { defineComponent, watch, PropType, computed, reactive, toRefs, ref } from '@vue/composition-api'
import TopBar from '@/components/top-bar/index.vue'
import GroupMembers from './group-members.vue'
import lodash from 'lodash'
import store from '@/store'

export default defineComponent({
  name: 'GroupSetting',
  components: { TopBar, GroupMembers },
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
  setup(props, { emit }) {
    const popupShareRef = ref<any>()
    const state = reactive({
      isShowDrawer: props.isShow, // 是否显示群详情
      isShowMembers: false, // 是否显示群成员
    })
    // 服务器地址
    const apiUrl = computed((): string => store.getters['app/apiUrl'])
    const socket = computed((): SocketIOClient.Socket => store.getters['chat/socket'])
    const currentUser = computed((): User => store.getters['app/user'])

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
    // 退出群聊
    const exitGroup = () => {
      socket.value.emit('exitGroup', {
        userId: currentUser.value.userId,
        groupId: props.chatData.groupId,
      })
      // 退群后关闭Panel
      setTimeout(() => {
        emit('changeModel', false)
      }, 300)
    }

    const change = (e: any) => {
      console.log('popup ' + e.type + ' 状态', e.show)
    }

    return {
      ...toRefs(state),
      popupShareRef,
      groupUsers,
      apiUrl,
      confirmShare,
      change,
      select,
      exitGroup,
    }
  },
})
</script>

<style lang="scss" scoped>
.members {
  padding: rpx(20);
  .username {
    @include text-ellipsis(1);
    font-size: rpx(26);
  }
}
.exit-btn {
  position: absolute;
  bottom: rpx(40);
  left: rpx(40);
  right: rpx(40);
}
</style>
