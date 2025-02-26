<template>
  <wd-floating-panel :anchors="anchors">
    <view class="z-50 sticky top-0 bg-white px-5 py-4">
      <view class="flex justify-between items-center">
        <view class="font-bold">当前账单</view>
        <view class="font-bold">2016-05-03</view>
      </view>
      <wd-tabs v-model="type">
        <wd-tab title="全部" />
        <wd-tab title="收入" />
        <wd-tab title="支出" />
      </wd-tabs>
    </view>
    <wd-cell-group border>
      <view class="container">
        <view v-for="d in data" :key="d._id" class="p-2 m-2 bg-slate-100 rounded-md">
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
                <wd-text :lines="1" :text="d.remark" />
              </view>
            </view>
            <wd-text class="float-right" mode="price" :text="d.amount" bold />
          </view>
        </view>
      </view>
    </wd-cell-group>
  </wd-floating-panel>
</template>

<script lang="ts" setup>
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
const windowHeight = ref<number>(0)
const anchors = ref<number[]>([])
const type = ref<string>('0')

onLoad(() => {
  windowHeight.value = uni.getSystemInfoSync().windowHeight
  anchors.value = [80, Math.round(0.6 * windowHeight.value)]
})
</script>
