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
              :src="newUser.avatar && newUser.avatar.length > 1 ? newUser.avatar : defaultAvatar"
            />
          </view>
        </button>
        <view class="my-5">
          <wd-input
            label="姓名"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="newUser.name"
            placeholder="请输入姓名"
          />
          <wd-input
            label="公司"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="newUser.company"
            placeholder="请输入公司"
          />
        </view>
        <view class="mt-4 w-5/6">
          <wd-button
            block
            size="large"
            :loading="loginLoading"
            :disabled="!newUser.company || !newUser.name"
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
  IUser,
  ICreateUser,
  uploadAvatar,
} from '@/service'
import { useMessage } from 'wot-design-uni'
import { useUserStore } from '@/store'
import defaultAvatar from '@/static/avatar.png'

defineOptions({
  name: 'Login',
})

const message = useMessage()
const userStore = useUserStore()

const loginLoading = ref<boolean>(false)
const openid = ref<string>('')
const user = ref<IUser>()
const newUser = ref<ICreateUser>({} as ICreateUser)

onLoad(() => {
  getOpenId()
    .then((res) => {
      // console.log(res)
      openid.value = res.openid
      getUser(res.openid).then((res) => {
        // console.log(res)
        if (res && res._id && res._id.length > 0) {
          newUser.value = {
            company: res.company,
            name: res.name,
            avatar: res.avatar,
            openid: res.openid,
          }
          user.value = res
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
  // console.log(e)
  const avatarUrl = e.detail.avatarUrl

  uploadAvatar(openid.value, avatarUrl)
    .then((res) => {
      newUser.value.avatar = res
      console.log('新头像', newUser.value)
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

const handleClickLeft = () => {
  uni.reLaunch({ url: '/pages/index/index' })
}

const handleClickLogin = () => {
  loginLoading.value = true
  if (user.value) {
    // 更新用户
    updateUser({
      _id: user.value._id,
      name: newUser.value.name,
      avatar: newUser.value.avatar,
      company: newUser.value.company,
    })
      .then((res) => {
        // console.log('更新', res)
        loginSuccess(res)
        loginLoading.value = false
      })
      .catch((e) => {
        loginLoading.value = false
        console.log(e)
      })
  } else {
    // 创建用户
    createUser(newUser.value)
      .then((res) => {
        loginSuccess(res)
        loginLoading.value = false
      })
      .catch((e) => {
        loginLoading.value = false
        console.log(e)
      })
  }
}

const loginSuccess = (user: IUser) => {
  // 缓存用户
  userStore.setUser(user)

  // 跳转
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any // 不然会报错
  const opts = currentPage.options
  console.log(opts)
  const redirect = opts.redirect

  let page = '/pages/index/index'
  if (redirect) page = decodeURIComponent(redirect)

  uni.reLaunch({ url: page })
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
