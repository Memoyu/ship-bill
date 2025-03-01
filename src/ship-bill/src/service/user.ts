import request from '@/utils/request'

export interface IWxContent {
  appid: string
  openid: string
  unionid: string
}

export interface IUser {
  _id: string
  openid: string
  avatar: string
  company: string
  name: string
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
  company: string
  name: string
  avatar: string
  phone: string
  licensePlate: string
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
