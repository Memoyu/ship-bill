import request from '@/utils/request'
const type = 'USER'

export type WxContent = {
  appid: string
  openid: string
  unionid?: string
}

export type User = {
  _id: string
  openid: string
  name: string
  avatar: string
  phone: string
  company: string
  licensePlate: string
  updateTime: number
  createTime: number
}

export type CreateUser = {
  name: string
  avatar: string
  phone: string
  company: string
  licensePlate: string
}

export type UpdateUser = {
  _id: string
  name: string
  avatar: string
  phone: string
  company: string
  licensePlate: string
}

export async function getOpenId() {
  return request<WxContent>({
    type,
    method: 'openid',
    hideErrorToast: false,
  })
}

/**
 * 获取用户
 * @param id openid 或 _id
 * @returns
 */
export async function getUser(id: string, hideErrorToast: boolean = false) {
  return request<User>({
    type,
    method: 'get',
    data: id,
    hideErrorToast,
  })
}

export async function createUser(user: CreateUser) {
  return request<User>({
    type,
    method: 'create',
    data: user,
  })
}

export async function updateUser(user: UpdateUser) {
  return request<User>({
    type,
    method: 'update',
    data: user,
  })
}

export async function uploadAvatar(openid: string, fileId: string) {
  return new Promise<string>((resolve, reject) => {
    // 上传头像
    wx.cloud.uploadFile({
      // 上传至微信云存储
      cloudPath: 'avatars/' + openid + `-${new Date().getTime()}` + '.jpg', // 使用时间戳加随机数作为上传至云端的图片名称
      filePath: fileId, // 本地文件路径
      success: (res) => {
        // 返回文件 ID
        // console.log('上传成功', res)
        resolve(res.fileID)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}
