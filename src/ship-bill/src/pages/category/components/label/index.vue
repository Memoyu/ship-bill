<template>
  <view class="p-2 bg-slate-100 flex justify-between rounded-md">
    <view>{{ label.name }}</view>
    <wd-icon v-if="!label.base" name="close-outline" size="22px" />
  </view>
</template>

<script lang="ts" setup>
defineProps<{ label?: any }>()
</script>
