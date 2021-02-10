<template>
  <view class="tab-bar">
    <template v-for="tabItem in tabs">
      <view
        :key="tabItem.icon"
        :class="{ active: active === tabItem.icon }"
        class="tab-item"
        @tap="tapTabItem(tabItem.icon)"
      >
        <icon-font :icon="tabItem.icon" />
        <view class="title">
          {{ tabItem.title }}
        </view>
      </view>
    </template>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watchEffect } from '@vue/composition-api'
import { userStore } from '@/store'
import { useClientRect } from '@/hooks/useClientRect'

const tabs = [
  {
    title: '消息',
    icon: 'message',
  },
  {
    title: '联系人',
    icon: 'contact',
  },
  {
    title: '看点',
    icon: 'look-point',
  },
  {
    title: '动态',
    icon: 'dynamic',
  },
]
export default defineComponent({
  name: 'TabBar',
  emits: ['tab-change'],
  setup(_, { emit }) {
    const state = reactive({
      active: tabs[0].icon,
      tabBarHeight: 0,
    })

    const clientRect = useClientRect('.tab-bar')
    const store = userStore()

    watchEffect(() => {
      store.commit('app/setTabBarHeight', clientRect.value?.height)
    })

    const tapTabItem = (icon: string) => {
      state.active = icon
      emit('tab-change', icon)
    }

    return {
      ...toRefs(state),
      tabs,
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

    &:active .iconfont {
      transform: scale(0.3);
      transition: transform ease-in-out 0.3s;
    }

    &.active {
      color: #03081b;

      .iconfont {
        background-image: linear-gradient(to bottom, #91e0fe 20%, #3bc8ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .iconfont {
      font-size: rpx(48);
    }
  }
}
</style>
