<template>
  <swiper class="drawer-layout" :current-item-id="currentItemId" easing-function="easeInCubic" @change="change">
    <swiper-item item-id="left" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">
      <slot name="left">
        <left-content @close="close" />
      </slot>
    </swiper-item>
    <swiper-item item-id="right" @touchstart="touchstart" @touchend="touchend" @touchmove="touchmove">
      <slot name="right" />
    </swiper-item>
  </swiper>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import LeftContent from './left-content.vue'

export default defineComponent({
  name: 'DrawerLayout',
  components: { LeftContent },
  setup(_, ctx) {
    const state = reactive({
      currentItemId: 'right',
      startX: 0,
    })

    // 关闭左侧菜单
    const close = () => {
      state.currentItemId = 'right'
    }
    // swiper改变时
    const change = (e: any) => {
      state.currentItemId = e.detail.currentItemId
    }

    const touchmove = (e: TouchEvent) => {
      e.stopPropagation()
      const clientX = e.changedTouches[0].clientX
      if (state.startX > clientX && state.currentItemId == 'right') {
        e.stopPropagation()
        e.preventDefault()

        console.log(ctx, '右滑')
      }
      if (state.startX < clientX && state.currentItemId == 'left') {
        e.stopPropagation()
        e.preventDefault()
        console.log(ctx, '左滑')
      }
    }

    const touchend = (e: TouchEvent) => {
      state.startX = 0
    }

    const touchstart = (e: TouchEvent) => {
      console.log(e, 'touchstart')
      state.startX = e.changedTouches[0].clientX
    }

    return {
      ...toRefs(state),
      close,
      touchend,
      touchstart,
      touchmove,
      change,
    }
  },
})
</script>

<style scoped>
.drawer-layout {
  width: 100%;
  height: 100vh;
}
</style>
