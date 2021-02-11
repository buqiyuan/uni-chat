<template>
  <view class="red-packet">
    <scroll-view scroll-y="true" class="scroll-Y">
      <template v-for="item in redPacketList">
        <view :key="item.title" class="red-packet-item">
          <image class="image" :src="item.url"></image>
          <view class="title">{{ item.title }}</view>
        </view>
      </template>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { redPacketList } from './redPacketList'

export default defineComponent({
  name: 'RedPacket',
  setup() {
    return { redPacketList }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/components/chat-input-tools/chat-tools.scss';

.red-packet ::v-deep {
  .scroll-Y {
    height: $tool-panel-height;
    .uni-scroll-view-content {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      align-content: start;
      .red-packet-item {
        padding: rpx(24);
        @include flex-center($flex-direction: column);
        .image {
          width: rpx(100);
          height: rpx(100);
        }
        .title {
          margin-top: rpx(14);
          font-size: rpx(26);
        }
      }
    }
  }
}
</style>
