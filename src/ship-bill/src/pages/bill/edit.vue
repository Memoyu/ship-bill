<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单编辑',
  },
}
</route>
<template>
  <view
    class="bg-white overflow-hidden pt-2 px-4"
    :style="{ marginTop: safeAreaInsets?.top + 'px' }"
  >
    <wd-navbar title="标题" left-text="返回" left-arrow @click-left="handleClickLeft"></wd-navbar>
    <view class="text-center mt-4">这是 账单编辑</view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'BillEdit',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onLoad(() => {
  uni.hideTabBar()
})

function handleClickLeft() {
  // console.log(getCurrentPages())
  // uni.navigateBack()
  uni.switchTab({
    url: '/pages/bill/index',
    success: (res) => {
      uni.showTabBar()
    },
  })
}
</script>

<style>
.main-title-color {
  color: #d14328;
}
</style>
