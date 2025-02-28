<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view class="bg-slate-50">
    <User />
    <view class="px-4">
      <Summary />
      <Report @click="handleClickSummary" />
      <Func />
      <!-- 这是底部撑起来的 -->
      <view style="height: 90px" />

      <BillPanel :date="summaryDate" />
      <wd-fab
        :expandable="false"
        type="primary"
        position="right-bottom"
        activeIcon="add"
        :gap="{ right: 40, bottom: 60 }"
        @click="handleClickAddBill"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import User from './components/user/index.vue'
import Summary from './components/summary/index.vue'
import Report from './components/report/index.vue'
import Func from './components/func/index.vue'
import BillPanel from './components/bill/index.vue'

defineOptions({
  name: 'Index',
})

const summaryDate = ref('')

onLoad(() => {})

const handleClickAddBill = () => {
  uni.navigateTo({
    url: '/pages/bill/edit/index',
  })
}

const handleClickSummary = (date: string) => {
  console.log(date)
  summaryDate.value = date
}
</script>

<style></style>
