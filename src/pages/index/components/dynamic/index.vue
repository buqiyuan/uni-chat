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

<script>
import TopBar from '@/components/top-bar/index.vue'

export default {
  name: 'Dynamic',
  components: { TopBar },
}
</script>

<style lang="scss" scoped>
@import '../top-bar';
.network-status {
  margin-top: rpx(48);
}
</style>
