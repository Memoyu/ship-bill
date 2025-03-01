<template>
  <view class="h-46 mb-4 flex flex-col justify-end rounded-b-xl bg-gradient-to-t from-indigo-400">
    <view class="p-6 flex justify-between items-center rounded-lg" @click="handleClickUser">
      <view class="flex">
        <wd-img
          round
          :width="50"
          :height="50"
          :src="userAvatar && userAvatar.length > 1 ? userAvatar : defaultAvatar"
        />
        <view :class="['ml-3', hasCompany ? '' : 'flex items-center']">
          <view class="text-lg font-bold">{{ userName }}</view>
          <view v-if="hasCompany">{{ userCompany }}</view>
        </view>
      </view>
      <wd-icon name="arrow-right" size="22px"></wd-icon>
    </view>
  </view>
</template>

<script lang="ts" setup>
import defaultAvatar from '@/static/avatar.png'
import { useUserStore } from '@/store/user'

const user = useUserStore().userState

const hasCompany = user.company && user.company.length > 1
const userName = ref<string>(user.name)
const userAvatar = ref<string>(user.avatar)
const userCompany = ref<string>(user.company)

watch(
  () => [user.name, user.avatar, user.company],
  ([newName, newAvatar, newCompany]) => {
    userName.value = newName
    userAvatar.value = newAvatar
    userCompany.value = newCompany
  },
)

const handleClickUser = () => {
  uni.navigateTo({ url: '/pages/user/index' })
}
</script>
