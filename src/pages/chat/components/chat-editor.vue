<template>
  <view>
    <text>renderjs区域</text>
    <view
      id="renderjs-view"
      :msg="msg"
      :change:msg="renderScript.receiveMsg"
      class="renderjs"
      @click="renderScript.emitData"
    >
    </view>
    <button class="app-view" @click="changeMsg">{{ msg }}</button>
  </view>
</template>

<script>
export default {
  name: 'ChatEditor',
  data() {
    return {
      msg: 'app-view',
    }
  },
  methods: {
    // 触发逻辑层出入renderjs数据改变
    changeMsg() {
      this.msg = 'hello renderjs' + Math.random() * 10
    },
    // 接收renderjs发回的数据
    receiveRenderData(val) {
      console.log('receiveRenderData-->', val)
      this.msg = val
    },
  },
}
</script>

<script module="renderScript" lang="renderjs">
import a from './test.js'
export default a
</script>

<style lang="scss" scoped>
#renderjs-view {
  width: 200px;
  height: 200px;
  background-color: #00a8ff;
}
</style>
