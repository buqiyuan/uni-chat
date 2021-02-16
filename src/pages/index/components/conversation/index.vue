<template>
  <view class="conversation-container">
    <top-bar>
      <template #left>
        <view class="user-info">
          <image
            class="avatar"
            src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-uni-app-doc/6c4e3a70-4f31-11eb-8ff1-d5dcf8779628.png"
            @click="$emit('open-drawer')"
          />
          <view class="desc">
            <view class="nickname"> 猿计划 </view>
            <view class="network-status">
              <text class="status" />
              手机在线-WIFI
            </view>
          </view>
        </view>
      </template>
      <template #right>
        <view class="tools">
          <icon-font icon="icon-Camera1" />
          <icon-font icon="icon-add" />
        </view>
      </template>
    </top-bar>
    <scroll-view
      class="conversation-list"
      scroll-y="true"
      refresher-enabled="true"
      :refresher-triggered="triggered"
      :refresher-threshold="100"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      @refresherabort="onAbort"
    >
      <template v-for="(chatItem, index) in chatArr">
        <u-swipe-action
          :key="getMsgItemId(chatItem)"
          :index="index"
          :show="swipeActionShows[getMsgItemId(chatItem)]"
          :options="options"
          :class="{ 'show-action': swipeActionShows[getMsgItemId(chatItem)] }"
          @content-click="contentClick(chatItem)"
          @open="open(chatItem)"
          @close="close"
          @click="operateChatItem(chatItem)"
        >
          <!--        群消息-->
          <template v-if="chatItem.groupId">
            <group-item :key="chatItem.groupId" :message-item="chatItem" />
          </template>
          <!--        好友消息-->
          <template v-else-if="chatItem.userId">
            <friend-item :key="chatItem.userId" :message-item="chatItem" />
          </template>
        </u-swipe-action>
      </template>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import Vue from 'vue'
import { defineComponent, reactive, toRefs, watchEffect, ref, onMounted } from '@vue/composition-api'
import TopBar from '@/components/top-bar/index.vue'
import FriendItem from './friend-item.vue'
import GroupItem from './group-item.vue'
import { getChatArr } from './getChatArr'

const options = [
  {
    text: '置顶',
    style: {
      backgroundColor: '#cccccc',
    },
  },
  {
    text: '删除',
    style: {
      backgroundColor: '#dd524d',
    },
  },
]
type ChatItemType = Group | Friend

export default defineComponent({
  name: 'Conversation',
  components: { TopBar, FriendItem, GroupItem },
  emits: ['open-drawer'],
  setup(_, { root, emit }) {
    const state = reactive({
      triggered: true as any,
      _freshing: false,
      currentActionKey: '', // 是否显示遮罩层，主要用于左滑打开swipe-action的时候禁止其他行为
    })
    // 获取聊天信息列表
    const { sortChat, chatArr } = getChatArr()

    // 获取消息项id
    const getMsgItemId = (chatItem: ChatItemType): string => chatItem.groupId || chatItem.userId

    // 用来控制u-swipe-action某项的显隐
    const swipeActionShows = ref(
      chatArr.value.reduce(
        (prev: any, curr: ChatItemType) => ({
          ...prev,
          [getMsgItemId(curr)]: false,
        }),
        {}
      )
    )

    watchEffect(() => {
      chatArr.value.forEach((item: ChatItemType) => {
        const actionKey = getMsgItemId(item)
        if (!swipeActionShows.hasOwnProperty(actionKey)) {
          Vue.set(swipeActionShows.value, actionKey, false)
        }
      })
    })

    onMounted(() => {
      sortChat()
      state._freshing = false
      setTimeout(() => {
        state.triggered = false
      }, 100)
    })

    const onPulling = (e: any) => {
      // console.log("onpulling", e);
    }
    const onRefresh = () => {
      if (state._freshing) return
      state._freshing = true
      sortChat()
      setTimeout(() => {
        state.triggered = false
        state._freshing = false
      }, 1500)
    }

    const onRestore = () => {
      state.triggered = 'restore' // 需要重置
      // console.log("onRestore");
    }
    const onAbort = () => {
      // console.log("onAbort");
    }

    // 操作某项消息
    const operateChatItem = (chatItem: ChatItemType) => {
      console.log(chatItem, '操作的消息')
    }

    // 滑动打开某项
    const open = (chatItem: ChatItemType) => {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      const actionKey = getMsgItemId(chatItem)
      swipeActionShows.value[actionKey] = true
      state.currentActionKey = actionKey
      Object.keys(swipeActionShows.value).forEach(
        (key: string) => actionKey == key || (swipeActionShows.value[key] = false)
      )
      emit('changeSlideEnable', true)
      console.log(swipeActionShows, '打开了')
    }
    // 点击消息内容
    const contentClick = (chatItem: ChatItemType) => {
      const id = getMsgItemId(chatItem)
      if (swipeActionShows.value[id]) {
        swipeActionShows.value[id] = false
      }
    }

    const close = () => {
      swipeActionShows.value[state.currentActionKey] = false
      setTimeout(() => emit('changeSlideEnable', false))
    }

    return {
      ...toRefs(state),
      chatArr,
      swipeActionShows,
      options,
      contentClick,
      open,
      close,
      getMsgItemId,
      operateChatItem,
      onPulling,
      onRefresh,
      onRestore,
      onAbort,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../top-bar';
.conversation-container ::v-deep {
  .show-action {
    .u-swipe-content {
      pointer-events: none;
    }
  }
  .conversation-list {
    height: var(--body-height);
  }
}
</style>
