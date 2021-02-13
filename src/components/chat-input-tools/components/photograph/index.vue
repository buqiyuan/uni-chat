<template>
  <view class="photograph"> 请在 <text class="link" @tap="toDownLoad">APP</text> 上使用拍照功能 </view>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { EPlatform, Platform } from '@/utils/platform'
//#ifdef H5
import { saveAs } from 'file-saver'
//#endif

const downloadLink = process.env.VUE_APP_APK_DOWNLOAD_URL || ''
export default defineComponent({
  name: 'Photograph',
  setup() {
    const toDownLoad = () => {
      if (Platform == EPlatform.H5) {
        saveAs(downloadLink, 'uni-chat.apk')
      }
    }
    return {
      toDownLoad,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '../../chat-tools';
.photograph {
  height: $tool-panel-height;
  @include flex-center();
  .link {
    color: #00a8ff;
  }
}
</style>
