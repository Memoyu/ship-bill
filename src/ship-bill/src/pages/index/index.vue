<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view class="bg-slate-50 pt-2 px-4" :style="{ marginTop: safeAreaInsets?.top + 'px' }">
    <UserInfo />
    <Summary />
    <Report />
    <Func />
    <!-- 这是底部撑起来的 -->
    <view style="height: 90px" />

    <wd-floating-panel :anchors="anchors">
      <wd-cell-group border>
        <wd-cell v-for="item in data" :key="item" :title="item" />
      </wd-cell-group>
    </wd-floating-panel>

    <wd-fab
      type="primary"
      position="right-bottom"
      activeIcon="add"
      :gap="{ right: 40, bottom: 60 }"
    />
  </view>
</template>

<script lang="ts" setup>
import UserInfo from './components/user/index.vue'
import Summary from './components/summary/index.vue'
import Report from './components/report/index.vue'
import Func from './components/func/index.vue'

defineOptions({
  name: 'Index',
})

const data = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
]
// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
const windowHeight = ref<number>(0)
const anchors = ref<number[]>([])

onLoad(() => {
  windowHeight.value = uni.getSystemInfoSync().windowHeight
  anchors.value = [80, Math.round(0.6 * windowHeight.value)]
})
</script>

<style></style>
