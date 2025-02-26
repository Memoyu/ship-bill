<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
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

        <wd-tabs v-model="type">
          <wd-tab title="全部" />
          <wd-tab title="收入" />
          <wd-tab title="支出" />
        </wd-tabs>

        <view class="flex justify-between px-3">
          <view v-if="type == '0' || type == '1'">
            <wd-text size="15px" bold text="收: " />
            <wd-text size="15px" type="primary" bold mode="price" text="900000" />
          </view>
          <view v-if="type == '0' || type == '2'">
            <wd-text size="15px" bold text="支: " />
            <wd-text size="15px" type="error" bold mode="price" text="900000" />
          </view>
        </view>
      </view>

      <view v-for="d in data" :key="d._id">
        <BillItem :bill="d" />
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

const type = ref<string>('0')
const value = ref<any[]>([dayjs().subtract(1, 'day').toDate(), Date.now()])

onLoad(() => {})

function handleClickLeft() {
  uni.navigateBack()
}

function handleConfirm({ value }) {
  console.log(new Date(value))
}
</script>

<style>
.main-title-color {
  color: #d14328;
}
</style>
