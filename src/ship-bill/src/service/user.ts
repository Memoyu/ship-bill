import request from '@/utils/request'

export interface IWxContent {
  appid: string
  openid: string
  unionid: string
}

export interface IUser {
  _id: string
  openid: string
  name: string
  avatar: string
  company: string
  phone: string
  licensePlate: string
}

export interface ICreateUser {
  openid: string
  company: string
  name: string
  avatar: string
}

export interface IUpdateUser {
  _id: string
  company: string
  name: string
  avatar: string
  phone?: string
  licensePlate?: string
}

export async function getOpenId() {
  return request<IWxContent>({
    type: 'USER',
    method: 'openid',
    hideErrorToast: false,
  })
}

/**
 * 获取用户
 * @param id openid 或 _id
 * @returns
 */
export async function getUser(id: string) {
  return request<IUser>({
    type: 'USER',
    method: 'get',
    data: id,
  })
}

export async function createUser(user: ICreateUser) {
  return request<IUser>({
    type: 'USER',
    method: 'create',
    data: user,
  })
}

export async function updateUser(user: IUpdateUser) {
  return request<IUser>({
    type: 'USER',
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
