<template>
  <view>
    <top-bar>
      <template #left>
        <navigator open-type="navigateBack">
          <icon-font icon="icon-zuojiantou" />
        </navigator>
      </template>
      <template #middle>
        <text class="top-bar-title">{{ title }}</text>
      </template>
      <template #right>
        <view class="tools">
          <icon-font icon="icon-caidan" />
        </view>
      </template>
    </top-bar>
    <chat-input />
  </view>
</template>

<script>
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import TopBar from '@/components/top-bar/index.vue'
import ChatInput from './components/chat-input.vue'

export default defineComponent({
  name: 'Chat',
  components: { TopBar, ChatInput },
  setup(_, ctx) {
    const state = reactive({
      title: '',
    })
    console.log(ctx.root.$Route)

    const { title, id } = ctx.root.$Route.query
    state.title = title

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.top-bar-title {
  @include position-center;
  @include text-ellipsis(1);
}
</style>
