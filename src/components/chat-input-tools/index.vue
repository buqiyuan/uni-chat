<template>
  <view>
    <view class="chat-input-tools">
      <view class="input-tools">
        <view v-for="iconItem in toolIcons" :key="iconItem.iconName" @tap="tapTool(iconItem)">
          <icon-font :icon="iconItem.iconName" :class="{ active: iconItem.iconName === currentToolName }" />
        </view>
      </view>
      <view class="panel" :class="{ opened: isOpenTools }" @tap="hideKeyboard">
        <Speech v-if="toolIcons[0].isShow" v-show="currentToolName === toolIcons[0].iconName" />
        <Photo v-if="toolIcons[1].isShow" v-show="currentToolName === toolIcons[1].iconName" />
        <Photograph v-if="toolIcons[2].isShow" v-show="currentToolName === toolIcons[2].iconName" />
        <RedPacket v-if="toolIcons[3].isShow" v-show="currentToolName === toolIcons[3].iconName" />
        <Emoji v-if="toolIcons[4].isShow" v-show="currentToolName === toolIcons[4].iconName" />
        <Other v-if="toolIcons[5].isShow" v-show="currentToolName === toolIcons[5].iconName" />
      </view>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, PropType } from '@vue/composition-api'
import { isAppPlus } from '@/utils/platform'
import Speech from '@/components/chat-input-tools/components/speech/index.vue'
import Photo from '@/components/chat-input-tools/components/photo/index.vue'
import Photograph from '@/components/chat-input-tools/components/photograph/index.vue'
import RedPacket from '@/components/chat-input-tools/components/red-packet/index.vue'
import Emoji from '@/components/chat-input-tools/components/emoji/Emoji.vue'
import Other from '@/components/chat-input-tools/components/other-tools/index.vue'
import { IProps } from './types'

type ToolIconItem = {
  iconName: string
  isShow: boolean
}

const toolIcons: ToolIconItem[] = [
  {
    iconName: 'icon-yuyin',
    isShow: false,
  },
  {
    iconName: 'icon-tupian',
    isShow: false,
  },
  {
    iconName: 'icon-Camera1',
    isShow: false,
  },
  {
    iconName: 'icon-hongbao',
    isShow: false,
  },
  {
    iconName: 'icon-biaoqingjihuo',
    isShow: false,
  },
  {
    iconName: 'icon-add1',
    isShow: false,
  },
]

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
      toolIcons,
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

    const tapTool = (iconItem: ToolIconItem) => {
      iconItem.isShow = true
      if (iconItem.iconName == 'icon-Camera1' && isAppPlus) {
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
      const isTaped = state.currentToolName === iconItem.iconName
      state.currentToolName = isTaped ? '' : iconItem.iconName
      emit('changeModel', !isTaped)
      uni.hideKeyboard()
    }

    const hideKeyboard = () => {
      uni.hideKeyboard()
    }

    return {
      ...toRefs(state),
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
