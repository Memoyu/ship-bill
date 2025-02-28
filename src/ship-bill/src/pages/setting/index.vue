<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '设置',
  },
}
</route>

<template>
  <view>
    <wd-navbar
      fixed
      safeAreaInsetTop
      placeholder
      title="设置"
      left-text="返回"
      left-arrow
      @click-left="handleClickLeft"
      :bordered="false"
    />
    <view class="bg-white overflow-hidden mt-4">
      <view class="flex flex-col justify-between">
        <wd-cell-group border>
          <wd-cell size="large" title="产值(%点)">
            <wd-input-number v-model="outputValue" :min="0" :max="100" :precision="2" />
          </wd-cell>
          <wd-cell size="large" title="油价(元)">
            <wd-input-number v-model="oilPrices" :min="0" :max="20" :precision="2" />
          </wd-cell>
        </wd-cell-group>
      </view>
    </view>
    <view class="w-full flex justify-center absolute bottom-8">
      <wd-button :loading="saveLoading">保存</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'Setting',
})

const outputValue = ref<number>(0)
const oilPrices = ref<number>(0)
const saveLoading = ref<boolean>(false)

onLoad(() => {})

function handleClickLeft() {
  uni.navigateBack()
}
</script>

<style></style>
