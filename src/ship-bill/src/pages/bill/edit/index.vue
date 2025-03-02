<route lang="json5" type="page">
{
  layout: 'default',
  needLogin: true,
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '账单',
  },
}
</route>
<template>
  <view>
    <view class="bg-white pt-2 px-4 page-class">
      <wd-navbar
        fixed
        safeAreaInsetTop
        placeholder
        title="账单"
        left-text="返回"
        left-arrow
        @click-left="handleClickLeft"
        :bordered="false"
      />
      <view class="w-50">
        <wd-segmented
          :options="types"
          v-model:value="type"
          size="middle"
          @change="handleChangeType"
        />
      </view>
      <view class="my-2 ml-4">
        <wd-text mode="price" size="35px" :text="bill.amount" bold />
      </view>

      <view>
        <view class="grid grid-cols-2 gap-2">
          <view v-for="(category, index) in categories" :key="index">
            <view
              class="h-12 py-1 px-2 bg-slate-100 flex flex-col justify-between items-center rounded-md"
              @click="() => handleClickCategoryItem(category)"
            >
              <wd-text color="#000" :text="category.name" size="35rpx" bold />
              <wd-text
                v-if="category.unitPrice <= 0"
                mode="price"
                size="13px"
                :text="category.total"
              />
              <view v-else>
                <wd-text size="13px" :text="category.total" />
                <wd-text size="13px" text="×" bold />
                <wd-text size="13px" :text="category.unitPrice" />
                <wd-text size="13px" text="=" bold />
                <wd-text size="13px" mode="price" :text="category.total * category.unitPrice" />
              </view>
            </view>
          </view>

          <view
            class="h-12 border-dashed border-2 border-indigo-600 flex justify-center items-center rounded-md"
            @click="handleClickAddCategory"
          >
            <wd-icon name="add" size="40rpx" />
          </view>
        </view>
      </view>

      <view class="mt-3">
        <wd-cell-group>
          <wd-datetime-picker label="日期" size="large" type="date" v-model="bill.date" />
          <wd-input
            label="地址"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="bill.address"
            placeholder="装货地址, 例如: 广州江高+南海水里"
          />
          <wd-input
            label="柜号1"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="bill.counter"
            placeholder="例如: AKKU1234567"
          />
          <wd-input
            label="柜号2"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="bill.sub_counter"
            placeholder="例如: 1234567"
          />
          <wd-input
            label="备注"
            label-width="50px"
            no-border
            size="large"
            type="text"
            v-model="bill.remark"
            placeholder="备注"
          />
        </wd-cell-group>
      </view>

      <CategoryPopup
        v-model="pickCategoryShow"
        :type="bill.type"
        :category="currentCategory"
        @confirm="handleConfirmAddCategory"
      />
    </view>
    <view class="w-full absolute bottom-8">
      <view class="mx-6">
        <wd-button block size="large" custom-class="custom-shadow" :loading="saveLoading">
          保存
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import CategoryPopup from './components/category/index.vue'

defineOptions({
  name: 'EditBill',
})

const bill = ref({
  type: 1,
  amount: 0,
  address: '',
  counter: '',
  sub_counter: '',
  remark: '',
  date: Date.now(),
  categorys: [],
})

const pickCategoryShow = ref<boolean>(false)
const types = ref(['支出', '收入'])
const type = ref('支出')
const saveLoading = ref<boolean>(false)
const categories = ref<any[]>([
  { _id: '2222221', name: '加油', total: 7000, unitPrice: 7.8 },
  { _id: '777771', name: '自定义来', total: 8000, unitPrice: 0 },
])
const currentCategory = ref<any>()

onLoad(() => {})

const handleClickLeft = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/index/index' })
    },
  })
}

const handleClickAddCategory = () => {
  pickCategoryShow.value = true
  currentCategory.value = undefined
}

const handleConfirmAddCategory = (category: any) => {
  console.log(category)
  categories.value.push(category)
}

const handleChangeType = ({ value }) => {
  // 支出: 1, 收入: 2
  bill.value.type = value === '支出' ? 1 : 2
  // console.log('账单类型切换', bill.value.type, value)
}

const handleClickCategoryItem = (category: any) => {
  pickCategoryShow.value = true
  currentCategory.value = category
}
</script>

<style lang="scss">
.page-class {
  :deep() {
    // .custom-shadow {
    //   width: 80%;
    // }
  }
}
</style>
