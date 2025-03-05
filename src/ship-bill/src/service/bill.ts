import request from '@/utils/request'
const type = 'BILL'

export interface BillCategory {
  categoryId: string
  name: string
  total: number
}

export type Bill = {
  _id: string
  openid: string
  type: number
  fee: number
  rates: number
  amount: number
  address: string
  counter: string
  sub_counter: string
  remark: string
  date: string
  categorys: BillCategory[]
  updateTime: number
  createTime: number
}

export type CreateBill = {
  type: number
  fee: number
  rates: number
  amount: number
  address: string
  counter: string
  sub_counter: string
  remark: string
  date: number
  categorys: BillCategory[]
}

export type UpdateBill = {
  fee: number
  rates: number
  amount: number
  address: string
  counter: string
  sub_counter: string
  remark: string
  date: number
  categorys: BillCategory[]
}

export async function getBill(id: string) {
  return request<Bill>({
    type,
    method: 'get',
    data: id,
  })
}

export async function createBill(bill: CreateBill) {
  return request<Bill>({
    type,
    method: 'create',
    data: bill,
  })
}

export async function updateBill(bill: UpdateBill) {
  return request<Bill>({
    type,
    method: 'update',
    data: bill,
  })
}
