<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '分类管理',
  },
}
</route>
<template>
  <view class="bg-white overflow-hidden pt-2 px-4">
    <wd-navbar
      fixed
      safeAreaInsetTop
      placeholder
      title="分类管理"
      left-text="返回"
      left-arrow
      @click-left="handleClickLeft"
      :bordered="false"
    />

    <wd-tabs v-model="type">
      <wd-tab title="收入">
        <Labels :type="1" :labels="incomes" />
      </wd-tab>

      <wd-tab title="支出">
        <Labels :type="2" :labels="expends" />
      </wd-tab>
    </wd-tabs>
  </view>
</template>

<script lang="ts" setup>
import Labels from './components/labels/index.vue'

defineOptions({
  name: 'Report',
})

const incomes = [
  { _id: '111111', name: '磅费', base: true },
  { _id: '222222', name: '超时费', base: true },
  { _id: '333333', name: '提空', base: true },
  { _id: '444444', name: '封柜费', base: true },
  { _id: '555555', name: '补贴', base: false },
  { _id: '666666', name: '提重', base: false },
  { _id: '777777', name: '自定义来', base: false },
]

const expends = [
  { _id: '111111', name: '尿素', base: true },
  { _id: '222222', name: '停车费', base: true },
  { _id: '333333', name: '换柜费', base: true },
  { _id: '444444', name: '高速费', base: true },
  { _id: '555555', name: '验还柜', base: false },
  { _id: '666666', name: '修柜费', base: false },
]

const type = ref<string>('0')

onLoad(() => {})

function handleClickLeft() {
  uni.navigateBack()
}

const handleClickAddIncome = () => {}

const handleClickAddExpend = () => {}
</script>

<style></style>
