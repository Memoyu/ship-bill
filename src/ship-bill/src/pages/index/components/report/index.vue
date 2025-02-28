<template>
  <view class="container h-3/6 py-2 rounded-lg bg-indigo-400 mb-4">
    <view v-for="(summary, index) in data" :key="index" class="p-2 m-2 bg-white rounded-md">
      <view class="grid grid-cols-9 gap-3 items-center">
        <view class="col-span-3 flex flex-col">
          <view>{{ dayjs(summary.date).year() }}</view>
          <wd-text color="#000" :text="dayjs(summary.date).format('MM-DD')" bold />
        </view>
        <view class="col-span-3">收: {{ summary.income }}</view>
        <view class="col-span-3">支: {{ summary.expend }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'

const data = [
  {
    date: '2016-05-02',
    expend: 1000,
    income: 20,
  },
  {
    date: '2016-05-03',
    expend: 119900,
    income: 21,
  },
  {
    date: '2016-05-04',
    expend: 120000,
    income: 22,
  },
  {
    date: '2016-05-05',
    expend: 137700,
    income: 23,
  },
  {
    date: '2016-05-06',
    expend: 148800,
    income: 24,
  },
  {
    date: '2016-05-07',
    expend: 148800,
    income: 24,
  },
  {
    date: '2016-05-08',
    expend: 148800,
    income: 24,
  },
  {
    date: '2016-05-09',
    expend: 148800,
    income: 24,
  },
  {
    date: '2016-05-10',
    expend: 148800,
    income: 24,
  },
  {
    date: '2016-05-11',
    expend: 148800,
    income: 24,
  },
]
</script>
