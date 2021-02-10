<template>
  <view class="speech">
    <swiper
      class="swiper"
      :current-item-id="currentItemId"
      :indicator-dots="false"
      :autoplay="false"
      @change="swiperChange"
    >
      <template v-for="(speechItem, speechIndex) in speechTypes">
        <swiper-item :key="speechIndex" class="swiper-item" :item-id="speechIndex + ''" @touchmove="touchmove">
          <view class="tips">{{ speechTypes[currentItemId].tips }}</view>
        </swiper-item>
      </template>
    </swiper>
    <view class="speech-tool" @longpress="isPress = true" @touchend="isPress = false">
      <image class="tool-image" :src="imageFullPath"></image>
    </view>
    <view class="indicator" :style="{ '--current-index': currentItemId, '--self-width': indicatorRect.width }">
      <view
        v-for="(item, index) in speechTypes"
        :key="item.title"
        :class="{ active: currentItemId == index }"
        class="indicator-item"
      >
        {{ item.title }}
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed, onMounted } from '@vue/composition-api'
import { useClientRect } from '@/hooks/useClientRect'

const speechTypes = [
  {
    title: '变声',
    tips: '按住变声',
    normal: 'changevoice',
    press: 'changevoice_press',
  },
  {
    title: '对讲',
    tips: '按住说话',
    normal: 'speak_microphone',
    press: 'speak_microphone_press',
  },
  {
    title: '录音',
    tips: '点击录音',
    normal: 'record_start_nor',
    press: 'record_start_press',
  },
]

export default defineComponent({
  name: 'Speech',
  setup() {
    const state = reactive({
      currentItemId: '0',
      isPress: false, // 是否长按
      indicatorRect: {},
    })

    onMounted(async () => {
      state.indicatorRect = await useClientRect('.speech .indicator')
    })

    // 切换时触发
    const swiperChange = async (e: any) => {
      state.currentItemId = e.detail.currentItemId
      state.indicatorRect = await useClientRect('.speech .indicator')
    }

    const touchmove = (e: TouchEvent) => {
      console.log(e)
    }

    // 图片路径
    const imageFullPath = computed(() => {
      const status = state.isPress ? 'press' : 'normal'
      const index = ~~state.currentItemId
      return `/static/skin_aio/${speechTypes[index][status]}.png`
    })

    return {
      ...toRefs(state),
      imageFullPath,
      touchmove,
      speechTypes,
      swiperChange,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/components/chat-input-tools/chat-tools.scss';

.speech ::v-deep {
  position: relative;
  .swiper {
    height: $tool-panel-height;
    .swiper-item {
      position: relative;
      .tips {
        @include position-center;
        top: 18%;
        color: #ccc;
        text-align: center;
      }
    }
  }
  .speech-tool {
    @include position-center;
    .tool-image {
      width: rpx(260);
      height: rpx(260);
    }
  }
  .indicator {
    position: absolute;
    bottom: rpx(36);
    left: 50%;
    transform: translateX(calc(var(--self-width) / 3 * var(--current-index) * -1px - #{rpx(32)}));
    display: flex;
    justify-content: center;
    transition: transform 0.2s;
    .indicator-item {
      font-size: rpx(28);
      color: #ccc;
      margin: 0 rpx(13);
      &.active {
        font-size: rpx(32);
        color: black;
      }
    }
  }
}
</style>
