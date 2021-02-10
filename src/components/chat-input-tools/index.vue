<template>
  <view>
    <view :class="{ mask: isOpenEmojiPanel }" @tap.self="closePanel"></view>
    <view class="chat-input-tools">
      <view class="input-tools">
        <view v-for="iconItem in toolIcons" :key="iconItem" @tap="tapTool(iconItem)">
          <icon-font :icon="iconItem" :class="{ active: iconItem === currentToolName }" />
        </view>
      </view>
      <view v-if="isMounted" class="panel" :class="{ opened: isOpenEmojiPanel }">
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
import { defineComponent, reactive, toRefs, onMounted } from '@vue/composition-api'
import Speech from '@/components/chat-input-tools/components/speech/index.vue'
import Photo from '@/components/chat-input-tools/components/Photo.vue'
import Photograph from '@/components/chat-input-tools/components/Photograph.vue'
import RedPacket from '@/components/chat-input-tools/components/RedPacket.vue'
import Emoji from '@/components/chat-input-tools/components/emoji/Emoji.vue'
import Other from '@/components/chat-input-tools/components/Other.vue'

const toolIcons = ['icon-yuyin', 'icon-tupian', 'icon-Camera1', 'icon-hongbao', 'icon-biaoqingjihuo', 'icon-add1']

export default defineComponent({
  name: 'ChatInputTools',
  components: { Other, Emoji, RedPacket, Photograph, Photo, Speech },
  setup() {
    const state = reactive({
      currentToolName: '',
      isMounted: false,
      isOpenEmojiPanel: false, // 是否已经打开表情面板
    })

    const tapTool = (iconName: string) => {
      // 是否已经点击过了
      const isTaped = state.currentToolName === iconName
      state.isOpenEmojiPanel = !isTaped
      state.currentToolName = isTaped ? '' : iconName
      state.isMounted = true
      console.log(state.currentToolName)
    }

    // 关闭面板
    const closePanel = () => {
      state.isOpenEmojiPanel = false
      state.currentToolName = ''
    }

    onMounted(() => {
      setTimeout(() => {
        state.isMounted = true
      }, 3000)
    })

    return {
      ...toRefs(state),
      toolIcons,
      closePanel,
      tapTool,
    }
  },
})
</script>

<style lang="scss" scoped>
.mask {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: -1;
}
.chat-input-tools {
  position: relative;
  z-index: 10;
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
    will-change: max-height;
    transition: max-height 0.6s;
    &.opened {
      max-height: 60vh;
    }
  }
}
</style>
