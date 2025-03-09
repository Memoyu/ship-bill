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

      <view v-if="listBills.length > 0">
        <view v-for="bill in listBills" :key="bill._id" class="my-3 p-2 bg-slate-100 rounded-md">
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
import { getBillType, isExpendType, isIncomeType } from '@/utils/bill'
import { useEditBillStore } from '@/store'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getWindowInfo()

defineOptions({
  name: 'Chart',
})

const { editBillState } = useEditBillStore()

const expendColor = getCurrentInstance().appContext.config.globalProperties.expendColor
const incomeColor = getCurrentInstance().appContext.config.globalProperties.incomeColor
const types = ref(['全部', '支出', '收入'])
const type = ref('全部')
const dates = ref<number[]>([dayjs().subtract(1, 'month').toDate().valueOf(), Date.now().valueOf()])

const sourceBills = ref<Bill[]>([])
const listBills = ref<Bill[]>([])
const expend = ref<number>(0)
const income = ref<number>(0)

// 监听账单新增
watch(
  () => editBillState.add,
  (add) => {
    const date = dayjs(add.date).format('YYYY-MM-DD')
    // console.log('add date', date)
    if (add.date >= dates.value[0] && add.date <= dates.value[1]) {
      listBills.value.unshift(add)
      sourceBills.value.unshift(add)
      expend.value += isExpendType(add.type) ? add.amount : 0
      income.value += isIncomeType(add.type) ? add.amount : 0
    }
  },
)

// 监听账单删除
watch(
  () => editBillState.delete,
  (del) => {
    const date = dayjs(del.date).format('YYYY-MM-DD')
    // console.log('del date', date)
    if (del.date >= dates.value[0] && del.date <= dates.value[1]) {
      listBills.value = listBills.value.filter((b) => b._id !== del._id)
      sourceBills.value = sourceBills.value.filter((b) => b._id !== del._id)
      expend.value -= isExpendType(del.type) ? del.amount : 0
      income.value -= isIncomeType(del.type) ? del.amount : 0
    }
  },
)

// 监听账单更新
watch(
  () => editBillState.update,
  (update) => {
    const source = [...sourceBills.value]
    const list = [...listBills.value]

    const indexOfSource = source.findIndex((b) => b._id === update.new._id)
    if (indexOfSource < -1) return
    // console.log('bill update', indexOfSource, source)
    const amount = update.new.amount - update.old.amount
    expend.value += isExpendType(update.new.type) ? amount : 0
    income.value += isIncomeType(update.new.type) ? amount : 0
    // 替换全部账单数据
    source[indexOfSource] = update.new
    sourceBills.value = source

    // 替换当前展示数据
    const indexOf = list.findIndex((b) => b._id === update.new._id)
    if (indexOf < -1) return
    list[indexOf] = update.new
    listBills.value = list
  },
)

onLoad(() => {
  getBillList(dates.value)
})

const handleClickLeft = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/index/index' })
    },
  })
}

const handleConfirmDatePicker = ({ value }) => {
  // console.log(value)
  getBillList(value)
}

const handleChangeType = () => {
  // console.log(type.value)
  if (type.value === '全部') {
    listBills.value = [...sourceBills.value]
  } else {
    listBills.value = sourceBills.value.filter((item) => {
      return item.type === getBillType(type.value)
    })
  }
}

const getBillList = (date: number[]) => {
  const t = type.value === '全部' ? 0 : getBillType(type.value)

  getBills({
    type: t,
    begin: date[0],
    end: date[1],
  }).then((res) => {
    sourceBills.value = res.items
    listBills.value = [...res.items]
    expend.value = res.expend
    income.value = res.income
  })
}
</script>

<style></style>
