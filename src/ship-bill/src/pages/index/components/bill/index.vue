<template>
  <wd-floating-panel
    v-model:height="panelHeight"
    :anchors="anchors"
    @height-change="handleHeightChangePanel"
  >
    <view class="bill-panel">
      <view class="z-50 sticky top-0 bg-white px-5 py-4">
        <view class="flex justify-between items-center">
          <view class="font-bold">当前账单</view>
          <view class="font-bold">{{ currentDate }}</view>
        </view>
        <view class="mt-4">
          <wd-segmented
            :options="types"
            v-model:value="type"
            size="middle"
            @change="handleChangeType"
          />
        </view>

        <view
          :class="['flex', 'mt-2', 'px-3', type == types[0] ? 'justify-between' : 'justify-center']"
        >
          <view v-if="type == types[0] || type == types[1]">
            <wd-text size="15px" bold text="支: " />
            <wd-text size="15px" :color="expendColor" bold mode="price" :text="expend" />
          </view>
          <view v-if="type == types[0] || type == types[2]">
            <wd-text size="15px" bold text="收: " />
            <wd-text size="15px" :color="incomeColor" bold mode="price" :text="income" />
          </view>
        </view>
      </view>

      <view v-if="listBills.length > 0" class="pb-1">
        <wd-cell-group border>
          <view
            v-for="bill in listBills"
            :key="bill._id"
            class="my-3 mx-2 p-2 bg-slate-100 rounded-md"
          >
            <BillItem :bill="bill" />
          </view>
          <!-- <view class="h-1" /> -->
        </wd-cell-group>
      </view>
      <view v-else class="h-full flex items-center">
        <wd-status-tip image="content" tip="暂无账单" />
      </view>
    </view>
  </wd-floating-panel>
</template>

<script lang="ts" setup>
import { Bill, getBills } from '@/service'
import { getBillType, isExpendType, isIncomeType } from '@/utils/bill'
import dayjs from 'dayjs'
import BillItem from '@/components/bill-item/index.vue'
import { useEditBillStore } from '@/store'

const props = defineProps<{ show: boolean; date: string }>()
const emits = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const { editBillState } = useEditBillStore()

const expendColor = getCurrentInstance().appContext.config.globalProperties.expendColor
const incomeColor = getCurrentInstance().appContext.config.globalProperties.incomeColor
const types = ref(['全部', '支出', '收入'])
const type = ref('全部')
const minHeight = 80
const panelHeight = ref<number>(minHeight)
const { windowHeight } = uni.getWindowInfo()

const maxHeight = ref<number>(0)
const anchors = ref<number[]>([])
const currentDate = ref(dayjs().format('YYYY-MM-DD'))
const sourceBills = ref<Bill[]>([])
const listBills = ref<Bill[]>([])
const expend = ref<number>(0)
const income = ref<number>(0)

watch(
  () => props.show,
  (nweShow) => {
    if (nweShow) {
      panelHeight.value = maxHeight.value
      if (currentDate.value !== props.date) {
        currentDate.value = props.date
        getBillList()
      }
    }
  },
)

// 监听账单新增
watch(
  () => editBillState.add,
  (add) => {
    const date = dayjs(add.date).format('YYYY-MM-DD')
    // console.log('add date', date)
    if (date === currentDate.value) {
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
    if (date === currentDate.value) {
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

    const oldBill = update.old
    const newBill = update.new
    const id = newBill._id

    const indexOfSource = source.findIndex((b) => b._id === id)
    const date = dayjs(newBill.date).format('YYYY-MM-DD')
    if (indexOfSource > -1) {
      if (date === currentDate.value) {
        const amount = newBill.amount - oldBill.amount
        expend.value += isExpendType(newBill.type) ? amount : 0
        income.value += isIncomeType(newBill.type) ? amount : 0

        // 替换源账单数据
        source[indexOfSource] = newBill
        sourceBills.value = source
      } else {
        expend.value -= isExpendType(newBill.type) ? oldBill.amount : 0
        income.value -= isIncomeType(newBill.type) ? oldBill.amount : 0

        // 移除源账单数据
        sourceBills.value.splice(indexOfSource, 1)
      }

      // 更细当前列表
      handleChangeType()
    } else {
      if (date === currentDate.value) {
        expend.value += isExpendType(newBill.type) ? newBill.amount : 0
        income.value += isIncomeType(newBill.type) ? newBill.amount : 0
        // 新增源账单数据
        sourceBills.value.push(newBill)
        sourceBills.value.sort((a, b) => a.date - b.date)

        handleChangeType()
      }
    }
  },
)

onLoad(() => {
  maxHeight.value = Math.round(0.7 * windowHeight)
  anchors.value = [80, maxHeight.value]
  getBillList()
})

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

const handleHeightChangePanel = ({ height }) => {
  height === minHeight && emits('update:show', false)
}

const getBillList = () => {
  listBills.value = []
  expend.value = 0
  income.value = 0

  const t = type.value === '全部' ? 0 : getBillType(type.value)

  const begin = dayjs(currentDate.value)
  const end = begin.add(1, 'day').add(-1, 'second')
  getBills({
    type: t,
    begin: begin.valueOf(),
    end: end.valueOf(),
  }).then((res) => {
    sourceBills.value = res.items
    listBills.value = [...res.items]
    expend.value = res.expend
    income.value = res.income
  })
}
</script>

<style lang="scss"></style>
