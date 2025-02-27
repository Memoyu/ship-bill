<template>
  <view class="mt3 grid grid-cols-3 gap-2">
    <view v-for="l in labels" :key="l._id">
      <view class="py-1 px-2 h-8 bg-slate-100 flex justify-between items-center rounded-md">
        <wd-text color="#000" :text="l.name" :lines="1" size="35rpx"></wd-text>
        <wd-icon v-if="!l.base" name="close-outline" size="40rpx" />
      </view>
    </view>

    <view
      class="h-8 border-dashed border-2 border-indigo-600 flex justify-center items-center rounded-md"
      @click="handleClickAddLabel"
    >
      <wd-icon name="add" size="40rpx" />
    </view>

    <wd-popup
      v-model="show"
      custom-style="border-radius:25rpx;height: 300rpx;width: 90%;padding: 30rpx;"
      @close="handleCloseAddPopup"
    >
      <view class="h-full flex flex-col justify-between">
        <wd-input type="text" v-model="addName" placeholder="请输入分类名称" />
        <view class="flex justify-between">
          <wd-button type="info" @click="handleCloseAddPopup">取消</wd-button>
          <wd-button @click="handleClickSaveLabel">保存</wd-button>
        </view>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
defineProps<{ type: number; labels?: any[] }>()

const show = ref<boolean>(false)
const addName = ref<string>('')
const handleClickAddLabel = () => {
  show.value = true
}

const handleCloseAddPopup = () => {
  show.value = false
}

const handleClickSaveLabel = () => {
  if (addName.value.length < 1) {
    uni.showToast({
      title: '分类名称不能为空',
      icon: 'none',
    })
  }
}
</script>
