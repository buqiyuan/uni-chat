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
    <button class="app-view" @click="changeMsg">app-view</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      msg: '',
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
    },
  },
}
</script>

<script module="renderScript" lang="renderjs">
export default {
  data() {
    return {
      name: 'render-vm'
    }
  },
  mounted() {
    const view = document.getElementById('renderjs-view')
    const button = document.createElement('button')
    button.innerText = '一个按钮'
    view.appendChild(button)
  },
  methods: {
    // 接收逻辑层发送的数据
    receiveMsg(newValue, oldValue, ownerVm, vm) {
      console.log('newValue', newValue)
      console.log('oldValue', oldValue)
      console.log('ownerVm', ownerVm)
      console.log('vm', vm)
    },
    // 发送数据到逻辑层
    emitData(e, ownerVm) {
      ownerVm.callMethod('receiveRenderData', this.name)
    }
  }
};
</script>
