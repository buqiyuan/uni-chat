<template>
  <image
    class="user-avatar"
    :class="{ offline: data.online === 0 }"
    :lazy-load="true"
    :src="apiUrl + (currentUser.userId === data.userId ? currentUser.avatar : userGather[data.userId].avatar)"
  ></image>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'
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

    const userGather = computed((): FriendGather => store.getters['chat/userGather'])
    const apiUrl = computed((): string => store.getters['app/apiUrl'])
    const currentUser = computed((): User => store.getters['app/user'])

    return {
      chatType,
      userGather,
      apiUrl,
      currentUser,
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
</style>
