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

      <view v-if="bills.length > 0" class="pb-1">
        <wd-cell-group border>
          <view v-for="bill in bills" :key="bill._id" class="my-3 mx-2 p-2 bg-slate-100 rounded-md">
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
import { getBillType } from '@/utils/bill'
import dayjs from 'dayjs'
import BillItem from '@/components/bill-item/index.vue'

const props = defineProps<{ show: boolean; date: string }>()
const emits = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()

const expendColor = getCurrentInstance().appContext.config.globalProperties.expendColor
const incomeColor = getCurrentInstance().appContext.config.globalProperties.incomeColor
const types = ref(['全部', '支出', '收入'])
const type = ref('全部')
const minHeight = 80
const panelHeight = ref<number>(minHeight)
const { windowHeight } = uni.getSystemInfoSync()
const maxHeight = ref<number>(0)
const anchors = ref<number[]>([])
const currentDate = ref(dayjs().format('YYYY-MM-DD'))
const sourceBills = ref<Bill[]>([])
const bills = ref<Bill[]>([])
const expend = ref<number>(0)
const income = ref<number>(0)

watch(
  () => props.date,
  (nweDate) => {
    currentDate.value = nweDate
    bills.value = []
    getBillList()
  },
)

watch(
  () => props.show,
  (nweShow) => {
    if (nweShow) {
      panelHeight.value = maxHeight.value
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
    bills.value = sourceBills.value
  } else {
    bills.value = sourceBills.value.filter((item) => {
      return item.type === getBillType(type.value)
    })
  }
}

const handleHeightChangePanel = ({ height }) => {
  height === minHeight && emits('update:show', false)
}

const getBillList = () => {
  const t = type.value === '全部' ? 0 : getBillType(type.value)

  const begin = dayjs(currentDate.value)
  const end = begin.add(1, 'day').add(-1, 'second')
  // console.log('获取账单列表', begin, end)

  getBills({
    type: t,
    begin: begin.valueOf(),
    end: end.valueOf(),
  }).then((res) => {
    sourceBills.value = res.items
    bills.value = res.items
    expend.value = res.expend
    income.value = res.income
  })
}
</script>

<style lang="scss"></style>
