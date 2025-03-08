import { EditBillStore, Bill } from '@/service'
import { defineStore } from 'pinia'

const initState: EditBillStore = {}

export const useEditBillStore = defineStore('edit-bill', () => {
  const editBillState = reactive<EditBillStore>({ ...initState })

  const addBillAc = (bill: Bill) => {
    // console.log('set edit bill', type, bill)
    editBillState.add = bill
  }

  const deleteBillAc = (bill: Bill) => {
    editBillState.delete = bill
  }

  const updateBillAc = (oldBill: Bill, newBill: Bill) => {
    // 构建新旧差值
    editBillState.update = {
      old: oldBill,
      new: newBill,
    }
    console.log('update bill', editBillState.update)
    setTimeout(() => {
      console.log('update bill timeout', editBillState.update)
    }, 3000)
  }

  return {
    editBillState,
    addBillAc,
    deleteBillAc,
    updateBillAc,
  }
})
