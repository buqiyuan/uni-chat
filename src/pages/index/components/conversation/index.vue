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
import { defineComponent, reactive, toRefs, onMounted, watch, computed } from '@vue/composition-api'
import TopBar from '@/components/top-bar/index.vue'
import FriendItem from './friend-item.vue'
import GroupItem from './group-item.vue'
import store from '@/store'
import { minCache } from '@/utils/MinCache'

export default defineComponent({
  name: 'Conversation',
  components: { TopBar, FriendItem, GroupItem },
  emits: ['open-drawer'],
  setup(_, { root }) {
    const state = reactive({
      triggered: true as boolean | string,
      _freshing: false,
      chatArr: [] as Array<Group | Friend>,
    })

    const groupGather = computed((): GroupGather => store.getters['chat/groupGather'])
    const friendGather = computed((): FriendGather => store.getters['chat/friendGather'])
    const currentUserId = computed((): string => store.getters['app/user'])

    watch([groupGather, friendGather], () => {
      sortChat()
    })

    onMounted(() => {
      sortChat()
      state._freshing = false
      setTimeout(() => {
        state.triggered = false
      }, 100)
    })

    // 获取消息列表数据
    const sortChat = async () => {
      const groups = Object.values(groupGather.value)
      const friends = Object.values(friendGather.value)
      // 此处避免Await造成v-for页面闪烁问题,所以在最后才赋值this.chatArr = roomArr;
      let roomArr = [...groups, ...friends]
      // 此处需要过滤本地已删除的会话
      const deletedChat = (await minCache.get(`${currentUserId.value}-deletedChatId`)) as string[]
      if (Array.isArray(deletedChat)) {
        roomArr = roomArr.filter((chat) => !deletedChat.includes((chat as Group).groupId || chat.userId))
      }

      // 对聊天窗进行排序(根据最新消息时间)
      roomArr = roomArr.sort((a: Group | Friend, b: Group | Friend) => {
        if (a.messages && b.messages) {
          // @ts-ignore
          return b.messages[b.messages.length - 1].time - a.messages[a.messages.length - 1].time
        }
        if (a.messages) {
          return -1
        }
        return 1
      })

      // 查看是否有需要置顶列表
      const topChatId = (await minCache.get(`${currentUserId.value}-topChatId`)) as string
      if (topChatId) {
        // 找到需要置顶的窗口
        const chat = roomArr.find((c) => ((c as Group).groupId || c.userId) === topChatId)
        if (chat) {
          // 移动至第一位
          roomArr = roomArr.filter((k) => ((k as Group).groupId || k.userId) !== topChatId)
          chat.isTop = true
          roomArr.unshift(chat)
        }
      }
      console.log(roomArr, 'roomArr')
      state.chatArr = roomArr
    }

    const onPulling = (e: any) => {
      // console.log("onpulling", e);
    }
    const onRefresh = () => {
      if (state._freshing) return
      state._freshing = true
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
