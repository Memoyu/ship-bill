import request from '@/utils/request'
const type = 'CATEGORY'

export type Category = {
  _id: string
  openid: string
  type: number
  name: string
  base: boolean
  updateTime: number
  createTime: number
}

export type CreateCategory = {
  type: number
  name: string
}

export type UpdateCategory = {
  _id: string
  name: string
}

export async function getCategories(t: number = 0) {
  return request<Category[]>({
    type,
    method: 'list',
    data: t,
  })
}

export async function createCategory(category: CreateCategory) {
  return request<Category>({
    type,
    method: 'create',
    data: category,
  })
}

export async function updateCategory(category: UpdateCategory) {
  return request<Category>({
    type,
    method: 'update',
    data: category,
  })
}

export async function deleteCategory(id: string) {
  return request<Category>({
    type,
    method: 'delete',
    data: { _id: id },
  })
}
