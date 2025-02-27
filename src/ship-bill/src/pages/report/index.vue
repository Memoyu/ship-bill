<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '报表',
  },
}
</route>
<template>
  <view class="bg-white overflow-hidden pt-2 px-4">
    <wd-navbar
      fixed
      safeAreaInsetTop
      placeholder
      title="报表"
      left-text="返回"
      left-arrow
      @click-left="handleClickLeft"
      :bordered="false"
    />
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

<style></style>
