<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  mpType: 'app',
})
</script>

<style lang="scss">
/* 每个页面公共css */
@import 'styles/iconfont.css';
@import '~@/styles/common.scss';
view,
text {
  box-sizing: border-box;
  &::-webkit-scrollbar {
    width: 0;
  }
}
image {
  will-change: transform;
}
</style>
