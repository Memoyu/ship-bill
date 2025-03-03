<template>
  <view class="grid grid-cols-3 gap-2">
    <view class="func-col-1 func-text" @click="handleClickChart">图表</view>
    <view class="func-col-1 func-text" @click="handleClickReport">报表</view>
    <view class="func-col-1 func-text" @click="handleClickCategory">分类管理</view>
    <view class="func-col-2 col-span-2 bg-indigo-500 relative" @click="handleClickSetting">
      <view class="func-text">设置</view>
      <view class="absolute bottom-1 flex text-base">
        <view>提成: {{ config.commission }}</view>
        <view class="ml-2">油价: {{ config.oilPrices }}</view>
      </view>
    </view>
    <view class="func-col-2 bg-indigo-300 func-text">关于我们</view>
  </view>
</template>

<script lang="ts" setup>
import { useConfigStore } from '@/store'

const { configState } = useConfigStore()
const config = ref(configState)

watch(
  () => [configState.commission, configState.oilPrices],
  ([newCommission, newOilPrices]) => {
    config.value.commission = newCommission
    config.value.oilPrices = newOilPrices
  },
)

const handleClickSetting = () => {
  uni.navigateTo({
    url: '/pages/setting/index',
  })
}

const handleClickChart = () => {
  uni.navigateTo({
    url: '/pages/chart/index',
  })
}

const handleClickCategory = () => {
  uni.navigateTo({
    url: '/pages/category/index',
  })
}

const handleClickReport = () => {
  uni.navigateTo({
    url: '/pages/report/index',
  })
}
</script>

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
