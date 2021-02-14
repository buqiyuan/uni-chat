<script lang="ts">
import Vue from 'vue'
import { SET_KEYBOARD_HEIGHT } from '@/store/modules/app/mutation-types'

export default Vue.extend({
  mpType: 'app',
  onLaunch() {
    const userId = this.$store.getters['app/user'].userId
    console.log(userId, 'userId')
    if (userId) {
      this.$store.dispatch('chat/connectSocket')
    } else if (this.$Route.name != 'login') {
      this.$Router.replace({ name: 'login' })
    }
    uni.onKeyboardHeightChange((res) => {
      if (res.height > 0) {
        this.$store.commit(`app/${SET_KEYBOARD_HEIGHT}`, res.height)
      }
      console.log(this.$store.state.app.keyboardHeight)
    })
  },
})
</script>

<style lang="scss">
/* 每个页面公共css */
@import 'styles/iconfont.css';
@import '~@/styles/common.scss';
</style>
