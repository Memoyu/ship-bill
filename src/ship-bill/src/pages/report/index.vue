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
      <wd-table :data="paginationData" :height="tableHeight" :fixed-header="false">
        <wd-table-col prop="date" label="日期" align="center"></wd-table-col>
        <wd-table-col prop="address" label="地址" align="center"></wd-table-col>
        <wd-table-col prop="counter" label="柜号1" :width="160"></wd-table-col>
        <wd-table-col prop="sub_counter" label="柜号2" :width="180"></wd-table-col>
        <wd-table-col prop="diBang" label="磅费"></wd-table-col>
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
        <wd-table-col prop="haiZhong" label="还重"></wd-table-col>
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
        <wd-table-col prop="other" label="其它"></wd-table-col>
        <wd-table-col prop="remark" label="备注"></wd-table-col>
        <wd-table-col prop="oilTotal" label="加油(升)"></wd-table-col>
        <wd-table-col prop="oilCost" label="油价(元)"></wd-table-col>
        <wd-table-col prop="outputValue" label="产值"></wd-table-col>
        <wd-table-col prop="commission" label="提成"></wd-table-col>
      </wd-table>
      <wd-pagination
        custom-style="border: 1px solid #ececec;border-top:none"
        v-model="page"
        :total="total"
      />
    </view>
    <view class="w-full absolute bottom-3">
      <view class="mx-6">
        <wd-button block size="large">导出数据</wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'

defineOptions({
  name: 'Report',
})

const { windowHeight, safeAreaInsets } = uni.getWindowInfo()
const tableHeight = ref<string>('400')
const dates = ref<number[]>([dayjs().subtract(1, 'month').toDate().valueOf(), Date.now().valueOf()])

const dataList = ref<any[]>([
  {
    name: '关羽',
    school: '武汉市阳逻绿豆学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 66,
    compare: '48%',
    hobby: '颜良文丑，以吾观之，如土鸡瓦犬耳。',
  },
  {
    name: '刘备',
    school: '武汉市阳逻编织学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 68,
    compare: '21%',
    hobby: '我得空明，如鱼得水也',
  },
  {
    name: '赵云',
    school: '武汉市阳逻妇幼保健学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 91,
    compare: '12%',
    hobby: '子龙，子龙，世无双',
  },
  {
    name: '赵云',
    school: '武汉市阳逻妇幼保健学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 91,
    compare: '12%',
    hobby: '子龙，子龙，世无双',
  },
  {
    name: '孔明',
    school: '武汉市阳逻卧龙学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 99,
    compare: '18%',
    hobby: '兴汉讨贼，克复中原',
  },
  {
    name: '赵云',
    school: '武汉市阳逻妇幼保健学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 36,
    compare: '48%',
    hobby: '子龙，子龙，世无双',
  },
  {
    name: '关羽',
    school: '武汉市阳逻绿豆学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 66,
    compare: '48%',
    hobby: '颜良文丑，以吾观之，如土鸡瓦犬耳。',
  },
  {
    name: '刘备',
    school: '武汉市阳逻编织学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 68,
    compare: '21%',
    hobby: '我得空明，如鱼得水也',
  },
  {
    name: '赵云',
    school: '武汉市阳逻妇幼保健学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 91,
    compare: '12%',
    hobby: '子龙，子龙，世无双',
  },
  {
    name: '孔明',
    school: '武汉市阳逻卧龙学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 99,
    compare: '18%',
    hobby: '兴汉讨贼，克复中原',
  },
  {
    name: '赵云',
    school: '武汉市阳逻妇幼保健学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 36,
    compare: '48%',
    hobby: '子龙，子龙，世无双',
  },
  {
    name: '关羽',
    school: '武汉市阳逻绿豆学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 66,
    compare: '48%',
    hobby: '颜良文丑，以吾观之，如土鸡瓦犬耳。',
  },
  {
    name: '刘备',
    school: '武汉市阳逻编织学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 68,
    compare: '21%',
    hobby: '我得空明，如鱼得水也',
  },
  {
    name: '赵云',
    school: '武汉市阳逻妇幼保健学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 91,
    compare: '12%',
    hobby: '子龙，子龙，世无双',
  },
  {
    name: '孔明',
    school: '武汉市阳逻卧龙学院',
    major: '计算机科学与技术专业',
    gender: '男',
    graduation: '2022年1月12日',
    grade: 99,
    compare: '18%',
    hobby: '兴汉讨贼，克复中原',
  },
])
const page = ref<number>(1)
const pageSize = ref<number>(10)

const total = ref<number>(dataList.value.length)
const paginationData = computed(() => {
  // 按页码和每页条数截取数据
  return dataList.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
})

onLoad(() => {
  tableHeight.value = (windowHeight - (safeAreaInsets?.top ?? 0) - 195).toString()
  console.log(windowHeight, safeAreaInsets, tableHeight.value)
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
}
</script>

<style></style>
