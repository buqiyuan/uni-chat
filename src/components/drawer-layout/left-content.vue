<template>
  <view class="left-content">
    <view class="close" @tap="close">
      <icon-font icon="close" size="40" />
    </view>
    <!--    用户信息start-->
    <view class="top-wrapper">
      <view class="user-info">
        <image class="avatar" :src="apiUrl + currentUser.avatar" />
        <view class="user-desc">
          <text class="nickname"> {{ currentUser.username }} </text>
          <text class="level"> v1 </text>
          <text class="sign"> 没有过不去的，只有回不去的。没有过不去的，只有回不去的。 </text>
        </view>
      </view>
    </view>
    <!--    用户信息end-->
    <!--    列表 start-->
    <scroll-view class="func-list" scroll-y="true">
      <template v-for="funcItem in funcList">
        <view :key="funcItem.icon" class="func-item">
          <icon-font class="func-icon" :icon="funcItem.icon" />
          <text class="func-title">
            {{ funcItem.title }}
          </text>
          <icon-font class="arrow" icon="youjiantou" />
        </view>
      </template>
    </scroll-view>
    <!--    列表 end-->
    <!--    底部工具栏start-->
    <view class="tool-bar">
      <template v-for="item in toolBar">
        <view :key="item.icon" class="tool-bar-item">
          <icon-font class="tool-bar-item-icon" :icon="item.icon" />
          <text class="tool-bar-item-title">
            {{ item.title }}
          </text>
        </view>
      </template>
      <view class="tool-bar-item">
        <text class="celsius"> 28°C </text>
        <text class="tool-bar-item-title"> 天河 </text>
      </view>
    </view>
    <!--    底部工具栏start-->
  </view>
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api'
import { funcList, toolBar } from './funcList'
import store from '@/store'

export default defineComponent({
  name: 'LeftContent',
  emits: ['close'],
  setup(_, { emit }) {
    const close = () => emit('close')
    const currentUser = computed(() => store.getters['app/user'])
    const apiUrl = computed(() => store.getters['app/apiUrl'])

    return {
      funcList,
      toolBar,
      apiUrl,
      currentUser,
      close,
    }
  },
})
</script>

<style lang="scss" scoped>
$padding: rpx(26);

.left-content {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .close {
    position: absolute;
    top: calc(var(--status-bar-height) + #{$padding});
    right: $padding;
    z-index: 99;
    color: white;
    @include click-text-active;
  }

  .top-wrapper {
    position: relative;
    height: 190px;
    padding: $padding;
    color: white;
    background-image: url('data:image/jpeg;base64,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');
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;

    &::before {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.2);
      content: '';
    }

    /* 用户信息start */
    .user-info {
      position: absolute;
      bottom: rpx(38);
      left: $padding;
      display: flex;

      .avatar {
        width: rpx(120);
        height: rpx(120);
        border: 1px solid white;
        border-radius: rpx(120);
      }

      .user-desc {
        display: flex;
        margin-left: rpx(24);
        flex-direction: column;
        justify-content: space-between;

        .nickname {
          font-size: rpx(36);
        }

        .level {
          font-size: 14px;
          color: gold;
        }

        .sign {
          width: 66vw;
          overflow: hidden;
          font-size: rpx(28);
          text-overflow: ellipsis;
          word-break: keep-all;
          white-space: nowrap;
        }
      }
    }

    /* 用户信息end */
  }

  /* 功能列表start */
  .func-list {
    flex: 4;
    padding: rpx(54) 0 0;
    font-size: rpx(35);

    .func-item {
      display: flex;
      align-items: center;
      padding: rpx(24) $padding;
      @include click-bg-active;

      .func-icon {
        margin-right: rpx(28);
        font-size: rpx(38);
        color: #989eb4;
      }

      .arrow {
        margin-left: auto;
        color: #989eb4;
      }
    }
  }

  /* 功能列表end */

  .tool-bar {
    display: flex;
    padding: $padding;

    &-item {
      display: flex;
      margin-right: rpx(50);
      font-size: rpx(26);
      flex-direction: column;
      justify-content: space-between;
      @include click-text-active();

      &-icon,
      .celsius {
        font-size: rpx(46);
        color: #989eb4;
        @include click-text-active();
      }

      .celsius {
        font-size: rpx(35);
      }
    }
  }
}
</style>
