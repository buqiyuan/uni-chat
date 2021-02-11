export const toolImages = [
  {
    title: '语音通话',
    url: 'audio.png',
  },
  {
    title: '视频通话',
    url: 'video.png',
  },
  {
    title: '一起派对',
    url: 'gf4.png',
  },
  {
    title: '分享屏幕',
    url: 'share_screen.png',
  },
  {
    title: '热图',
    url: 'aio_panel_hotpic_plus.png',
  },
  {
    title: '文件',
    url: 'send_file.png',
  },
  {
    title: '礼物',
    url: 'troop_deliver_flowsers.png',
  },
  {
    title: '直播间',
    url: 'audio_group_broadcast.png',
  },
  {
    title: '签到',
    url: 'cdw.png',
  },
  {
    title: '位置',
    url: 'location.png',
  },
  {
    title: '匿名',
    url: 'qb_troop_anonymous_icon.png',
  },
  {
    title: '收藏',
    url: 'qfav_misc_aio_plus_icon.png',
  },
  {
    title: '群课堂',
    url: 'audio_group_open_class.png',
  },
  {
    title: '健康收集',
    url: 'dgx.png',
  },
  {
    title: '红包',
    url: 'hongbao.png',
  },
  {
    title: '一起听歌',
    url: 'listentogether.png',
  },
  {
    title: '一起看',
    url: 'watchtogether.png',
  },
  {
    title: '一起K歌',
    url: 'sing_together.png',
  },
  {
    title: '一起玩',
    url: 'mini_app.png',
  },
  {
    title: '名片',
    url: 'ocr_card.png',
  },
  {
    title: '投票',
    url: 'qb_group_toupiao.png',
  },
  {
    title: '收钱',
    url: 'cdv.png',
  },
  {
    title: '坦白说',
    url: 'qb_troop_confess_talk_enter_icon.png',
  },
  {
    title: '涂鸦',
    url: 'aio_panel_scribble_normal.png',
  },
  {
    title: '腾讯文档',
    url: 'send_tencentdoc.png',
  },
].map((item) => ({ ...item, url: `/static/chat_tools/${item.url}` }))
