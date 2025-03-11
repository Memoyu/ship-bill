<template>
  <view>
    <view v-if="showDate" class="ml-2">
      <wd-text color="#000" :text="dayjs(bill.date).format('YYYY-MM-DD')" />
    </view>
    <view class="flex items-center" @click="handleClickBillItem" :style="{ height: '150rpx' }">
      <view class="rounded-full bg-white h-[80rpx] w-[80rpx] flex justify-center items-center">
        <wd-text
          :color="getBillColor()"
          :text="isExpendType(bill.type) ? '支' : '收'"
          bold
          size="19px"
        />
      </view>

      <view class="flex-1 col-span-3 flex flex-col ml-2 text-base">
        <view class="flex flex-row justify-between">
          <wd-text :color="getBillColor()" mode="price" :text="bill.amount" bold size="17px" />
          <wd-text color="#000" :lines="1" :text="getBillFeeText()" />
        </view>

        <wd-text color="#000" :lines="1" :text="getBillCategoryText()" />
        <wd-text :lines="1" :text="bill.remark" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Bill } from '@/service'
import { isExpendType } from '@/utils/bill'
import dayjs from 'dayjs'

const expendColor = getCurrentInstance().appContext.config.globalProperties.expendColor
const incomeColor = getCurrentInstance().appContext.config.globalProperties.incomeColor
const props = defineProps<{ bill: Bill; showDate?: boolean }>()

const handleClickBillItem = () => {
  uni.navigateTo({
    url: '/pages/bill/edit/index?id=' + props.bill._id,
  })
}

const getBillColor = () => {
  return isExpendType(props.bill.type) ? expendColor : incomeColor
}

const getBillCategoryText = () => {
  const categories = props.bill.categories.map((item) => {
    return item.name
  })
  return categories.join(', ')
}

const getBillFeeText = () => {
  const bill = props.bill
  if (bill.total <= 0) return ''
  if (isExpendType(bill.type)) {
    return `加油: ${bill.total}升 / ${bill.rates}元/升`
  } else {
    return `产值: ${bill.total}元 / ${bill.rates}%`
  }
}
</script>
