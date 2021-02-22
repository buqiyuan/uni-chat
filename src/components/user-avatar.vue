<template>
  <view>
    <image
      class="user-avatar"
      :class="{ offline: data.online == 1 }"
      :src="apiUrl + (currentUser.userId === data.userId ? currentUser.avatar : userGather[data.userId].avatar)"
      @tap="isShow = true"
    ></image>
    <!--    <u-popup v-model="isShow">-->
    <!--      <view>出淤泥而不染，濯清涟而不妖</view>-->
    <!--    </u-popup>-->
  </view>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from '@vue/composition-api'
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
  setup() {
    const isShow = ref(false)
    // 当前用户，也就是我自己
    const currentUser = computed((): User => store.getters['app/user'])
    const userGather = computed(() => store.getters['chat/userGather'])
    const apiUrl = computed(() => store.getters['app/apiUrl'])
    // 小丑竟是我自己？
    // const isMe = computed(() => {
    //   return (msgItem: GroupMessage | FriendMessage) => currentUser.value.userId == msgItem.userId
    // })
    return { isShow, userGather, apiUrl, currentUser }
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
</style>
