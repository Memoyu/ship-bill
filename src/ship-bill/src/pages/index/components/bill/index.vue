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
            <wd-text size="15px" type="error" bold mode="price" :text="expend" />
          </view>
          <view v-if="type == types[0] || type == types[2]">
            <wd-text size="15px" bold text="收: " />
            <wd-text size="15px" type="primary" bold mode="price" :text="income" />
          </view>
        </view>
      </view>
      <wd-cell-group border>
        <view
          v-for="bill in bills"
          :key="bill._id"
          class="m-2 p-2 bg-slate-100 rounded-md bill-card"
          @click="() => handleClickBillItem(bill)"
        >
          <view class="flex flex-row items-center">
            <view class="flex-1 flex flex-row items-center" style="flex-grow: 1">
              <view
                class="rounded-full bg-white h-[80rpx] w-[80rpx] flex justify-center items-center"
              >
                <wd-text
                  :color="isExpendType(bill.type) ? '#80CBC4' : '#B82132'"
                  :text="isExpendType(bill.type) ? '支' : '收'"
                  bold
                />
              </view>

              <view class="flex-1 col-span-3 flex flex-col ml-2 text-base">
                <wd-text color="#000" :lines="1" :text="getBillCategoryText(bill)" size="13px" />
                <wd-text color="#000" :lines="1" :text="getBillFeeText(bill)" size="13px" />
                <wd-text :lines="1" :text="bill.remark" size="13px" />
              </view>
            </view>
            <wd-text class="float-right" mode="price" :text="bill.amount" bold />
          </view>
        </view>
      </wd-cell-group>
    </view>
  </wd-floating-panel>
</template>

<script lang="ts" setup>
import { Bill, getBills } from '@/service'
import { getBillType, isExpendType } from '@/utils/bill'
import dayjs from 'dayjs'

const props = defineProps<{ show: boolean; date: string }>()
const emits = defineEmits<{
  (e: 'update:show', value: boolean): void
}>()
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

const handleClickBillItem = (bill: any) => {
  uni.navigateTo({
    url: '/pages/bill/edit/index?id=' + bill._id,
  })
}

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

  getBills({
    type: t,
    begin: new Date(currentDate.value).valueOf(),
    end: new Date(currentDate.value + ' 23:59:59').valueOf(),
  }).then((res) => {
    sourceBills.value = res.items
    bills.value = res.items
    expend.value = res.expend
    income.value = res.income
  })
}

const getBillCategoryText = (bill: Bill) => {
  const categorys = bill.categorys.map((item) => {
    return item.name
  })
  return categorys.join(', ')
}

const getBillFeeText = (bill: Bill) => {
  if (bill.fee === 0) return ''
  if (isExpendType(bill.type)) {
    return `加油: ${bill.fee}升 / ${bill.rates}元/升`
  } else {
    return `产值: ${bill.fee}元 / ${bill.rates}%`
  }
}
</script>

<style lang="scss"></style>
