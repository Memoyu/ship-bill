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
    <view class="px-4">
      <wd-table :data="paginationData" :height="tableHeight" :fixed-header="false">
        <wd-table-col prop="name" label="姓名" align="center"></wd-table-col>
        <wd-table-col prop="grade" label="分数" align="center"></wd-table-col>
        <wd-table-col prop="hobby" label="一言以蔽之" :width="160"></wd-table-col>
        <wd-table-col prop="school" label="求学之所" :width="180"></wd-table-col>
        <wd-table-col prop="major" label="专业"></wd-table-col>
        <wd-table-col prop="gender" label="性别"></wd-table-col>
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
defineOptions({
  name: 'Report',
})

const { windowHeight, safeAreaInsets } = uni.getWindowInfo()
const tableHeight = ref<string>('400')

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
  tableHeight.value = (windowHeight - (safeAreaInsets?.top ?? 0) - 91 - (36 + 20)).toString()
  console.log(windowHeight, safeAreaInsets, tableHeight.value)
})

const handleClickLeft = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/index/index' })
    },
  })
}
</script>

<style></style>
