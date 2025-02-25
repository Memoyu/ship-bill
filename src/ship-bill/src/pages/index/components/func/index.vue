<template>
  <view class="grid grid-cols-3 gap-2">
    <view class="func-col-1">账单汇总</view>
    <view class="func-col-1">数据报表</view>
    <view class="func-col-1">03</view>
    <view class="func-col-2 col-span-2 bg-indigo-500">分类管理</view>
    <view class="func-col-2 bg-indigo-300">05</view>
    <view class="func-col-3 bg-indigo-500">设置</view>
    <view class="func-col-3 col-span-2 bg-indigo-300">关于我</view>
  </view>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.func-col-1 {
  @apply bg-indigo-300 h-15 rounded-lg flex justify-center items-center;
}

.func-col-2 {
  @apply h-20 rounded-lg rounded-lg flex justify-center items-center;
}

.func-col-3 {
  @apply h-10 rounded-lg rounded-lg flex justify-center items-center;
}
</style>
