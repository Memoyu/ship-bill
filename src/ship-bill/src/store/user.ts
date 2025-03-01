import { IUser } from '@/service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const initState = { name: '未登录', company: '', avatar: '' }

export const useUserStore = defineStore(
  'user',
  () => {
    const userState = ref<IUserInfo>({ ...initState })

    const setUser = (user: IUser) => {
      userState.value.openid = user.openid
      userState.value.avatar = user.avatar
      userState.value.name = user.name
      userState.value.company = user.company
    }
    const isLogined = computed(() => !!userState.value.openid)

    return {
      userState,
      setUser,
      isLogined,
    }
  },
  {
    persist: true,
  },
)
