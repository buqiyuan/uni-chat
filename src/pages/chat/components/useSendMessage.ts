import { computed } from '@vue/composition-api'
import store from '@/store'
import { router } from '@/router'

/**
 * 消息发送相关
 */
export const useSendMessage = () => {
  const socket = computed(() => store.getters['chat/socket'])
  const user = computed(() => store.getters['app/user'])

  const { chatType, id } = router.currentRoute.query

  // 发送消息
  const sendMessage = (data: SendMessage) => {
    if (data.type === 'group') {
      socket.value.emit('groupMessage', {
        userId: user.value.userId,
        groupId: id,
        content: data.message,
        width: data.width,
        height: data.height,
        fileName: data.fileName,
        messageType: data.messageType,
        size: data.size,
      })
    } else {
      socket.value.emit('friendMessage', {
        userId: user.value.userId,
        friendId: id,
        content: data.message,
        width: data.width,
        height: data.height,
        fileName: data.fileName,
        messageType: data.messageType,
        size: data.size,
      })
    }
  }

  return {
    sendMessage,
  }
}
