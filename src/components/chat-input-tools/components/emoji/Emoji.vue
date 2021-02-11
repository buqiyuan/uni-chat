<template>
  <view class="emoji">
    <swiper class="swiper" :current-item-id="currentItemId" @change="swiperChange">
      <template v-for="(emojiItem, emojiIndex) in emojis">
        <swiper-item :key="emojiIndex" :item-id="emojiIndex + ''">
          <emoji-item :emoji-item="emojiItem" :index="emojiIndex" :current-index="currentItemId" />
        </swiper-item>
      </template>
    </swiper>
    <scroll-view :scroll-x="true" :enable-flex="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
      <view class="indicator" :style="{ '--indicator': currentItemId, '--emoji-num': emojis.length }">
        <view v-for="(item, index) in emojis" :id="`indicator-${index}`" :key="index" class="indicator-item">
          <image webp class="emoji-icon" :src="item[0].normal" @tap="switchEmoji(index)" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import EmojiItem from './emoji-item.vue'
import { emojis } from '@/components/chat-input-tools/components/emoji/emojis'

export default defineComponent({
  name: 'Emoji',
  components: { EmojiItem },
  setup() {
    const state = reactive({
      currentItemId: '0', // 当前表情包面板
      scrollInto: '',
    })

    // 切换表情包
    const switchEmoji = (index: number) => {
      state.currentItemId = index + ''
      state.scrollInto = `indicator-${index}`
    }
    // 切换swiper
    const swiperChange = (e: any) => {
      state.currentItemId = e.detail.currentItemId
      state.scrollInto = `indicator-${e.detail.currentItemId}`
    }

    return {
      ...toRefs(state),
      emojis,
      swiperChange,
      switchEmoji,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/components/chat-input-tools/chat-tools.scss';

.emoji ::v-deep {
  height: $tool-panel-height;
  display: flex;
  flex-direction: column;
  .swiper {
    height: 100%;
  }

  .indicator {
    position: relative;
    height: rpx(100);
    display: flex;
    align-items: center;
    padding: rpx(0) rpx(18);
    border-top: 1px solid #eaeaea;
    &::after {
      content: '';
      padding: rpx(30) rpx(44);
      border-radius: rpx(60);
      position: absolute;
      transform: translateX(calc(var(--indicator) / var(--emoji-num) * (#{rpx(86)} * var(--emoji-num))));
      transition: transform 0.3s;
      background-color: #eaeaea;
    }

    .indicator-item {
      position: relative;
      padding: rpx(8) rpx(22);
      z-index: 10;
      @include flex-center;
      .emoji-icon {
        width: rpx(44);
        height: rpx(44);
      }
    }
  }
}
</style>
