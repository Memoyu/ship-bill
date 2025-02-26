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
    ></wd-navbar>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Report',
})

onLoad(() => {})

function handleClickLeft() {
  uni.navigateBack()
}
</script>

<style>
.main-title-color {
  color: #d14328;
}
</style>
