<template>
  <drawer-layout ref="drawerLayoutRef" v-model="isOpen" :style="{ '--body-height': bodyHeight }">
    <template #right>
      <!--      <component :is="compName" />-->
      <message v-show="compName === 'message'" @open-drawer="isOpen = true" />
      <contact v-show="compName === 'contact'" />
      <look-point v-show="compName === 'look-point'" />
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
import Message from './components/message/index.vue'
import Contact from './components/contact/index.vue'
import LookPoint from './components/look-point/index.vue'
import Dynamic from './components/dynamic/index.vue'

export default defineComponent({
  components: { DrawerLayout, TabBar, Message, Contact, LookPoint, Dynamic },
  setup(_, { root }) {
    const drawerLayoutRef = ref<any>(null)

    const bodyHeight = computed(() => root.$store.getters.bodyHeight)

    const state = reactive({
      isOpen: false,
      compName: 'message',
    })

    // tab栏切换时触发
    const tabChange = (iconName: string) => {
      state.compName = iconName
    }

    return {
      ...toRefs(state),
      drawerLayoutRef,
      bodyHeight,
      tabChange,
    }
  },
})
</script>

<style lang="scss" scoped></style>
