<template>
  <view @touchend.stop @touchmove.stop @touchstart.stop>
    <uni-swipe-action>
      <template v-for="item in swipeList">
        <uni-swipe-action-item :key="item.id" :right-options="item.options">
          <view class="content-box">
            <text class="content-text">{{ item.content }}</text>
          </view>
        </uni-swipe-action-item>
      </template>
    </uni-swipe-action>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  name: 'ScrollSnap',
  setup() {
    const state = reactive({
      swipeList: [
        {
          options: [
            {
              text: '添加',
              style: {
                backgroundColor: 'rgb(255,58,49)',
              },
            },
          ],
          id: 0,
          content: 'item1',
        },
        {
          id: 1,
          options: [
            {
              text: '置顶',
            },
            {
              text: '删除',
              style: {
                backgroundColor: 'rgb(255,58,49)',
              },
            },
          ],
          content: 'item2',
        },
        {
          id: 2,
          options: [
            {
              text: '置顶',
            },
            {
              text: '标记为已读',
              style: {
                backgroundColor: 'rgb(254,156,1)',
              },
            },
            {
              text: '删除',
              style: {
                backgroundColor: 'rgb(255,58,49)',
              },
            },
          ],
          content: 'item3',
        },
      ],
    })
    const swipeChange = (e: any, index: number) => {
      console.log('返回：', e)
      console.log('当前索引：', index)
    }
    const swipeClick = (e: any, index: number) => {
      let { content } = e
      if (content.text === '删除') {
        uni.showModal({
          title: '提示',
          content: '是否删除',
          success: (res) => {
            if (res.confirm) {
              state.swipeList.splice(index, 1)
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
        })
      } else if (content.text === '添加') {
        if (state.swipeList.length < 10) {
          state.swipeList.push({
            id: new Date().getTime(),
            options: [
              {
                text: '置顶',
              },
              {
                text: '标记为已读',
                style: {
                  backgroundColor: 'rgb(254,156,1)',
                },
              },
              {
                text: '删除',
                style: {
                  backgroundColor: 'rgb(255,58,49)',
                },
              },
            ],
            content: '新增' + new Date().getTime(),
          })
          uni.showToast({
            title: `添加了一条数据`,
            icon: 'none',
          })
        } else {
          uni.showToast({
            title: `最多添加十条数据`,
            icon: 'none',
          })
        }
      } else {
        uni.showToast({
          title: `点击了${e.content.text}按钮`,
          icon: 'none',
        })
      }
    }

    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.scroll-snap ::v-deep .uni-scroll-view-content {
  width: 100vw;
  height: 100px;
  display: flex;
  overflow: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  .scroll-snap-item1 {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: 100vw;
    background-color: #0ddc84;
  }
  .scroll-snap-item2 {
    scroll-snap-align: start;
    flex-shrink: 0;
    width: 180px;
    background-color: #00a8ff;
    display: flex;
    color: white;
    .top {
      @include flex-center();
      flex: 1;
      background-color: #ccc;
    }
    .del {
      @include flex-center();
      flex: 1;
      background-color: red;
    }
  }
}
.content-box {
  flex: 1;
  /* #ifdef APP-NVUE */
  justify-content: center;
  /* #endif */
  height: 44px;
  line-height: 44px;
  padding: 0 15px;
  position: relative;
  background-color: #fff;
  border-bottom-color: #f5f5f5;
  border-bottom-width: 1px;
  border-bottom-style: solid;
}
</style>
