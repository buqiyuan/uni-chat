<script lang="ts">
import Vue from 'vue'
import { SET_KEYBOARD_HEIGHT } from '@/store/modules/app/mutation-types'

export default Vue.extend({
  mpType: 'app',
  onLoad() {
    // console.log(process.env)
    setTimeout(async () => {
      const userId = this.$store.getters['app/user'].userId
      const socket = this.$store.getters['chat/socket']
      console.log(userId, 'userId')
      if (userId && !socket) {
        await this.$store.dispatch('chat/connectSocket')
        console.log(this.$Route?.name, 'this.$Route?.name')
        if (this.$Route?.name == 'login') {
          this.$Router.replace({ name: 'index' })
        }
      } else if (this.$Route?.name != 'login') {
        this.$Router.replace({ name: 'login' })
      }
    }, 200)
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
@import '~uview-ui/index.scss';
/* 每个页面公共css */
@import 'styles/iconfont.css';
@import '~@/styles/common.scss';
</style>
