<template>
  <movable-area class="drawer-layout">
    <movable-view
      :x="moveX"
      :damping="36"
      :animation="animation"
      :disabled="disabled"
      class="movable-view"
      direction="horizontal"
      @change="onChange"
      @touchstart="touchstart"
      @touchend="touchend"
    >
      <view class="drawer-content">
        <view class="left">
          <slot name="left">
            <left-content @close="close" />
          </slot>
        </view>
        <view class="right">
          <slot name="right" />
        </view>
      </view>
    </movable-view>
  </movable-area>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, PropType, nextTick } from '@vue/composition-api'
import LeftContent from './left-content.vue'

export default defineComponent({
  name: 'DrawerLayout',
  components: { LeftContent },
  model: {
    prop: 'isOpen',
    event: 'changeModel',
  },
  props: {
    isOpen: {
      // 是否打开抽屉
      type: Boolean as PropType<boolean>,
      default: false,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      moveX: 0, // movable-view元素在x轴上需要移动的目标移动距离
      scrollX: 0, // movable-view移动过程中产生的change事件中的x轴移动值
      windowWidth: 0, // 屏幕的宽度
      startTimeStamp: 0, // 触摸开始的时间戳
      startX: 0, // 触摸开始的x坐标
      endX: 0, // 触摸结束的x坐标
      startY: 0, // 触摸开始的x坐标
      isMoving: false, // 是否处于移动状态中，此时禁止滑动
      animation: true, // 是否使用动画
    })

    uni.getSystemInfo({
      success: (res) => {
        state.windowWidth = res.windowWidth
        state.moveX = -res.windowWidth
      },
    })

    // 改变isOpen的值，双向绑定数据
    const emitIsOpen = () => {
      nextTick(() => emit('changeModel', state.moveX === 0))
    }

    watch(
      () => props.isOpen,
      (isOpen) => {
        if (isOpen) {
          state.isMoving = true
          state.moveX = -state.windowWidth
          setTimeout(() => {
            state.moveX = 0
            state.isMoving = false
          }, 50)
        }
      },
      {
        immediate: true,
      }
    )

    const onChange = (e: any) => {
      state.scrollX = e.detail.x
    }

    // 切换
    const doSwitch = () => {
      if (props.disabled) return
      setTimeout(() => {
        // 如果正处于关闭中的状态，则
        if (state.isMoving) {
          state.isMoving = false
          return
        }
        const halfW = state.windowWidth / 2
        state.moveX = Math.abs(state.scrollX) > halfW ? -state.windowWidth : 0
        emitIsOpen()
      }, 50)
    }

    // 触摸结束
    const touchend = (e: TouchEvent) => {
      if (props.disabled) return
      state.animation = true
      state.moveX = state.scrollX
      // 如果y轴滑动的距离比较大，则不进行切换。
      if (Math.abs(state.startY - e.changedTouches[0].clientY) > 50) {
        return doSwitch()
      }
      state.endX = e.changedTouches[0].clientX
      // 如果x轴滑动的距离较小，则不进行切换
      if (Math.abs(state.startX - state.endX) < 20) {
        return doSwitch()
      }
      // 如果触摸结束的时间戳减去触摸开始时的时间戳小于1秒，则为快速滑动
      if (e.timeStamp - state.startTimeStamp < 600) {
        setTimeout(() => {
          state.moveX = state.startX - state.endX < 0 ? 0 : -state.windowWidth
          emitIsOpen()
        }, 50)
      } else {
        doSwitch()
      }
    }

    const touchstart = (e: TouchEvent) => {
      const { timeStamp, changedTouches } = e
      state.animation = false
      state.startTimeStamp = timeStamp
      state.startX = changedTouches[0].clientX
      state.startY = changedTouches[0].clientY
    }
    // 关闭侧边栏
    const close = () => {
      state.isMoving = true
      state.moveX = 0
      setTimeout(() => {
        state.moveX = state.moveX === 0 ? -state.windowWidth : 0
        emitIsOpen()
      })
    }

    return {
      ...toRefs(state),
      close,
      onChange,
      touchstart,
      touchend,
    }
  },
})
</script>

<style lang="scss" scoped>
.drawer-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3);

  .movable-view {
    width: 200vw;
    height: 100vh;
    .drawer-content {
      display: grid;
      width: 200vw;
      height: 100vh;
      grid-template-columns: repeat(2, 100vw);
      overflow: hidden;
      background-color: white;
      &::-webkit-scrollbar {
        width: 0;
        background: transparent;
      }

      .left,
      .right {
        width: 100%;
        transform: translate(0);
      }
    }
  }
}
</style>
