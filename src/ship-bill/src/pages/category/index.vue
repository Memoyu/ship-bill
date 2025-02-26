<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
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
        <view class="mt3 grid grid-cols-3 gap-2">
          <view v-for="l in incomes" :key="l._id">
            <LabelItem :label="l" />
          </view>

          <view
            class="border-dashed border-2 border-indigo-600 rounded-md flex justify-center items-center"
            @click="handleClickAddIncome"
          >
            <wd-icon name="add" size="20px"></wd-icon>
          </view>
        </view>
      </wd-tab>

      <wd-tab title="支出">
        <view class="mt3 grid grid-cols-3 gap-2">
          <view v-for="l in expends" :key="l._id">
            <LabelItem :label="l" />
          </view>

          <view
            class="border-dashed border-2 border-indigo-600 rounded-md flex justify-center items-center"
            @click="handleClickAddExpend"
          >
            <wd-icon name="add" size="20px"></wd-icon>
          </view>
        </view>
      </wd-tab>
    </wd-tabs>
  </view>
</template>

<script lang="ts" setup>
import LabelItem from './components/label/index.vue'

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

<style>
.main-title-color {
  color: #d14328;
}
</style>
