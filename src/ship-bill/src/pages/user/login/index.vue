<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '登录',
  },
}
</route>
<template>
  <view class="login-page">
    <wd-navbar
      fixed
      safeAreaInsetTop
      placeholder
      title="登录"
      @click-left="handleClickLeft"
      :bordered="false"
    >
      <template #left>
        <wd-icon name="home1" size="18" />
      </template>
    </wd-navbar>
    <view class="bg-white absolute top-0 h-screen w-screen">
      <view class="h-full w-full flex flex-col justify-center items-center">
        <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
          <view class="flex-1">
            <wd-img
              round
              :width="60"
              :height="60"
              :src="user.avatar && user.avatar.length > 1 ? user.avatar : defaultAvatar"
            />
          </view>
        </button>
        <view class="my-5">
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
            label="姓名"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="user.name"
            placeholder="请输入姓名"
          />
        </view>
        <view class="w-5/6">
          <wd-button
            block
            :loading="loginLoading"
            :disabled="!user.company || !user.name"
            type="primary"
            @click="handleClickLogin"
          >
            登录
          </wd-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {
  getOpenId,
  createUser,
  updateUser,
  getUser,
  IWxContent,
  IUser,
  ICreateUser,
} from '@/service'
import { useMessage } from 'wot-design-uni'
import defaultAvatar from '@/static/avatar.png'

defineOptions({
  name: 'Login',
})

const message = useMessage()

const isExist = ref<boolean>(false)
const loginLoading = ref<boolean>(false)
const openid = ref<string>('')
const user = ref<ICreateUser>({} as ICreateUser)

onLoad(() => {
  getOpenId()
    .then((res) => {
      console.log(res)
      openid.value = res.openid
      getUser(res.openid).then((res) => {
        console.log(res)
        if (res && res._id && res._id.length > 0) {
          user.value = {
            company: res.company,
            name: res.name,
            avatar: res.avatar,
            openid: res.openid,
          }
          isExist.value = true
        }
      })
    })
    .catch(() => {
      message
        .alert({
          msg: '获取openid失败, 请重试！',
          title: '错误',
        })
        .then(() => {
          // 返回首页
          handleClickLeft()
        })
    })
})

const handleChooseAvatar = (e: any) => {
  console.log(e)
  const avatarUrl = e.detail.avatarUrl

  // 上传头像
  wx.cloud.uploadFile({
    // 上传至微信云存储
    cloudPath: 'avatars/' + openid.value + `-${new Date().getTime()}-` + '.jpg', // 使用时间戳加随机数作为上传至云端的图片名称
    filePath: avatarUrl, // 本地文件路径
    success: (res) => {
      // 返回文件 ID
      // console.log('上传成功', res)
      user.value.avatar = res.fileID
      wx.showToast({
        icon: 'success',
        title: '上传成功',
      })
    },
  })
}

const handleClickLeft = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}

const handleClickLogin = () => {
  loginLoading.value = true
  //   if (isExist.value) {
  //   } else {
  //   }
}
</script>

<style lang="scss">
.login-page {
  .avatar-wrapper {
    height: 60px;
    width: 60px;
    padding: 0 !important;
    @apply flex justify-center rounded-full;
  }
}
</style>
