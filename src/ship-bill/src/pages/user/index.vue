<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '用户',
  },
}
</route>
<template>
  <view class="user-page">
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
      <button
        v-if="loaded"
        class="avatar-wrapper"
        open-type="chooseAvatar"
        @chooseavatar="handleChooseAvatar"
      >
        <view class="flex-1">
          <wd-img
            round
            :width="60"
            :height="60"
            :src="user.avatar && user.avatar.length > 1 ? user.avatar : defaultAvatar"
          />
        </view>
      </button>

      <view class="mt-5 flex flex-col justify-between">
        <wd-cell-group border>
          <wd-input
            label="姓名"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="user.name"
            placeholder="请输入姓名"
          />
          <wd-input
            label="公司"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="user.company"
            placeholder="请输入公司"
          />
          <wd-input
            label="电话"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="user.phone"
            placeholder="请输入电话"
          />
          <wd-input
            label="车牌"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="user.licensePlate"
            placeholder="请输入车牌"
          />
        </wd-cell-group>
      </view>
      <view class="w-full absolute bottom-8">
        <view class="mx-6">
          <wd-button block size="large" :loading="saveLoading" @click="handleClickSave">
            保存
          </wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { updateUser, getUser, IUser, IUpdateUser, uploadAvatar } from '@/service'
import { useUserStore } from '@/store'
import defaultAvatar from '@/static/avatar.png'

defineOptions({
  name: 'User',
})

const { userState, setUser } = useUserStore()

const saveLoading = ref<boolean>(false)
const loaded = ref<boolean>(false)
const user = ref<IUser>()

onLoad(() => {
  const openid = userState.openid
  getUser(openid)
    .then((res) => {
      user.value = res
    })
    .catch(console.log)
  loaded.value = true
})

const handleClickLeft = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/index/index' })
    },
  })
}

const handleChooseAvatar = (e: any) => {
  // console.log(e)
  const avatarUrl = e.detail.avatarUrl

  uploadAvatar(user.value.openid, avatarUrl)
    .then((res) => {
      user.value.avatar = res
      wx.showToast({
        icon: 'success',
        title: '上传成功',
      })
    })
    .catch((e) => {
      wx.showToast({
        icon: 'error',
        title: '上传失败',
      })
    })
}

const handleClickSave = () => {
  saveLoading.value = true
  updateUser({
    _id: user.value._id,
    name: user.value.name,
    avatar: user.value.avatar,
    company: user.value.company,
  })
    .then((res) => {
      console.log('更新成功', res)
      uni.showToast({ icon: 'success', title: '更新成功' })
      setUser(res)
      saveLoading.value = false
    })
    .catch((e) => {
      saveLoading.value = false
      console.log(e)
    })
}
</script>

<style lang="scss">
.user-page {
  .avatar-wrapper {
    height: 60px;
    width: 60px;
    padding: 0 !important;
    @apply flex justify-center rounded-full;
  }
}
</style>
