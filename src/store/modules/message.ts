const messageItem = {
  id: 1,
  logo: 'https://api.uomg.com/api/rand.avatar',
  title: '群里机器人',
  message: '你好！我是路飞。',
  unread: 0,
  lastTime: Date.now(),
}

export type MessageItem = typeof messageItem

export interface MessageIState {
  messageList: MessageItem[]
}

export const message = {
  namespaced: true,
  state: {
    messageList: Array.from({ length: 30 }).map((item, index) => ({
      id: index,
      // logo: 'https://api.uomg.com/api/rand.avatar?_t=' + Math.random(),
      logo:
        'https://api.prodless.com/avatar.png?size=24&color=' +
        ('00000' + ((Math.random() * 0x1000000) << 0).toString(16)).substr(-6),
      title: '群里机器人' + (index + 1),
      message: '你好！我是路飞。',
      unread: ~~(Math.random() * 100),
      lastTime: Date.now(),
    })), // 消息列表
  },
  mutations: {
    pushMessageList(state: MessageIState, messageItem: MessageItem): void {
      // 这里的 `state` 对象是模块的局部状态
      state.messageList.push(messageItem)
    },
  },
}
