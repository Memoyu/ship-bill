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
  <view class="bg-indigo-100">
    <User />
    <view class="px-4">
      <Summary />
      <Report @click="handleClickSummary" />
      <Func />
      <!-- 这是底部撑起来的 -->
      <view style="height: 90px" />

      <BillPanel :date="summaryDate" v-model:show="billShow" />
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
import { getConfig } from '@/service'
import { useConfigStore } from '@/store'

defineOptions({
  name: 'Index',
})

const { setConfig } = useConfigStore()

const summaryDate = ref('')
const billShow = ref(false)

onLoad(() => {
  loadData()
})

const handleClickAddBill = () => {
  uni.navigateTo({
    url: '/pages/bill/edit/index',
  })
}

const handleClickSummary = (date: string) => {
  summaryDate.value = date
  billShow.value = true
}

const loadData = () => {
  getConfig().then((config) => {
    if (config._id) {
      setConfig(config)
    }
  })
}
</script>

<style></style>
