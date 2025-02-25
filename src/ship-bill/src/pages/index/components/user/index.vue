<template>
  <view class="p-6 pl-3 flex">
    <wd-img :width="50" :height="50" :src="defaultAvatar" />
    <view class="ml-3">
      <view class="text-lg font-bold">王某人</view>
      <view>xxxx公司</view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import defaultAvatar from '@/static/avatar.png'
</script>
