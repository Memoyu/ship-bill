import { useUserStore } from '@/store'

const functionName = 'shipBillFunctions'

export type CallFunctionOptions = {
  type: 'USER' | 'CATEGORY' | 'BILL' | 'CONFIG'
  method: string
  data?: any
  hideErrorToast?: boolean
}

export type CallFunctionResult<T> = {
  errMsg: string
  success: boolean
  data: T
}

const ignores = ['USER:openid', 'USER:create', 'USER:update', 'USER:get']

const isLogined = () => {
  const userStore = useUserStore()
  return userStore.isLogined
}

const isIgnore = (type: string, method: string) => {
  return ignores.findIndex((i) => i === `${type}:${method}`) > -1
}

const http = <T>(options: CallFunctionOptions) => {
  return new Promise<T>((resolve, reject) => {
    // console.log('isLogined', isLogined(), isIgnore(options.type, options.method))
    // console.log('request type & method', options.type, options.method)
    if (!isLogined() && !isIgnore(options.type, options.method)) return reject(new Error('未登录'))

    wx.cloud.callFunction({
      name: functionName,
      data: {
        type: options.type,
        method: options.method,
        data: options.data,
      },
      success: function (res) {
        // console.log(res)
        let errMsg = res.errMsg
        if (res.errMsg === 'cloud.callFunction:ok') {
          const result = res.result as CallFunctionResult<T>
          if (result.success) {
            return resolve(result.data)
          }
          errMsg = result.errMsg
        }

        !options.hideErrorToast &&
          uni.showToast({
            icon: 'none',
            title: errMsg || '请求错误',
          })
        reject(res)
      },
      fail: (err) => {
        uni.showToast({
          icon: 'none',
          title: '网络错误，换个网络试试',
        })
        reject(err)
      },
    })
  })
}

export default function request<T = unknown>(options: CallFunctionOptions) {
  return http<T>(options)
}
