<template>
  <view class="tab-bar">
    <template v-for="tabItem in tabs">
      <view
        :key="tabItem.icon"
        :class="{ active: active === tabItem.icon }"
        class="tab-item"
        @tap="tapTabItem(tabItem)"
      >
        <image :src="getImageFullPath(tabItem)" class="tab-icon"></image>
        <view class="title">
          {{ tabItem.title }}
        </view>
      </view>
    </template>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watchEffect } from '@vue/composition-api'

interface TabItem {
  title: string
  icon: string
  compName: string
}

const tabs = [
  {
    title: '消息',
    icon: 'conversation',
    compName: 'conversation',
  },
  {
    title: '联系人',
    icon: 'contact',
    compName: 'contact',
  },
  {
    title: '看点',
    icon: 'see',
    compName: 'look-point',
  },
  {
    title: '动态',
    icon: 'plugin',
    compName: 'dynamic',
  },
]
export default defineComponent({
  name: 'TabBar',
  emits: ['tab-change'],
  setup(_, { emit }) {
    const state = reactive({
      active: tabs[0].compName,
      tabBarHeight: 0,
    })

    // 获取图片路径
    const getImageFullPath = (tabItem: TabItem) => {
      return `/static/tabs/${tabItem.icon}_${state.active == tabItem.compName ? 'selected' : 'normal'}.png`
    }
    // 点击tab栏
    const tapTabItem = (tabItem: TabItem) => {
      state.active = tabItem.compName
      emit('tab-change', tabItem.compName)
    }

    return {
      ...toRefs(state),
      tabs,
      getImageFullPath,
      tapTabItem,
    }
  },
})
</script>

<style lang="scss" scoped>
.tab-bar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: flex;
  background-color: #fbfbfb;

  .tab-item {
    display: flex;
    padding: rpx(15);
    font-size: rpx(22);
    color: #b0b2bf;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:active .tab-icon {
      transform: scale(0.05);
      transition: transform ease-in-out 0.3s;
    }

    .tab-icon {
      width: rpx(60);
      height: rpx(60);
    }
  }
}
</style>
