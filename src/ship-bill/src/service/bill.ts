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
  amount: number
  address: string
  counter: string
  sub_counter: string
  remark: string
  date: string
  categorys: BillCategory[]
}

export async function createBill(bill: CreateBill) {
  return request<Bill>({
    type,
    method: 'create',
    data: bill,
  })
}
