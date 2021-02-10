<template>
  <text class="iconfont" :style="{ '--font-size': fontSize }" :class="[iconName]">
    <slot />
  </text>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from '@vue/composition-api'
interface IProps {
  icon: string
  size: string | number
}
export default defineComponent({
  name: 'IconFont',
  props: {
    icon: {
      type: String as PropType<string>,
      default: '',
    },
    size: {
      type: [String, Number] as PropType<string | number>,
      default: '',
    },
  },
  setup(props: IProps) {
    const iconName = computed(() => {
      return props.icon.startsWith('icon-') ? props.icon : 'icon-' + props.icon
    })
    const fontSize = computed(() => {
      const size = props.size + ''
      return /^\d+$/.test(size) ? uni.upx2px(Number(size)) + 'px' : size
    })

    return {
      iconName,
      fontSize,
    }
  },
})
</script>

<style lang="scss">
.iconfont {
  font-size: var(--font-size);
}
</style>
