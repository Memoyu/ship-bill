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
  subCounter: string
  remark: string
  date: number
  categories: BillCategory[]
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
  subCounter: string
  remark: string
  date: number
  categories: BillCategory[]
}

export type UpdateBill = {
  _id: string
  total: number
  rates: number
  amount: number
  address: string
  counter: string
  subCounter: string
  remark: string
  date: number
  categories: BillCategory[]
}

export type ReportBill = {
  date: string
  address: string
  counter: string
  subCounter: string
  bang: number
  fengGui: number
  yiTi: number
  jiaBan: number
  chaoShi: number
  buTie: number
  yaYe: number
  chaoZhong: number
  tiKong: number
  tiZhong: number
  haunKong: number
  haunZhong: number
  duGui: number
  tingChe: number
  gaoSu: number
  naioSu: number
  tiGui: number
  xiGui: number
  huanGui: number
  yanHuanGui: number
  xiuXiang: number
  buTai: number
  diaoGui: number
  daDan: number
  fengTiao: number
  xunGui: number
  xiuChe: number
  other: number
  oilTotal: number
  oilAmount: number
  outputValue: number
  commission: number
  remark: string
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

export async function getReportBillQuery(begin: number, end: number) {
  return request<ReportBill[]>({
    type,
    method: 'report_query',
    data: { begin, end },
  })
}

export async function getReportBillExport(begin: number, end: number) {
  return request<any>({
    type,
    method: 'report_export',
    data: { begin, end },
  })
}
