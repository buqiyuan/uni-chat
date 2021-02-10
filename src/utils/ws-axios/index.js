import { WsAxios } from './WsAxios'

const wsAxios = new WsAxios({
  url: process.env.VUE_APP_WEBSOCKET_API,
  time: 60000,
  ping: () => ({
    source: 'h5',
    userid: sessionStorage.getItem('yzkf_userid'),
    ts: new Date().getTime(),
    data: { upcmd: 'ping' },
  }),
})

wsAxios.intercepts.request((params) => {
  console.log(params, '请求拦截：params')
  return params
})

wsAxios.intercepts.response((response) => {
  console.log('响应拦截：', response)
  return response
})

export default wsAxios
