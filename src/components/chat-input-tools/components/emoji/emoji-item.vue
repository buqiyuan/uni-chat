<template>
  <view class="emoji-item-wrapper">
    <template v-if="isShow">
      <scroll-view scroll-y="true" class="scroll-Y">
        <view v-for="item in emojiItem" :key="item.normal" class="emoji-item">
          <image
            class="emoji-png"
            :lazy-load="true"
            webp
            :src="item.normal"
            @tap="selectEmoji(item)"
            @longpress="longPress(item)"
          />
          <view v-if="previewEmoji === item.active" class="emoji-preview">
            <image webp class="emoji-gif" :src="item.active" />
          </view>
        </view>
      </scroll-view>
    </template>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, inject, PropType } from '@vue/composition-api'
import { IProps, EmojiItem } from './types'

export default defineComponent({
  name: 'EmojiItem',
  props: {
    emojiItem: {
      type: Array as PropType<EmojiItem[]>,
      default: () => [],
    },
    index: {
      type: [Number, String] as PropType<string | number>,
      default: -1,
    },
    currentIndex: {
      type: [Number, String] as PropType<string | number>,
      default: '',
    },
  },
  setup(props: IProps) {
    const state = reactive({
      previewEmoji: '',
      isShow: false, // 是否加载表情包
    })

    const setEmoji = inject('set-emoji') as (emoji: string) => any

    watch(
      () => props.currentIndex,
      (currentIndex) => {
        if (!state.isShow) {
          state.isShow = currentIndex == props.index
        }
      },
      {
        immediate: true,
      }
    )

    // 选择表情
    const selectEmoji = (emojiItem: EmojiItem) => {
      state.previewEmoji = ''
      setEmoji(emojiItem.active)
      console.log(emojiItem, 'emojiItem')
    }

    // 长按图标
    const longPress = (item: any) => {
      state.previewEmoji = item.active
    }

    return {
      ...toRefs(state),
      selectEmoji,
      longPress,
    }
  },
})
</script>

<style lang="scss" scoped>
.emoji-item-wrapper ::v-deep {
  .scroll-Y {
    height: calc(40vh - #{rpx(100)});
    .uni-scroll-view-content {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      align-content: start;

      .emoji-item {
        position: relative;
        padding: rpx(24);
        @include flex-center;
        .emoji-png,
        .emoji-gif {
          width: rpx(60);
          height: rpx(60);
        }
        .emoji-preview {
          position: absolute;
          left: 50%;
          bottom: rpx(100);
          transform: translateX(-50%);
          padding: rpx(26);
          border-radius: rpx(12);
          background-color: white;
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
          z-index: 999;
          @include popover(top);
        }
      }
    }
  }
}
</style>
