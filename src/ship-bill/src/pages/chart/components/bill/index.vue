<template>
  <view class="p-2 my-2 bg-slate-100 rounded-md">
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
</template>

<script lang="ts" setup>
defineProps<{ bill?: any }>()
</script>
