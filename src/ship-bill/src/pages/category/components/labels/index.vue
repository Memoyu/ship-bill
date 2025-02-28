<template>
  <view class="mt3">
    <view class="grid grid-cols-3 gap-2">
      <view v-for="label in labels" :key="label._id">
        <view class="py-1 px-2 h-8 bg-slate-100 flex justify-between items-center rounded-md">
          <wd-text color="#000" :text="label.name" :lines="1" size="35rpx"></wd-text>
          <wd-icon v-if="!label.base" name="close-outline" size="40rpx" />
        </view>
      </view>

      <view
        class="h-8 border-dashed border-2 border-indigo-600 flex justify-center items-center rounded-md"
        @click="handleClickAddLabel"
      >
        <wd-icon name="add" size="40rpx" />
      </view>
    </view>

    <wd-popup
      v-model="show"
      custom-style="border-radius:25rpx;height: 300rpx;width: 90%;"
      @close="handleClosePopup"
    >
      <view class="mt-2">
        <wd-input
          label="分类名称"
          label-width="70px"
          no-border
          size="large"
          type="text"
          v-model="labelName"
          placeholder="请输入分类名称"
        />
      </view>
      <view class="w-full flex justify-between absolute bottom-2">
        <wd-button type="info" @click="handleClosePopup">取消</wd-button>
        <wd-button @click="handleClickSaveLabel">保存</wd-button>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
defineProps<{ type: number; labels?: any[] }>()

const show = ref<boolean>(false)
const labelName = ref<string>('')
const handleClickAddLabel = () => {
  show.value = true
}

const handleClosePopup = () => {
  show.value = false
}

const handleClickSaveLabel = () => {
  if (labelName.value.length < 1) {
    uni.showToast({
      title: '分类名称不能为空',
      icon: 'none',
    })
  }
}
</script>
