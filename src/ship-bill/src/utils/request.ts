const functionName = 'shipBillFunctions'

export type CallFunctionOptions = {
  type: 'USER' | 'CATEGORY' | 'BILL'
  method: string
  data?: any
  hideErrorToast?: boolean
}

const http = <T>(options: CallFunctionOptions) => {
  return new Promise<T>((resolve, reject) => {
    wx.cloud.callFunction({
      name: functionName,
      data: {
        type: options.type,
        method: options.method,
        data: options.data,
      },
      success: function (res) {
        // console.log(res)
        if (res.errMsg === 'cloud.callFunction:ok') {
          resolve(res.result as T)
        } else {
          !options.hideErrorToast &&
            uni.showToast({
              icon: 'none',
              title: res.errMsg || '请求错误',
            })
          reject(res)
        }
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
