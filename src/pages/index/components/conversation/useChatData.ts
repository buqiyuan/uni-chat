import { computed, watch, ref } from '@vue/composition-api'
import store from '@/store'
import { minCache } from '@/utils/MinCache'

/**
 * @description 获取聊天信息列表
 */
export const useChatData = () => {
  const chatArr = ref<Array<Group | Friend>>([])

  const groupGather = computed((): GroupGather => store.getters['chat/groupGather'])
  const friendGather = computed((): FriendGather => store.getters['chat/friendGather'])
  // 当前用户，也就是我自己
  const currentUser = computed((): User => store.getters['app/user'])

  watch(
    [groupGather, friendGather],
    () => {
      sortChat()
    },
    {
      deep: true,
    }
  )

  // 获取消息列表数据
  const sortChat = async () => {
    const groups = Object.values(groupGather.value)
    const friends = Object.values(friendGather.value)
    // 此处避免Await造成v-for页面闪烁问题,所以在最后才赋值this.chatArr = roomArr;
    let roomArr = [...groups, ...friends]
    // 此处需要过滤本地已删除的会话
    const deletedChat = (await minCache.get(`${currentUser.value}-deletedChatId`)) as string[]
    if (Array.isArray(deletedChat)) {
      roomArr = roomArr.filter((chat) => !deletedChat.includes((chat as Group).groupId || chat.userId))
    }

    // 对聊天窗进行排序(根据最新消息时间)
    roomArr = roomArr.sort((a: Group | Friend, b: Group | Friend) => {
      if (a.messages && b.messages) {
        // @ts-ignore
        return b.messages[b.messages.length - 1].time - a.messages[a.messages.length - 1].time
      }
      if (a.messages) {
        return -1
      }
      return 1
    })

    // 查看是否有需要置顶列表
    const topChatId = (await minCache.get(`${currentUser.value}-topChatId`)) as string
    if (topChatId) {
      // 找到需要置顶的窗口
      const chat = roomArr.find((c) => ((c as Group).groupId || c.userId) === topChatId)
      if (chat) {
        // 移动至第一位
        roomArr = roomArr.filter((k) => ((k as Group).groupId || k.userId) !== topChatId)
        chat.isTop = true
        roomArr.unshift(chat)
      }
    }
    //#ifdef H5
    console.log(roomArr, 'roomArr')
    //#endif
    chatArr.value = roomArr
  }

  return {
    chatArr,
    groupGather,
    friendGather,
    currentUser,
    sortChat,
  }
}
