<template>
  <view class="grid grid-cols-2 gap-2">
    <view class="summary-block bg-indigo-400">
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="支出" bold />
        <wd-text color="#FFF" size="15px" mode="price" text="900000" bold />
      </view>
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="加油" bold />
        <view class="flex flex-col text-end">
          <wd-text color="#FFF" size="15px" mode="price" suffix="L" text="1000" bold />
          <wd-text color="#FFF" size="15px" mode="price" text="900000" bold />
        </view>
      </view>
    </view>
    <view class="summary-block bg-purple-400">
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="收入" bold />
        <wd-text color="#FFF" size="15px" mode="price" text="900000" bold />
      </view>
      <view class="summary-block-item">
        <wd-text color="#FFF" size="15px" text="产值" bold />
        <wd-text color="#FFF" size="15px" mode="price" text="900000" bold />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.summary-block {
  @apply p-1 rounded-lg flex flex-col justify-center;
}
.summary-block-item {
  @apply flex justify-between m-1;

  &-title {
    color: white;
  }
}
</style>
