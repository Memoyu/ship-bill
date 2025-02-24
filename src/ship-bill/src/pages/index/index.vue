<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view
    class="bg-white overflow-hidden pt-2 px-4"
    :style="{ marginTop: safeAreaInsets?.top + 'px' }"
  >
    <UserInfo />
    <wd-fab
      type="primary"
      position="right-bottom"
      activeIcon="add"
      :gap="{ right: 40, bottom: 60 }"
    />
  </view>
</template>

<script lang="ts" setup>
import UserInfo from './components/user/index.vue'

defineOptions({
  name: 'Bill',
})

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()

onLoad(() => {})
</script>

<style>
.main-title-color {
  color: #d14328;
}
</style>
