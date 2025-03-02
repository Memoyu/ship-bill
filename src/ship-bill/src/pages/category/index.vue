<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
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
    <view>
      <wd-segmented
        :options="types"
        v-model:value="typeName"
        size="middle"
        @change="handleChangeType"
      />
      <Labels :type="type" v-model:categories="categories" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Category, getCategories } from '@/service'
import Labels from './components/labels/index.vue'

defineOptions({
  name: 'Category',
})

const types = ref(['支出', '收入'])
const typeName = ref<string>('支出')
const type = ref<number>(1)
const categories = ref<Category[]>([])

onLoad(() => {
  uni.showLoading({
    title: '加载中',
  })

  getCategories()
    .then((res) => {
      categories.value = res
      uni.hideLoading()
    })
    .catch((e) => {
      uni.hideLoading()
      console.log(e)
    })
})

const handleClickLeft = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/index/index' })
    },
  })
}

const handleChangeType = ({ value }) => {
  // console.log(value)
  type.value = value === '支出' ? 1 : 2
}

const handleClickAddIncome = () => {}

const handleClickAddExpend = () => {}
</script>

<style></style>
