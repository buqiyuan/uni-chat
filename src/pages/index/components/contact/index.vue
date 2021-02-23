<template>
  <view>
    <top-bar>
      <template #left>
        <view class="user-info">
          <image class="avatar" :src="apiUrl + currentUser.avatar" @tap="$emit('open-drawer')" />
          <view class="desc">
            <view class="network-status">
              <text class="status" />
            </view>
          </view>
        </view>
      </template>
      <template #middle>
        <text class="top-bar-title">联系人</text>
      </template>
      <template #right>
        <view class="tools">
          <icon-font icon="icon-add-contact" />
        </view>
      </template>
    </top-bar>
    <scroll-view class="contact-list" scroll-y="true">
      <index-list :index-obj="contactList" index="username">
        <template #cell="{ item }">
          <view class="index-cell" @tap="nav2chat(item)">
            <image class="avatar" :class="{ offline: item.online === 0 }" :src="apiUrl + item.avatar"></image>
            <view class="user-info">
              <view class="username">{{ item.username }}</view>
              <view class="user-status">{{ item.online === 1 ? '在线' : '离线' }}</view>
            </view>
          </view>
        </template>
      </index-list>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import TopBar from '@/components/top-bar/index.vue'
import { computed, defineComponent } from '@vue/composition-api'
import cnchar from 'cnchar'
import store from '@/store'
import IndexList from '@/components/index-list/index.vue'

export default defineComponent({
  name: 'Contact',
  emits: ['open-drawer'],
  components: { TopBar, IndexList },
  setup(_, { root }) {
    const apiUrl = computed((): string => store.getters['app/apiUrl'])
    const currentUser = computed((): User => store.getters['app/user'])
    const friendGather = computed((): FriendGather => store.getters['chat/friendGather'])

    // 获取联系人列表,按A-Z字母排序
    const contactList = computed(() => {
      const list = Object.values(friendGather.value)
      // 此处拿到所有好友拼音首字母,使用cnchar插件
      // https://github.com/theajack/cnchar
      const charList = list.map((k) => cnchar.spell(k.username).toString().charAt(0).toUpperCase()).sort()
      const contactObj = {} as any
      for (const char of Array.from(new Set(charList))) {
        contactObj[char] = list.filter((k) => cnchar.spell(k.username).toString().charAt(0).toUpperCase() === char)
      }
      return contactObj
    })

    const nav2chat = (item: Friend) => {
      root.$Router.push({
        name: 'chat',
        params: {
          id: item.userId,
          chatType: 'friend',
        },
      })
    }

    return {
      apiUrl,
      currentUser,
      contactList,
      nav2chat,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../top-bar';
.network-status {
  margin-top: rpx(48);
}
.contact-list {
  height: var(--body-height);
  .index-cell {
    display: flex;
    padding: rpx(20);
    &:active {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .avatar {
      @include el-to-circle(90);
      &.offline {
        filter: grayscale(100%);
      }
    }
    .user-info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;
    }
  }
}
</style>
