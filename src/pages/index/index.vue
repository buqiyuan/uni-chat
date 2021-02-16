<template>
  <drawer-layout
    ref="drawerLayoutRef"
    v-model="isOpen"
    :disabled="isDisabledSlide"
    :style="{ '--body-height': bodyHeight }"
  >
    <template #right>
      <!--      动态组件--可惜不支持 -->
      <!--      <component :is="compName" />-->
      <!--      聊天信息列表-->
      <Conversation
        v-show="compName === 'conversation'"
        @changeSlideEnable="changeSlideEnable"
        @open-drawer="isOpen = true"
      />
      <!--      联系人列表-->
      <contact v-show="compName === 'contact'" />
      <!--      看点-->
      <look-point v-show="compName === 'look-point'" />
      <!--      动态-->
      <dynamic v-show="compName === 'dynamic'" />
      <!--       底部tab栏-->
      <tab-bar @tab-change="tabChange" />
    </template>
  </drawer-layout>
</template>
<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from '@vue/composition-api'
import DrawerLayout from '@/components/drawer-layout/index.vue'
import TabBar from './tab-bar.vue'
import Conversation from './components/conversation/index.vue'
import Contact from './components/contact/index.vue'
import LookPoint from './components/look-point/index.vue'
import Dynamic from './components/dynamic/index.vue'

export default defineComponent({
  name: 'Index',
  components: { DrawerLayout, TabBar, Conversation, Contact, LookPoint, Dynamic },
  setup(_, { root }) {
    const drawerLayoutRef = ref<any>(null)

    const bodyHeight = computed(() => root.$store.getters.bodyHeight)

    const state = reactive({
      isOpen: false, // 是否打开抽屉
      compName: 'conversation', // 当前展示的组件，点击tab时切换
      isDisabledSlide: false, // 禁止滑动打开抽屉
    })

    // 是否禁用滑动打开抽屉
    const changeSlideEnable = (val: boolean) => {
      state.isDisabledSlide = val
    }

    // tab栏切换时触发
    const tabChange = (iconName: string) => {
      state.compName = iconName
    }

    return {
      ...toRefs(state),
      drawerLayoutRef,
      bodyHeight,
      changeSlideEnable,
      tabChange,
    }
  },
})
</script>

<style lang="scss" scoped></style>
