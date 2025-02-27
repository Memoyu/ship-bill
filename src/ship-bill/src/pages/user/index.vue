<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '用户',
  },
}
</route>
<template>
  <view>
    <wd-navbar
      fixed
      safeAreaInsetTop
      placeholder
      title="用户"
      left-text="返回"
      left-arrow
      @click-left="handleClickLeft"
      :bordered="false"
    />
    <view class="bg-white overflow-hidden pt-2 mt-4">
      <view class="flex flex-col justify-between">
        <wd-cell-group border>
          <wd-input
            label="公司"
            label-width="50px"
            no-border
            type="text"
            v-model="user.company"
            placeholder="请输入公司"
          />
          <wd-input
            label="姓名"
            label-width="50px"
            no-border
            type="text"
            v-model="user.name"
            placeholder="请输入姓名"
          />
          <wd-input
            label="电话"
            label-width="50px"
            no-border
            type="text"
            v-model="user.phone"
            placeholder="请输入电话"
          />
          <wd-input
            label="车牌"
            label-width="50px"
            no-border
            type="text"
            v-model="user.license_plate"
            placeholder="请输入车牌"
          />
        </wd-cell-group>
      </view>
      <view class="w-full flex justify-center absolute bottom-8">
        <wd-button :loading="saveLoading">保存</wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'User',
})

const saveLoading = ref<boolean>(false)
const user = {
  company: '',
  name: '',
  phone: '',
  license_plate: '',
}

onLoad(() => {})

function handleClickLeft() {
  uni.navigateBack()
}
</script>

<style></style>
