<template>
  <view
    class="container overflow-y-auto py-2 rounded-lg bg-indigo-400 mb-4"
    :style="{ height: windowHeight * 0.4 + 'px' }"
  >
    <view v-if="reports.length > 0">
      <view
        v-for="(report, index) in reports"
        :key="index"
        class="px-4 py-2 m-2 bg-white rounded-md"
        @click="() => handleClickItem(report)"
      >
        <view class="mb-2 flex items-center">
          <wd-text color="#000" :text="report.date" bold />
          <view class="flex items-center ml-5">
            <view class="flex items-center">
              <wd-text text="支" size="11px" />
              <view class="ml-1">
                <wd-text :color="expendColor" :text="report.expendCount" bold />
              </view>
            </view>
            <view class="flex items-center ml-4">
              <wd-text text="收" size="11px" />
              <view class="ml-1">
                <wd-text :color="incomeColor" :text="report.incomeCount" bold />
              </view>
            </view>
          </view>
        </view>
        <view class="flex justify-between items-center">
          <view class="flex items-center">
            <wd-text text="支" size="11px" />
            <view class="ml-1">
              <wd-text :color="expendColor" mode="price" :text="report.expend" bold />
            </view>
          </view>
          <view class="flex items-center">
            <wd-text text="收" size="11px" />
            <view class="ml-1">
              <wd-text :color="incomeColor" mode="price" :text="report.income" bold />
            </view>
          </view>
        </view>
      </view>
    </view>
    <view v-else class="h-full flex items-center">
      <wd-status-tip image="content" tip="暂无账单" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getHomeBillReport, HomeBillReport } from '@/service'
import dayjs from 'dayjs'
import { useEditBillStore } from '@/store'
import { isExpendType, isIncomeType } from '@/utils/bill'

const emits = defineEmits<{
  (e: 'click', value: string): void
}>()

const expendColor = getCurrentInstance().appContext.config.globalProperties.expendColor
const incomeColor = getCurrentInstance().appContext.config.globalProperties.incomeColor
const { windowHeight } = uni.getWindowInfo()
const beginDate = dayjs().startOf('month').valueOf()
const endDate = dayjs().endOf('month').valueOf()

const { editBillState } = useEditBillStore()
const reports = ref<HomeBillReport[]>([])

// 监听账单新增
watch(
  () => editBillState.add,
  (add) => {
    if (!add) return
    const date = dayjs(add.date).format('YYYY-MM-DD')
    const indexOf = reports.value.findIndex((r) => r.date === date)

    if (indexOf > -1) {
      // 存在汇总项
      const bill = reports.value[indexOf]
      bill.expend += isExpendType(add.type) ? add.amount : 0
      bill.income += isIncomeType(add.type) ? add.amount : 0
      bill.expendCount += isExpendType(add.type) ? 1 : 0
      bill.incomeCount += isIncomeType(add.type) ? 1 : 0
    } else {
      // 不存在汇总项
      reports.value.push({
        date,
        expend: isExpendType(add.type) ? add.amount : 0,
        income: isIncomeType(add.type) ? add.amount : 0,
        expendCount: isExpendType(add.type) ? 1 : 0,
        incomeCount: isIncomeType(add.type) ? 1 : 0,
      })
      // 排序
      reports.value.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    }
  },
)

// 监听账单删除
watch(
  () => editBillState.delete,
  (del) => {
    if (!del) return
    const date = dayjs(del.date).format('YYYY-MM-DD')
    const indexOf = reports.value.findIndex((r) => r.date === date)

    if (indexOf > -1) {
      const bill = reports.value[indexOf]
      bill.expend -= isExpendType(del.type) ? del.amount : 0
      bill.income -= isIncomeType(del.type) ? del.amount : 0
      bill.expendCount -= isExpendType(del.type) ? 1 : 0
      bill.incomeCount -= isIncomeType(del.type) ? 1 : 0

      // 如果汇总项为0，就删除该项
      if (bill.expend === 0 && bill.income === 0) {
        reports.value.splice(indexOf, 1)
      }
    }
  },
)

// 监听账单更新
watch(
  () => editBillState.update,
  (update) => {
    if (!update) return
    const oldBill = update.old
    const newBill = update.new
    // console.log('repost watch bill update', update, update.old.date, update.new.date)
    let amount = 0

    if (oldBill.date === newBill.date) {
      // 原账单在当前查询的日期范围内
      if (oldBill.date >= beginDate && oldBill.date <= endDate) {
        amount = newBill.amount - oldBill.amount
      }

      const date = dayjs(newBill.date).format('YYYY-MM-DD')
      const indexOf = reports.value.findIndex((r) => r.date === date)
      const bill = reports.value[indexOf]
      bill.expend += isExpendType(newBill.type) ? amount : 0
      bill.income += isIncomeType(newBill.type) ? amount : 0
    } else {
      // 处理旧数据对应日期的汇总项
      const indexOfOld = reports.value.findIndex(
        (r) => r.date === dayjs(oldBill.date).format('YYYY-MM-DD'),
      )
      if (indexOfOld > -1) {
        // 存在旧汇总项
        amount = oldBill.amount
        const bill = reports.value[indexOfOld]
        bill.expend -= isExpendType(oldBill.type) ? amount : 0
        bill.income -= isIncomeType(oldBill.type) ? amount : 0
        bill.expendCount -= isExpendType(oldBill.type) ? 1 : 0
        bill.incomeCount -= isIncomeType(oldBill.type) ? 1 : 0

        // 如果汇总项为0，就删除该项
        if (bill.expend === 0 && bill.income === 0) {
          reports.value.splice(indexOfOld, 1)
        }
      }

      // 处理新数据对应日期的汇总项
      const date = dayjs(newBill.date).format('YYYY-MM-DD')
      const indexOfNew = reports.value.findIndex((r) => r.date === date)
      if (newBill.date >= beginDate && newBill.date <= endDate) {
        if (indexOfNew > -1) {
          // 存在旧汇总项
          amount = newBill.amount
          const bill = reports.value[indexOfNew]
          bill.expend += isExpendType(newBill.type) ? amount : 0
          bill.income += isIncomeType(newBill.type) ? amount : 0
          bill.expendCount += isExpendType(newBill.type) ? 1 : 0
          bill.incomeCount += isIncomeType(newBill.type) ? 1 : 0
        } else {
          // 不存在旧汇总项
          reports.value.push({
            date,
            expend: isExpendType(newBill.type) ? newBill.amount : 0,
            income: isIncomeType(newBill.type) ? newBill.amount : 0,
            expendCount: isExpendType(newBill.type) ? 1 : 0,
            incomeCount: isIncomeType(newBill.type) ? 1 : 0,
          })
          // 排序
          reports.value.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
        }
      }
    }
  },
)

onLoad(() => {
  getBillReports()
})

const getBillReports = () => {
  getHomeBillReport(beginDate, endDate)
    .then((res) => {
      reports.value = res
    })
    .catch((err) => {
      console.log(err)
    })
}

const handleClickItem = (report: HomeBillReport) => {
  // console.log('summary', summary)
  emits('click', report.date)
}
</script>
