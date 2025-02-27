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
      title="账单"
      left-text="返回"
      left-arrow
      @click-left="handleClickLeft"
      :bordered="false"
    />
    <view class="px-4">
      <view class="w-30">
        <wd-tabs v-model="bill.type">
          <wd-tab title="收入" />
          <wd-tab title="支出" />
        </wd-tabs>
      </view>
      <view class="ml-7">
        <wd-text mode="price" size="35px" :text="bill.amount" bold />
      </view>
    </view>

    <view>
      <wd-cell-group>
        <wd-input
          label="地址"
          label-width="50px"
          no-border
          type="text"
          v-model="bill.address"
          placeholder="装货地址, 例如: 广州江高+南海水里"
        />
        <wd-input
          label="柜号"
          label-width="50px"
          no-border
          type="text"
          v-model="bill.counter"
          placeholder="柜号, 例如: AKKU1234567"
        />
        <wd-input
          label="子柜号"
          label-width="50px"
          no-border
          type="text"
          v-model="bill.sub_counter"
          placeholder="子柜号, 例如: 1234567"
        />
      </wd-cell-group>
    </view>

    <view class="w-full flex justify-center absolute bottom-8">
      <wd-button :loading="saveLoading">保存</wd-button>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  name: 'EditBill',
})

const saveLoading = ref<boolean>(false)
const bill = {
  type: 1,
  amount: 0,
  address: '',
  counter: '',
  sub_counter: '',
  remark: '',
  date: '',
  category: '',
  categoryId: '',
}

onLoad(() => {})

function handleClickLeft() {
  uni.navigateBack()
}
</script>

<style></style>
