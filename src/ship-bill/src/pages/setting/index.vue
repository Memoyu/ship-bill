<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
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
          <wd-cell size="large" title="提成(%点)">
            <wd-input-number v-model="config.commission" :min="0" :max="100" :precision="2" />
          </wd-cell>
          <wd-cell size="large" title="油价(元)">
            <wd-input-number v-model="config.oilPrices" :min="0" :max="20" :precision="2" />
          </wd-cell>
        </wd-cell-group>
      </view>
    </view>
    <view class="w-full absolute bottom-5">
      <view class="mx-6">
        <wd-button block size="large" :loading="saveLoading" @click="handleClickSave">
          保存
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Config, getConfig, updateConfig } from '@/service/config'
import { useConfigStore } from '@/store'

defineOptions({
  name: 'Setting',
})
const initConfig: Config = {
  _id: '',
  openid: '',
  commission: 0,
  oilPrices: 0,
  updateTime: 0,
  createTime: 0,
}

const { setConfig } = useConfigStore()
const config = ref<Config>(initConfig)
const saveLoading = ref<boolean>(false)

onLoad(() => {
  getConfig().then((res) => {
    if (res._id) {
      config.value = res
    } else {
      config.value = initConfig
    }
  })
})

const handleClickLeft = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/index/index' })
    },
  })
}

const handleClickSave = () => {
  saveLoading.value = true
  updateConfig({
    _id: config.value._id,
    commission: config.value.commission,
    oilPrices: config.value.oilPrices,
  })
    .then((res) => {
      console.log('保存成功', res)
      uni.showToast({ icon: 'success', title: '保存成功' })
      setConfig(res)
      saveLoading.value = false
    })
    .catch((e) => {
      console.log(e)
      saveLoading.value = false
    })
}
</script>

<style></style>
