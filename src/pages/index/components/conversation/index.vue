<template>
  <view>
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
      style="height: var(--body-height)"
      scroll-y="true"
      refresher-enabled="true"
      :refresher-triggered="triggered"
      :refresher-threshold="100"
      @refresherpulling="onPulling"
      @refresherrefresh="onRefresh"
      @refresherrestore="onRestore"
      @refresherabort="onAbort"
    >
      <template v-for="chatItem in chatArr">
        <!--        群消息-->
        <template v-if="chatItem.groupId">
          <group-item :key="chatItem.groupId" :message-item="chatItem" />
        </template>
        <!--        好友消息-->
        <template v-else-if="chatItem.userId">
          <friend-item :key="chatItem.userId" :message-item="chatItem" />
        </template>
      </template>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from '@vue/composition-api'
import TopBar from '@/components/top-bar/index.vue'
import FriendItem from './friend-item.vue'
import GroupItem from './group-item.vue'
import { getChatArr } from './getChatArr'

export default defineComponent({
  name: 'Conversation',
  components: { TopBar, FriendItem, GroupItem },
  emits: ['open-drawer'],
  setup(_, { root }) {
    const state = reactive({
      triggered: true as any,
      _freshing: false,
    })
    // 获取聊天信息列表
    const { sortChat, chatArr } = getChatArr()

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

    return {
      ...toRefs(state),
      chatArr,
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
</style>
