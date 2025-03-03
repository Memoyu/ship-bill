import request from '@/utils/request'
const type = 'CONFIG'

export type Config = {
  _id: string
  openid: string
  commission: number
  oilPrices: number
  updateTime: number
  createTime: number
}

export type ConfigStore = {
  commission: number
  oilPrices: number
}

export type UpdateConfig = {
  _id?: string
  commission: number
  oilPrices: number
}

export async function getConfig() {
  return request<Config>({
    type,
    method: 'get',
  })
}

export async function updateConfig(config: UpdateConfig) {
  return request<Config>({
    type,
    method: 'update',
    data: config,
  })
}
