import request from '@/utils/request'
import { Category } from './category'

export interface BillCategory extends Category {
  total: number
  unitPrice: number
}
