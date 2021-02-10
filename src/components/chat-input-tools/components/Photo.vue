<template>
  <view class="photo">
    <scroll-view class="scroll-view" scroll-x="true">
      <template v-for="(item, index) in images">
        <image
          :key="item"
          class="photo-item"
          mode="heightFix"
          :lazy-load="true"
          :src="item"
          @tap="previewImage(index)"
        ></image>
      </template>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'Photo',
  setup() {
    const images = Array.from({ length: 20 }).map((item, index) => `http://api.btstu.cn/sjbz/zsy.php?radam=${index}`)

    const previewImage = (index: number) => {
      uni.previewImage({
        urls: images,
        current: index + '',
        longPressActions: {
          itemList: ['发送给朋友', '保存图片', '收藏'],
          success: function (data) {
            console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片')
          },
          fail: function (err) {
            console.log(err.errMsg)
          },
        },
      })
    }

    return {
      images,
      previewImage,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/components/chat-input-tools/chat-tools.scss';
.photo ::v-deep {
  .scroll-view {
    height: $tool-panel-height;
    .uni-scroll-view-content {
      display: flex;
      padding: rpx(5);
      .photo-item {
        height: 100%;
        flex-shrink: 0;
        margin: 0 rpx(10);
      }
    }
  }
}
</style>
