<template>
  <view class="login">
    <form class="login-form">
      <view class="login-form-item">
        <input v-model="username" class="input" maxlength="16" placeholder="QQ号/手机号/邮箱" />
      </view>
      <view class="login-form-item">
        <input v-model="password" password maxlength="16" class="input" placeholder="密码" />
      </view>
      <view class="uni-btn-v">
        <button
          :loading="loginLoading"
          :disabled="isDisabled"
          hover-class="login-btn-hover"
          class="button login-btn"
          @tap="login"
        >
          登录
        </button>
        <button
          :loading="registerLoading"
          :disabled="isDisabled"
          hover-class="register-btn-hover"
          class="button register-btn"
          @tap="register"
        >
          注册
        </button>
      </view>
    </form>
  </view>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, computed } from '@vue/composition-api'
import store from '@/store'

export default defineComponent({
  name: 'Login',
  setup(_, { root }) {
    const state = reactive({
      username: '',
      password: '',
      loginLoading: false,
      registerLoading: false,
    })

    // 提交过程中禁用按钮
    const isDisabled = computed(() => {
      return state.registerLoading || state.loginLoading
    })

    // 用户名或密码为空
    const isEmpty = () => {
      return state.username.trim() == '' || state.password.trim() == ''
    }
    // 用户登录
    const login = async () => {
      if (isEmpty()) {
        return uni.showToast({ title: '用户名或密码不能为空', icon: 'none' })
      }
      state.loginLoading = true
      const { username, password } = state
      console.log(username, password)
      const data = await store.dispatch('app/login', { username, password }).finally(() => (state.loginLoading = false))
      if (data) {
        await store.dispatch('chat/connectSocket')
        setTimeout(() =>
          root.$Router.push({
            name: 'index',
          })
        )
      }
    }
    // 注册用户
    const register = () => {
      if (isEmpty()) {
        return uni.showToast({ title: '用户名或密码不能为空', icon: 'none' })
      }
      state.registerLoading = true
      const { username, password } = state
      console.log(username, password)
      setTimeout(() => {
        state.registerLoading = false
      }, 1000)
    }

    return {
      ...toRefs(state),
      isDisabled,
      login,
      register,
    }
  },
})
</script>

<style lang="scss" scoped>
.login ::v-deep {
  width: 100vw;
  height: 100vh;
  padding: rpx(400) rpx(40) rpx(40);
  background-blend-mode: darken;
  background-image: url('../../static/bg_login.jpg');
  background-color: rgba(0, 0, 0, 0.2);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center 0;
  color: white;

  .login-form {
    .login-form-item {
      input {
        padding: rpx(20) 0;
        font-size: rpx(38);
        border-bottom: rpx(1) solid rgba(255, 255, 255, 0.2);
        .input-placeholder {
          color: white;
        }
      }
    }
    .button {
      margin-top: rpx(30);
      &::after {
        border: none;
      }
    }
    .login-btn {
      color: white;
      background-color: rgba(24, 180, 237, 0.8);
      &.login-btn-hover {
        background-color: rgba(7, 148, 214, 0.8);
      }
    }
    .register-btn {
      background-color: rgba(255, 255, 255, 0.8);
      &.register-btn-hover {
        color: white;
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}
</style>
