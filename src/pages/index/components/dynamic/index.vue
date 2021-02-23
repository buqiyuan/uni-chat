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
        <text class="top-bar-title">动态</text>
      </template>
      <template #right>
        <view class="tools">
          <icon-font icon="icon-dynamic-setting" />
        </view>
      </template>
    </top-bar>
  </view>
</template>

<script lang="ts">
import TopBar from '@/components/top-bar/index.vue'
import { computed } from '@vue/composition-api'
import store from '@/store'

export default {
  name: 'Dynamic',
  emits: ['open-drawer'],
  components: { TopBar },
  setup() {
    const apiUrl = computed(() => store.getters['app/apiUrl'])
    const currentUser = computed(() => store.getters['app/user'])

    return { apiUrl, currentUser }
  },
}
</script>

<style lang="scss" scoped>
@import '../top-bar';
.network-status {
  margin-top: rpx(48);
}
</style>
