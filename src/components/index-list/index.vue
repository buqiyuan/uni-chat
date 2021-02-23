<template>
  <view>
    <view class="index-list">
      <template v-for="(indexItem, indexKey) in indexObj">
        <view :key="indexKey" class="index-item">
          <view class="index-anchor">{{ indexKey }}</view>
          <template v-for="item in indexItem">
            <view :key="item.userId" class="index-cell">
              <slot name="cell" :item="item">
                {{ item[index] }}
              </slot>
            </view>
          </template>
        </view>
      </template>
    </view>
    <view class="index-bar">
      <template v-for="indexKey in indexList">
        <view :key="indexKey" class="index-bar-item">{{ indexKey }}</view>
      </template>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'IndexList',
  props: {
    indexObj: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: String,
      default: '',
    },
  },
  setup() {
    function genAlphabet() {
      const indexList = []
      const charCodeOfA = 'A'.charCodeAt(0)

      for (let i = 0; i < 26; i++) {
        indexList.push(String.fromCharCode(charCodeOfA + i))
      }

      return indexList
    }

    const indexList = genAlphabet()

    return {
      indexList,
    }
  },
})
</script>

<style scoped lang="scss">
.index-anchor {
  padding: rpx(20);
  background-color: #eee;
  font-size: rpx(28);
}
.index-bar {
  position: fixed;
  right: rpx(20);
  top: 50%;
  font-size: rpx(28);
  transform: translateY(-50%);
}
</style>
