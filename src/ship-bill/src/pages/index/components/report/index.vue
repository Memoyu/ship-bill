<template>
  <view
    class="container overflow-y-auto py-2 rounded-lg bg-indigo-400 mb-4"
    :style="{ height: windowHeight * 0.4 + 'px' }"
  >
    <view
      v-for="(report, index) in reports"
      :key="index"
      class="px-4 py-2 m-2 bg-white rounded-md"
      @click="() => handleClickItem(report)"
    >
      <view class="mb-2 flex justify-between items-center">
        <wd-text color="#000" :text="report.date" bold />
        <view class="flex items-center">
          <view class="flex items-center">
            <view class="ml-2">
              <wd-text :text="report.expendCount" bold />
            </view>
          </view>
          <view class="flex items-center ml-4">
            <view class="ml-2">
              <wd-text :text="report.incomeCount" bold />
            </view>
          </view>
        </view>
      </view>
      <view class="flex justify-between items-center">
        <view class="flex items-center">
          <view class="mr-2">
            <wd-icon class-prefix="iconfont" name="expend" />
          </view>
          <wd-text :text="report.expend" bold />
        </view>
        <view class="flex items-center">
          <view class="mr-2">
            <wd-icon class-prefix="iconfont" name="income" />
          </view>
          <wd-text :text="report.income" bold />
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getHomeBillReport, HomeBillReport } from '@/service'
import { useHomeStore } from '@/store'
import dayjs from 'dayjs'

const emits = defineEmits<{
  (e: 'click', value: string): void
}>()

const { windowHeight } = uni.getSystemInfoSync()

const { homeState, setReports } = useHomeStore()
const reports = ref<HomeBillReport[]>(homeState.reports)

watch(
  () => homeState.reports,
  (newReports) => {
    reports.value = newReports
  },
)

onLoad(() => {
  const begin = dayjs().startOf('month').valueOf()
  const end = dayjs().endOf('month').valueOf()
  // console.log('时间戳', begin, end, new Date(begin), new Date(end))
  getHomeBillReport(begin, end)
    .then((res) => {
      setReports(res)
    })
    .catch((err) => {
      console.log(err)
    })
})

const handleClickItem = (report: HomeBillReport) => {
  // console.log('summary', summary)
  emits('click', report.date)
}
</script>
