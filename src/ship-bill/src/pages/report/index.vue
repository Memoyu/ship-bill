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
        <wd-table-col
          v-for="(col, index) in tableCols.reduce((a, b) => a.concat(b)).filter((c) => !c.hide)"
          :key="index"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
        ></wd-table-col>
      </wd-table>

      <view v-if="reports.length === 0" class="h-full flex items-center">
        <wd-status-tip image="content" tip="暂无数据" />
      </view>
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
import { getReportBillQuery, getReportBillExport, getCategories, ReportBillReq } from '@/service'
import dayjs from 'dayjs'
import { TableColumn } from 'wot-design-uni/components/wd-table-col/types'

interface ReportTableColumn extends TableColumn {
  hide?: boolean
  ignoreSummary?: boolean
}

defineOptions({
  name: 'Report',
})

const { windowHeight, safeAreaInsets } = uni.getWindowInfo()
const tableHeight = ref<string>('400')
const dates = ref<number[]>([dayjs().startOf('month').valueOf(), dayjs().endOf('month').valueOf()])

const defaultColWidth = 100
const tableCols = ref<ReportTableColumn[][]>([
  [
    {
      prop: 'date',
      label: '日期',
      width: defaultColWidth,
      sortDirection: 0,
      align: 'center',
      ignoreSummary: true,
    },
    {
      prop: 'address',
      label: '地址',
      width: '150',
      sortDirection: 0,
      ignoreSummary: true,
    },
    {
      prop: 'counter',
      label: '柜号1',
      width: '150',
      sortDirection: 0,
      ignoreSummary: true,
    },
    {
      prop: 'subCounter',
      label: '柜号2',
      width: '150',
      sortDirection: 0,
      ignoreSummary: true,
    },
  ],
  [],
  [
    {
      prop: 'oilTotal',
      label: '加油(升)',
      width: defaultColWidth,
      sortDirection: 0,
    },
    {
      prop: 'oilAmount',
      label: '加油金额(元)',
      width: defaultColWidth,
      sortDirection: 0,
    },
    {
      prop: 'outputValue',
      label: '产值',
      width: defaultColWidth,
      sortDirection: 0,
    },
    {
      prop: 'commission',
      label: '提成',
      width: defaultColWidth,
      sortDirection: 0,
    },
    {
      prop: 'remark',
      label: '备注',
      width: '250',
      sortDirection: 0,
      ignoreSummary: true,
    },
  ],
])
const reports = ref<any[]>([])
// const page = ref<number>(1)
// const pageSize = ref<number>(10)

// const total = ref<number>(reports.value.length)
// const paginationData = computed(() => {
//   // 按页码和每页条数截取数据
//   return reports.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
// })

onLoad(() => {
  tableHeight.value = (windowHeight - (safeAreaInsets?.top ?? 0) - 165).toString()
  // console.log(windowHeight, safeAreaInsets, tableHeight.value)
  getCategoryList()
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

const getCategoryList = () => {
  getCategories()
    .then((res) => {
      res.forEach((r) => {
        tableCols.value[1].push({
          prop: 'prop_' + r._id,
          label: r.name,
          width: defaultColWidth,
          sortDirection: 0,
        })
      })
      // 获取报表数据
      getReports(dates.value)
    })
    .catch((err) => {
      console.log(err)
    })
}

const getReports = (dates: number[]) => {
  uni.showLoading({
    title: '加载中',
  })
  getReportBillQuery(getRequest(dates))
    .then((res) => {
      console.log(res)
      reports.value = res.reports

      // 汇总数据为0，则不展示行
      tableCols.value.forEach((t) => {
        t.forEach((ts) => {
          if (res.summary[ts.prop] <= 0) {
            ts.hide = true
          }
        })
      })
      reports.value.push({
        date: '汇总',
        address: '',
        counter: '',
        subCounter: '',
        remark: '',
        ...res.summary,
      })
    })
    .finally(() => {
      uni.hideLoading()
    })
}

const handleClickExport = () => {
  if (!reports.value || reports.value.length < 1) {
    uni.showToast({
      title: '查村结果数据为空，无法导出！',
      icon: 'none',
    })
    return
  }

  uni.showLoading({
    title: '导出中',
  })

  getReportBillExport(getRequest(dates.value))
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

const getRequest = (dates: number[]) => {
  return {
    begin: dates[0],
    end: dates[1],
    headers: tableCols.value
      .reduce((a, b) => a.concat(b))
      .map((c) => {
        return { prop: c.prop, title: c.label, ignoreSummary: c.ignoreSummary }
      }),
  }
}
</script>

<style></style>
