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
      :style="{ height: `calc(100vh - ${safeAreaInsets?.top}px - 64px)` }"
    >
      <view class="z-50 sticky top-0 bg-white py-2">
        <view class="flex justify-between items-center">
          <view>账期</view>
          <view>
            <wd-datetime-picker type="date" size="large" v-model="value" @confirm="handleConfirm" />
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
            <wd-text size="15px" bold text="支: " />
            <wd-text size="15px" type="error" bold mode="price" text="900000" />
          </view>
          <view v-if="type == types[0] || type == types[2]">
            <wd-text size="15px" bold text="收: " />
            <wd-text size="15px" type="primary" bold mode="price" text="900000" />
          </view>
        </view>
      </view>

      <view v-for="bill in data" :key="bill._id">
        <BillItem :bill="bill" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import BillItem from './components/bill/index.vue'

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

defineOptions({
  name: 'Chart',
})

const data = [
  {
    _id: '11111',
    type: 0,
    amount: 100,
    remark: '测试备注111',
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
  {
    _id: '44447424',
    type: 0,
    amount: 100,
    remark: '测试备注3',
  },
  {
    _id: '44447344',
    type: 0,
    amount: 100,
    remark: '测试备注3',
  },
  {
    _id: '44447444',
    type: 0,
    amount: 100,
    remark: '测试备注3',
  },
  {
    _id: '44447454',
    type: 0,
    amount: 100,
    remark: '测试备注3',
  },
]
const types = ref(['全部', '支出', '收入'])
const type = ref('全部')
const value = ref<any[]>([dayjs().subtract(1, 'day').toDate(), Date.now()])

onLoad(() => {})

const handleClickLeft = () => {
  uni.navigateBack()
}

const handleConfirm = ({ value }) => {
  console.log(new Date(value))
}

const handleChangeType = () => {
  console.log(type.value)
}
</script>

<style></style>
