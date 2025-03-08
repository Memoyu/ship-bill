<template>
  <view class="grid grid-cols-2 gap-2 mb-4">
    <view class="summary-block bg-indigo-400">
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="支出" bold />
        <wd-text color="#FFF" size="15px" mode="price" :text="summary.expend" bold />
      </view>
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="加油" bold />
        <view class="flex flex-col text-end">
          <wd-text color="#FFF" size="15px" mode="price" suffix="L" :text="summary.oilTotal" bold />
          <wd-text color="#FFF" size="15px" mode="price" :text="summary.oilCost" bold />
        </view>
      </view>
    </view>
    <view class="summary-block bg-purple-400">
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="收入" bold />
        <wd-text color="#FFF" size="15px" mode="price" :text="summary.income" bold />
      </view>
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="产值" bold />
        <wd-text color="#FFF" size="15px" mode="price" :text="summary.outputValue" bold />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getHomeBillSummary, HomeBillSummary } from '@/service'
import dayjs from 'dayjs'
import { useEditBillStore } from '@/store'
import { isExpendType, isIncomeType } from '@/utils/bill'

const { editBillState } = useEditBillStore()
const beginDate = dayjs().startOf('month').valueOf()
const endDate = dayjs().endOf('month').valueOf()
const summary = ref<HomeBillSummary>({
  expend: 0,
  income: 0,
  oilTotal: 0,
  oilCost: 0,
  outputValue: 0,
})

// 监听账单新增
watch(
  () => editBillState.add,
  (add) => {
    if (!add) return
    if (add.date >= beginDate && add.date <= endDate) {
      const totalRates = -(add.total * add.rates)
      summary.value.expend += isExpendType(add.type) ? add.amount : 0
      summary.value.income += isExpendType(add.type) ? add.amount : 0
      summary.value.oilTotal += isIncomeType(add.type) ? add.total : 0
      summary.value.oilCost += isIncomeType(add.type) ? totalRates : 0
      summary.value.outputValue += isExpendType(add.type) ? totalRates : 0
    }
  },
  { immediate: true, deep: true },
)

// 监听账单删除
watch(
  () => editBillState.delete,
  (del) => {
    if (!del) return
    if (del.date >= beginDate && del.date <= endDate) {
      const totalRates = -(del.total * del.rates)
      summary.value.expend -= isIncomeType(del.type) ? del.amount : 0
      summary.value.income -= isExpendType(del.type) ? del.amount : 0
      summary.value.oilTotal -= isIncomeType(del.type) ? del.total : 0
      summary.value.oilCost -= isIncomeType(del.type) ? totalRates : 0
      summary.value.outputValue -= isExpendType(del.type) ? totalRates : 0
    }
  },
  { immediate: true, deep: true },
)

// 监听账单更新
watch(
  () => editBillState.update,
  (update) => {
    // console.log('summary watch bill update', update)
    if (!update) return
    const oldBill = update.old
    const newBill = update.new

    let amount = 0
    let total = 0
    let totalRates = 0
    // 如果，原本这条账单是在当前查询的日期范围内
    if (oldBill.date >= beginDate && oldBill.date <= endDate) {
      // 如果日期在汇总时间范围内，则取差值
      if (newBill.date >= beginDate && newBill.date <= endDate) {
        amount = newBill.amount - oldBill.amount
        total = newBill.total - oldBill.total
        totalRates = newBill.total * newBill.rates - oldBill.total * oldBill.rates
      } else {
        // 否则，减去账单总值
        amount = -oldBill.amount
        total = -oldBill.total
        totalRates = -(oldBill.total * oldBill.rates)
      }
    } else {
      // 否则，不在范围内
      // 并且，变更后的账单日期在当前查询的日期范围内
      if (newBill.date >= beginDate && newBill.date <= endDate) {
        amount = newBill.amount
        total = newBill.total
        totalRates = newBill.total * newBill.rates
      }
    }

    // console.log('summary watch edit bill', amount, total, totalRates)

    summary.value.expend += isExpendType(newBill.type) ? amount : 0
    summary.value.income += isIncomeType(newBill.type) ? amount : 0
    summary.value.oilTotal += isExpendType(newBill.type) ? total : 0
    summary.value.oilCost += isExpendType(newBill.type) ? totalRates : 0
    summary.value.outputValue += isIncomeType(newBill.type) ? totalRates : 0
  },
  { immediate: true, deep: true },
)

onLoad(() => {
  getBillSummary()
})

const getBillSummary = () => {
  getHomeBillSummary(beginDate, endDate)
    .then((res) => {
      summary.value = res
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>

<style lang="scss">
.summary-block {
  @apply p-1 rounded-lg flex flex-col justify-center;
}
.summary-block-item {
  @apply flex justify-between m-1;

  &-title {
    color: white;
  }
}
</style>
