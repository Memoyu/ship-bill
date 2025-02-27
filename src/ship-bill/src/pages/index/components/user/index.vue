<template>
  <view class="h-46 mb-4 flex flex-col justify-end rounded-b-xl bg-gradient-to-t from-indigo-400">
    <view class="p-6 pl-3 flex justify-between items-center rounded-lg" @click="handleClickUser">
      <view class="flex">
        <wd-img :width="50" :height="50" :src="defaultAvatar" />
        <view class="ml-3">
          <view class="text-lg font-bold">王某人</view>
          <view>xxxx公司</view>
        </view>
      </view>
      <wd-icon name="arrow-right" size="22px"></wd-icon>
    </view>
  </view>
</template>

<script lang="ts" setup>
import defaultAvatar from '@/static/avatar.png'

const handleClickUser = () => {
  uni.navigateTo({ url: '/pages/user/index' })
}
</script>
