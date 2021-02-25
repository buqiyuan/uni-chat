<template>
  <view>
    <top-bar class="top-bar">
      <template #left>
        <icon-font icon="icon-lianxirenweixuanzhong" />
      </template>
      <template #middle>
        <template v-for="tabItem in tabs">
          <text :key="tabItem.label">{{ tabItem.label }}</text>
        </template>
      </template>
      <template #right>
        <view class="tools">
          <icon-font icon="icon-caidan" />
          <icon-font icon="icon-Search" />
        </view>
      </template>
    </top-bar>
    <view>
      <scroll-snap />
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import TopBar from '@/components/top-bar/index.vue'
import ScrollSnap from '@/components/scroll-snap.vue'

export default defineComponent({
  name: 'Contact',
  components: { TopBar, ScrollSnap },
  setup() {
    const tabs = [
      {
        label: '关注',
      },
      {
        label: '好友',
      },
      {
        label: '推荐',
      },
      {
        label: '视频',
      },
    ]

    return {
      tabs,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../top-bar';
.top-bar {
  background: white;
  color: black;

  ::v-deep .middle {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .iconfont {
    font-size: rpx(42);
    @include click-text-active();
  }
}
</style>
