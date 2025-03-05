<template>
  <view class="grid grid-cols-2 gap-2 mb-4">
    <view class="summary-block bg-indigo-400">
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="支出" bold />
        <wd-text color="#FFF" size="15px" mode="price" :text="summary.expend" bold />
      </view>
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="加油" bold />
        <view class="flex flex-col text-end">
          <wd-text
            color="#FFF"
            size="15px"
            mode="price"
            suffix="L"
            :text="summary.oilQuantity"
            bold
          />
          <wd-text color="#FFF" size="15px" mode="price" :text="summary.oilCost" bold />
        </view>
      </view>
    </view>
    <view class="summary-block bg-purple-400">
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="收入" bold />
        <wd-text color="#FFF" size="15px" mode="price" :text="summary.income" bold />
      </view>
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="产值" bold />
        <wd-text color="#FFF" size="15px" mode="price" :text="summary.outputValue" bold />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getHomeBillSummary, HomeBillSummary } from '@/service'
import { useHomeStore } from '@/store'
import dayjs from 'dayjs'

const { homeState, setSummary } = useHomeStore()
const summary = ref<HomeBillSummary>(homeState.summary)

watch(
  () => homeState.summary,
  (newSummary) => {
    summary.value = newSummary
  },
)

onLoad(() => {
  const begin = dayjs().startOf('month').valueOf()
  const end = dayjs().endOf('month').valueOf()
  // console.log('时间戳', begin, end)
  getHomeBillSummary(begin, end)
    .then((res) => {
      setSummary(res)
    })
    .catch((err) => {
      console.log(err)
    })
})
</script>

<style lang="scss">
.summary-block {
  @apply p-1 rounded-lg flex flex-col justify-center;
}
.summary-block-item {
  @apply flex justify-between m-1;

  &-title {
    color: white;
  }
}
</style>
