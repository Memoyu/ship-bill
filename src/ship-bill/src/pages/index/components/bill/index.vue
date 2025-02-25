<template>
  <wd-floating-panel :anchors="anchors">
    <view class="flex justify-between content-center mx-5 my-2">
      <view class="font-bold">2016-05-03</view>
      <view class="flex content-center">
        <wd-radio-group v-model="type" shape="dot" size="large" inline>
          <wd-radio value="0">全部</wd-radio>
          <wd-radio value="1">收入</wd-radio>
          <wd-radio value="2">支出</wd-radio>
        </wd-radio-group>
      </view>
    </view>
    <wd-cell-group border>
      <view class="container">
        <view v-for="d in data" :key="d._id" class="p-2 m-2 bg-white rounded-md">
          <image
            src="https://img10.360buyimg.com/jmadvertisement/jfs/t1/70325/36/14954/36690/5dcd3e3bEee5006e0/aed1ccf6d5ffc764.png"
          />
          <view class="right">这是一条测试{{ d._id + 1 }}</view>
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
  },
  {
    _id: '2222',
    type: 0,
    amount: 100,
  },
  {
    _id: '3333',
    type: 0,
    amount: 100,
  },
  {
    _id: '444444',
    type: 0,
    amount: 100,
  },
]
const windowHeight = ref<number>(0)
const anchors = ref<number[]>([])
const type = ref<number>(2)

onLoad(() => {
  windowHeight.value = uni.getSystemInfoSync().windowHeight
  anchors.value = [80, Math.round(0.6 * windowHeight.value)]
})
</script>
