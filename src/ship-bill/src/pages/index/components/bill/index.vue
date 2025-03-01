<template>
  <wd-floating-panel
    v-model:height="panelHeight"
    :anchors="anchors"
    @height-change="handleHeightChangePanel"
  >
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
    </view>
    <wd-cell-group border>
      <view class="container">
        <view v-for="bill in data" :key="bill._id" class="p-2 m-2 bg-slate-100 rounded-md">
          <view class="flex flex-row items-center">
            <view class="flex-1 flex flex-row items-center" style="flex-grow: 1">
              <wd-img
                round
                :width="35"
                :height="35"
                src="https://q1.qlogo.cn/g?b=qq&nk=754433528&s=100"
              />
              <view class="flex-1 col-span-3 flex flex-col ml-2 text-base">
                <view>{{ 'ddddd' }}</view>
                <wd-text :lines="1" :text="bill.remark" />
              </view>
            </view>
            <wd-text class="float-right" mode="price" :text="bill.amount" bold />
          </view>
        </view>
      </view>
    </wd-cell-group>
  </wd-floating-panel>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'

const data = [
  {
    _id: '11111',
    type: 0,
    amount: 100,
    remark: '测试备注',
  },
  {
    _id: '2222',
    type: 0,
    amount: 100,
    remark: '测试备注测试备注测试备注测试备注3333测试备注测试备注',
  },
  {
    _id: '3333',
    type: 0,
    amount: 100,
    remark: '测试备注2',
  },
  {
    _id: '444444',
    type: 0,
    amount: 100,
    remark: '测试备注3',
  },
  {
    _id: '4434444',
    type: 0,
    amount: 100,
    remark: '测试备注3',
  },
  {
    _id: '4445444',
    type: 0,
    amount: 100,
    remark: '测试备注3',
  },
  {
    _id: '4446444',
    type: 0,
    amount: 100,
    remark: '测试备注3',
  },
  {
    _id: '4444744',
    type: 0,
    amount: 100,
    remark: '测试备注3',
  },
]
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

watch(
  () => props.date,
  (nweDate) => {
    currentDate.value = nweDate
  },
)

watch(
  () => props.show,
  (nweShow) => {
    nweShow && (panelHeight.value = maxHeight.value)
  },
)

onLoad(() => {
  maxHeight.value = Math.round(0.6 * windowHeight)
  anchors.value = [80, maxHeight.value]
})

const handleChangeType = () => {
  console.log(type.value)
}

const handleHeightChangePanel = ({ height }) => {
  height === minHeight && emits('update:show', false)
}
</script>
