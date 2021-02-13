export interface EmojiItem {
  normal: string
  active: string
}

export interface IProps {
  emojiItem: EmojiItem
  index: string | number
  currentIndex: string | number
}
