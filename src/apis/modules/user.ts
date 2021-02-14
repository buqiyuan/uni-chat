import minRequest from '@/utils/request'

/**
 * 更新用户名
 * @param username
 */
export const patchUserName = (username: string) => minRequest.patch(`/user/username?username=${username}`)

/**
 * 更新用户密码
 * @param password
 *
 */
export const patchPassword = (password: string) => minRequest.patch(`/user/password?password=${password}`)

/**
 * 用户名模糊搜索用户
 * @param username
 */
export function getUsersByName(username: string) {
  return minRequest.get(`/user/findByName?username=${username}`)
}

/**
 * 用户头像上传
 * @param params
 */
export function setUserAvatar(params: FormData) {
  return minRequest.post('/user/avatar', params, {
    header: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 删除用户
 * @param params
 */
export function deleteUser(params: any) {
  return minRequest.delete('/user', { params })
}
