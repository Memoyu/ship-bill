<template>
  <view
    class="container overflow-y-auto py-2 rounded-lg bg-indigo-400 mb-4"
    :style="{ height: windowHeight * 0.4 + 'px' }"
  >
    <view
      v-for="(report, index) in reports"
      :key="index"
      class="p-2 m-2 bg-white rounded-md"
      @click="() => handleClickItem(report)"
    >
      <view class="grid grid-cols-9 gap-3 items-center">
        <view class="col-span-3 flex flex-col">
          <view>{{ dayjs(report.date).year() }}</view>
          <wd-text color="#000" :text="dayjs(report.date).format('MM-DD')" bold />
        </view>
        <view class="col-span-3">支: {{ report.expend }}</view>
        <view class="col-span-3">收: {{ report.income }}</view>
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
  console.log('时间戳', begin, end, new Date(begin), new Date(end))
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
