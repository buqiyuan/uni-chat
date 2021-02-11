<template>
  <view class="other-tools">
    <swiper class="swiper" :indicator-dots="true" :scroll-x="true">
      <template v-for="(swiperItem, swiperIndex) in swiperLength">
        <swiper-item :key="swiperIndex">
          <view class="tool-panel">
            <template v-for="Imageitem in toolImages.slice(swiperIndex * 8, swiperItem * 8)">
              <view :key="Imageitem.url" class="tool-item">
                <image :key="Imageitem.title" class="image" :src="Imageitem.url"></image>
                <view class="title">{{ Imageitem.title }}</view>
              </view>
            </template>
          </view>
        </swiper-item>
      </template>
    </swiper>
  </view>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { toolImages } from './toolImages'

export default defineComponent({
  name: 'Other',
  setup() {
    return {
      swiperLength: Math.ceil(toolImages.length / 8),
      imagesLength: toolImages.length,
      toolImages,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/components/chat-input-tools/chat-tools.scss';

.other-tools ::v-deep {
  .swiper {
    height: $tool-panel-height;
    .tool-panel {
      padding: rpx(20);
      height: 100%;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(2, 1fr);

      .tool-item {
        @include flex-center($flex-direction: column);

        .image {
          width: rpx(100);
          height: rpx(100);
        }
        .title {
          margin-top: rpx(20);
          font-size: rpx(26);
        }
      }
    }
  }
}
</style>
