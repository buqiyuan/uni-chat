<template>
  <view>
    <view class="chat-input-tools">
      <view class="input-tools">
        <view v-for="iconItem in toolIcons" :key="iconItem" @tap="tapTool(iconItem)">
          <icon-font :icon="iconItem" :class="{ active: iconItem === currentToolName }" />
        </view>
      </view>
      <view v-if="isMounted" class="panel" :class="{ opened: isOpenTools }" @tap="hideKeyboard">
        <Speech v-show="currentToolName === toolIcons[0]" />
        <Photo v-show="currentToolName === toolIcons[1]" />
        <Photograph v-show="currentToolName === toolIcons[2]" />
        <RedPacket v-show="currentToolName === toolIcons[3]" />
        <Emoji v-show="currentToolName === toolIcons[4]" />
        <Other v-show="currentToolName === toolIcons[5]" />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, toRefs, watch, PropType } from '@vue/composition-api'
import { EPlatform, Platform } from '@/utils/platform'
import Speech from '@/components/chat-input-tools/components/speech/index.vue'
import Photo from '@/components/chat-input-tools/components/photo/index.vue'
import Photograph from '@/components/chat-input-tools/components/photograph/index.vue'
import RedPacket from '@/components/chat-input-tools/components/red-packet/index.vue'
import Emoji from '@/components/chat-input-tools/components/emoji/Emoji.vue'
import Other from '@/components/chat-input-tools/components/other-tools/index.vue'
import { IProps } from './types'

const toolIcons = ['icon-yuyin', 'icon-tupian', 'icon-Camera1', 'icon-hongbao', 'icon-biaoqingjihuo', 'icon-add1']

export default defineComponent({
  name: 'ChatInputTools',
  components: { Other, Emoji, RedPacket, Photograph, Photo, Speech },
  model: {
    prop: 'isOpenTools',
    event: 'changeModel',
  },
  props: {
    isOpenTools: {
      // 是否打开工具面板
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props: IProps, { emit }) {
    const state = reactive({
      currentToolName: '',
      isMounted: false,
    })

    // 关闭工具面板时，取消选中图标
    watch(
      () => props.isOpenTools,
      (value) => {
        if (!value) {
          state.currentToolName = ''
        }
      }
    )

    const tapTool = (iconName: string) => {
      if (iconName == 'icon-Camera1' && Platform === EPlatform.AppPlus) {
        return uni.chooseImage({
          sourceType: ['camera'],
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          success: (res) => {
            for (let i = 0; i < res.tempFilePaths.length; i++) {
              uni.getImageInfo({
                src: res.tempFilePaths[i],
                success: (image) => {
                  console.log(image, '图片信息')
                },
              })
            }
          },
        })
      }
      // 是否已经点击过了
      const isTaped = state.currentToolName === iconName
      state.currentToolName = isTaped ? '' : iconName
      state.isMounted = true
      emit('changeModel', !isTaped)
      uni.hideKeyboard()
    }

    const hideKeyboard = () => {
      uni.hideKeyboard()
    }

    onMounted(() => {
      setTimeout(() => {
        state.isMounted = true
      }, 3000)
    })

    return {
      ...toRefs(state),
      toolIcons,
      hideKeyboard,
      tapTool,
    }
  },
})
</script>

<style lang="scss" scoped>
.chat-input-tools {
  position: relative;
  content-visibility: auto;

  .input-tools {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: rpx(16) rpx(28);
    .iconfont {
      font-size: rpx(46);
      color: #989eb4;
      &.active {
        color: #00c9fd;
      }
    }
  }
  .panel {
    max-height: 0;
    opacity: 0;
    background-color: white;
    transition: max-height 0.3s, opacity 0.1s;
    &.opened {
      max-height: 42vh;
      opacity: 1;
    }
  }
}
</style>
