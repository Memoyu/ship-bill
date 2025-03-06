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

export type GetBills = {
  type: number
  begin: number
  end: number
}

export type BillsWithTotal = {
  items: Bill[]
  expend: number
  income: number
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

export type HomeBillStore = {
  summary: HomeBillSummary
  reports: HomeBillReport[]
}

export type HomeBillSummary = {
  expend: number
  income: number
  oilQuantity: number
  oilCost: number
  outputValue: number
}

export type HomeBillReport = {
  expend: number
  income: number
  date: string
}

export async function getBill(id: string) {
  return request<Bill>({
    type,
    method: 'get',
    data: id,
  })
}

export async function getBills(req: GetBills) {
  return request<BillsWithTotal>({
    type,
    method: 'list',
    data: req,
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

export async function getHomeBillSummary(begin: number, end: number) {
  return request<HomeBillSummary>({
    type,
    method: 'home_summary',
    data: { begin, end },
  })
}

export async function getHomeBillReport(begin: number, end: number) {
  return request<HomeBillReport[]>({
    type,
    method: 'home_report',
    data: { begin, end },
  })
}
