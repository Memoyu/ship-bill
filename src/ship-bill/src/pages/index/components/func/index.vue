<template>
  <view class="grid grid-cols-3 gap-2">
    <view class="func-col-1 func-text">账单汇总</view>
    <view class="func-col-1 func-text">数据报表</view>
    <view class="func-col-1 func-text">分类管理</view>
    <view class="func-col-2 col-span-2 bg-indigo-500 relative">
      <view class="func-text">设置</view>
      <view class="absolute bottom-1 flex">
        <view>产值: 90</view>
        <view class="ml-2">油价: 7.8</view>
      </view>
    </view>
    <view class="func-col-2 bg-indigo-300 func-text">关于我们</view>
  </view>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.func-col-1 {
  @apply bg-indigo-300 h-10 rounded-lg flex justify-center items-center;
}

.func-col-2 {
  @apply h-20 rounded-lg rounded-lg flex justify-center items-center;
}

.func-text {
  font-weight: bold;
}

.func-col-3 {
  @apply h-10 rounded-lg rounded-lg flex justify-center items-center;
}
</style>
