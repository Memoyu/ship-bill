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
  total: number
  rates: number
  amount: number
  address: string
  counter: string
  sub_counter: string
  remark: string
  date: number
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
  total: number
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
  _id: string
  total: number
  rates: number
  amount: number
  address: string
  counter: string
  sub_counter: string
  remark: string
  date: number
  categorys: BillCategory[]
}

export type HomeBillSummary = {
  expend: number
  income: number
  oilTotal: number
  oilCost: number
  outputValue: number
}

export type HomeBillReport = {
  expend: number
  income: number
  expendCount: number
  incomeCount: number
  date: string
}

export type EditBillStore = {
  add?: Bill // 新增的账单
  delete?: Bill // 删除的账单
  update?: UpdateBillStore // 更新的账单
}

export type UpdateBillStore = {
  old: Bill
  new: Bill
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

export async function deleteBill(id: string) {
  return request<Bill>({
    type,
    method: 'delete',
    data: id,
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
