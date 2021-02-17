import minRequest from '@/utils/request'

/**
 * 群分页消息
 * @param params
 */

export async function getFriendMessage(params: PagingParams) {
  // eslint-disable-next-line no-return-await
  return await minRequest.get('/friend/friendMessages', params)
}
