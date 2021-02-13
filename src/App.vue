<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  mpType: 'app',
  onShow() {
    uni.onKeyboardHeightChange((res) => {
      if (res.height > 0) {
        this.$store.commit('app/setKeyboardHeight', res.height)
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
