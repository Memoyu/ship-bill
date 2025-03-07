<template>
  <view class="flex items-center" @click="handleClickBillItem" :style="{ height: '150rpx' }">
    <view class="rounded-full bg-white h-[80rpx] w-[80rpx] flex justify-center items-center">
      <wd-text :color="getBillColor()" :text="isExpendType(bill.type) ? '支' : '收'" bold />
    </view>

    <view class="flex-1 col-span-3 flex flex-col ml-2 text-base">
      <view class="flex flex-row justify-between">
        <wd-text :color="getBillColor()" mode="price" :text="bill.amount" bold size="16px" />
        <wd-text color="#000" :lines="1" :text="getBillFeeText()" size="13px" />
      </view>

      <wd-text color="#000" :lines="1" :text="getBillCategoryText()" size="13px" />
      <wd-text :lines="1" :text="bill.remark" size="13px" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Bill } from '@/service'
import { isExpendType } from '@/utils/bill'

const expendColor = getCurrentInstance().appContext.config.globalProperties.expendColor
const incomeColor = getCurrentInstance().appContext.config.globalProperties.incomeColor
const props = defineProps<{ bill: Bill }>()

const handleClickBillItem = () => {
  uni.navigateTo({
    url: '/pages/bill/edit/index?id=' + props.bill._id,
  })
}

const getBillColor = () => {
  return isExpendType(props.bill.type) ? expendColor : incomeColor
}

const getBillCategoryText = () => {
  const categorys = props.bill.categorys.map((item) => {
    return item.name
  })
  return categorys.join(', ')
}

const getBillFeeText = () => {
  const bill = props.bill
  if (bill.fee <= 0) return ''
  if (isExpendType(bill.type)) {
    return `加油: ${bill.fee}升 / ${bill.rates}元/升`
  } else {
    return `产值: ${bill.fee}元 / ${bill.rates}%`
  }
}
</script>
