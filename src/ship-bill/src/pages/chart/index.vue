<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '图表',
  },
}
</route>
<template>
  <view class="bg-white overflow-hidden pt-2 px-4">
    <wd-navbar
      fixed
      safeAreaInsetTop
      placeholder
      title="图表"
      left-text="返回"
      left-arrow
      @click-left="handleClickLeft"
      :bordered="false"
    />

    <view
      class="overflow-y-auto"
      :style="{ height: `calc(100vh - ${safeAreaInsets?.top}px - 60px)` }"
    >
      <view class="z-50 sticky top-0 bg-white py-2">
        <view class="flex justify-between items-center">
          <view>账期</view>
          <view>
            <wd-datetime-picker
              type="date"
              size="large"
              v-model="dates"
              @confirm="handleConfirmDatePicker"
            />
          </view>
        </view>

        <view class="my-2">
          <wd-segmented
            :options="types"
            v-model:value="type"
            size="middle"
            @change="handleChangeType"
          />
        </view>

        <view :class="['flex', 'px-3', type == types[0] ? 'justify-between' : 'justify-center']">
          <view v-if="type == types[0] || type == types[1]">
            <wd-text bold text="支: " />
            <wd-text :color="expendColor" bold mode="price" :text="expend" />
          </view>
          <view v-if="type == types[0] || type == types[2]">
            <wd-text :color="incomeColor" bold text="收: " />
            <wd-text :color="incomeColor" bold mode="price" :text="income" />
          </view>
        </view>
      </view>

      <view v-if="bills.length > 0">
        <view v-for="bill in bills" :key="bill._id" class="my-3 p-2 bg-slate-100 rounded-md">
          <BillItem :bill="bill" />
        </view>
      </view>
      <view v-else class="flex items-center">
        <wd-status-tip image="content" tip="暂无账单" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import BillItem from '@/components/bill-item/index.vue'
import { Bill, getBills } from '@/service'
import { getBillType } from '@/utils/bill'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

defineOptions({
  name: 'Chart',
})

const expendColor = getCurrentInstance().appContext.config.globalProperties.expendColor
const incomeColor = getCurrentInstance().appContext.config.globalProperties.incomeColor
const types = ref(['全部', '支出', '收入'])
const type = ref('全部')
const dates = ref<any[]>([dayjs().subtract(1, 'month').toDate().valueOf(), Date.now().valueOf()])

const sourceBills = ref<Bill[]>([])
const bills = ref<Bill[]>([])
const expend = ref<number>(0)
const income = ref<number>(0)

onLoad(() => {
  getBillList()
})

const handleClickLeft = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/index/index' })
    },
  })
}

const handleConfirmDatePicker = ({ value }) => {
  console.log(new Date(value))
}

const handleChangeType = () => {
  console.log(type.value)
}

const getBillList = () => {
  const t = type.value === '全部' ? 0 : getBillType(type.value)

  getBills({
    type: t,
    begin: dates.value[0],
    end: dates.value[1],
  }).then((res) => {
    sourceBills.value = res.items
    bills.value = res.items
    expend.value = res.expend
    income.value = res.income
  })
}
</script>

<style></style>
