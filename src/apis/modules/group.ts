import minRequest from '@/utils/request'

/**
 * 群名模糊搜索用户
 * @param string
 */
export function getGroupsByName(groupName: string) {
  return minRequest.get(`/group/findByName?groupName=${groupName}`)
}

/**
 * 群分页消息
 * @param params
 */
export async function getGroupMessages(params: PagingParams) {
  return await minRequest.get('/group/groupMessages', {
    params,
  })
}
