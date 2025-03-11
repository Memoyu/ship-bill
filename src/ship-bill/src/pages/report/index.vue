<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '报表',
  },
}
</route>
<template>
  <view>
    <wd-navbar
      fixed
      safeAreaInsetTop
      placeholder
      title="报表"
      left-text="返回"
      left-arrow
      @click-left="handleClickLeft"
      :bordered="false"
    />
    <view class="ml-5 mb-3">
      <view class="flex justify-between items-center">
        <view>账期</view>
        <view>
          <wd-datetime-picker
            type="date"
            size="large"
            v-model="dates"
            @confirm="handleConfirmDatePicker"
          />
        </view>
      </view>
    </view>
    <view class="px-4">
      <wd-table :data="reports" :height="tableHeight" :fixed-header="false">
        <wd-table-col prop="date" label="日期" align="center"></wd-table-col>
        <!-- 收入 -->
        <wd-table-col prop="address" label="地址" :width="250"></wd-table-col>
        <wd-table-col prop="counter" label="柜号1" :width="150"></wd-table-col>
        <wd-table-col prop="subCounter" label="柜号2" :width="150"></wd-table-col>
        <wd-table-col prop="bang" label="磅费"></wd-table-col>
        <wd-table-col prop="fengGui" label="封柜费"></wd-table-col>
        <wd-table-col prop="yiTi" label="异提费"></wd-table-col>
        <wd-table-col prop="jiaBan" label="加班"></wd-table-col>
        <wd-table-col prop="chaoShi" label="超时费"></wd-table-col>
        <wd-table-col prop="buTie" label="补贴"></wd-table-col>
        <wd-table-col prop="yaYe" label="压夜"></wd-table-col>
        <wd-table-col prop="chaoZhong" label="超重费"></wd-table-col>
        <wd-table-col prop="tiKong" label="提空"></wd-table-col>
        <wd-table-col prop="tiZhong" label="提重"></wd-table-col>
        <wd-table-col prop="haunKong" label="还空"></wd-table-col>
        <wd-table-col prop="haunZhong" label="还重"></wd-table-col>
        <!-- 支出 -->
        <wd-table-col prop="duGui" label="渡柜"></wd-table-col>
        <wd-table-col prop="tingChe" label="停车费"></wd-table-col>
        <wd-table-col prop="gaoSu" label="高速费"></wd-table-col>
        <wd-table-col prop="naioSu" label="尿素"></wd-table-col>
        <wd-table-col prop="tiGui" label="提柜费"></wd-table-col>
        <wd-table-col prop="xiGui" label="洗柜费"></wd-table-col>
        <wd-table-col prop="huanGui" label="换柜费"></wd-table-col>
        <wd-table-col prop="yanHuanGui" label="验还柜"></wd-table-col>
        <wd-table-col prop="xiuXiang" label="修箱费"></wd-table-col>
        <wd-table-col prop="buTai" label="补胎"></wd-table-col>
        <wd-table-col prop="diaoGui" label="吊柜费"></wd-table-col>
        <wd-table-col prop="daDan" label="打单费"></wd-table-col>
        <wd-table-col prop="fengTiao" label="封条费"></wd-table-col>
        <wd-table-col prop="xunGui" label="薰柜费"></wd-table-col>
        <wd-table-col prop="xiuChe" label="修车费"></wd-table-col>

        <!-- 其他 -->
        <wd-table-col prop="other" label="其它"></wd-table-col>
        <wd-table-col prop="oilTotal" label="加油(升)"></wd-table-col>
        <wd-table-col prop="oilAmount" label="加油金额(元)"></wd-table-col>
        <wd-table-col prop="outputValue" label="产值"></wd-table-col>
        <wd-table-col prop="commission" label="提成"></wd-table-col>
        <wd-table-col prop="remark" label="备注" :width="250"></wd-table-col>
      </wd-table>
      <!-- <wd-pagination
        custom-style="border: 1px solid #ececec;border-top:none"
        v-model="page"
        :total="total"
      /> -->
    </view>
    <view class="w-full absolute bottom-3">
      <view class="mx-6">
        <wd-button block size="large" @click="handleClickExport">导出数据</wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getReportBillQuery, getReportBillExport, ReportBill } from '@/service'
import dayjs from 'dayjs'

defineOptions({
  name: 'Report',
})

const { windowHeight, safeAreaInsets } = uni.getWindowInfo()
const tableHeight = ref<string>('400')
const dates = ref<number[]>([dayjs().startOf('month').valueOf(), dayjs().endOf('month').valueOf()])

const reports = ref<ReportBill[]>([])
// const page = ref<number>(1)
// const pageSize = ref<number>(10)

// const total = ref<number>(reports.value.length)
// const paginationData = computed(() => {
//   // 按页码和每页条数截取数据
//   return reports.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
// })

onLoad(() => {
  tableHeight.value = (windowHeight - (safeAreaInsets?.top ?? 0) - 195).toString()
  // console.log(windowHeight, safeAreaInsets, tableHeight.value)

  getReports(dates.value)
})

const handleClickLeft = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/index/index' })
    },
  })
}

const handleConfirmDatePicker = ({ value }) => {
  // console.log(value)
  getReports(value)
}
const getReports = (dates: number[]) => {
  uni.showLoading({
    title: '加载中',
  })
  getReportBillQuery(dates[0], dates[1])
    .then((res) => {
      reports.value = res
    })
    .finally(() => {
      uni.hideLoading()
    })
}
const handleClickExport = () => {
  uni.showLoading({
    title: '导出中',
  })
  getReportBillExport(dates.value[0], dates.value[1])
    .then((resExport) => {
      console.log(resExport)
      uni.hideLoading()
      if (!resExport || !resExport.fileID) {
        uni.showToast({
          title: '导出失败',
          icon: 'error',
        })
        return
      }
      wx.cloud.getTempFileURL({
        fileList: [resExport.fileID],
        success: (resTempFile) => {
          if (!resTempFile || resTempFile.fileList.length < 1) {
            uni.showToast({
              title: '导出失败',
              icon: 'error',
            })
            return
          }

          wx.setClipboardData({
            data: resTempFile.fileList[0].tempFileURL,
            success(res) {
              uni.showToast({
                title: '导出链接已复制，请到浏览器中下载',
                icon: 'none',
                duration: 5000,
              })
              // wx.getClipboardData({
              //   success(res) {
              //     console.log('复制成功', res.data) // data
              //   },
              // })
            },
          })
        },
        fail: (err) => {
          console.log(err)
          uni.showToast({
            title: '导出失败',
            icon: 'error',
          })
        },
      })
    })
    .catch((_) => {
      uni.hideLoading()
      uni.showToast({
        title: '导出失败',
        icon: 'error',
      })
    })
}
</script>

<style></style>
