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
    <view
      class="px-4 overflow-y-auto"
      :style="{ height: `calc(100vh - ${safeAreaInsets?.top}px - 64px)` }"
    >
      <view class="sticky top-0 bg-white z-[9]">
        <view v-if="!isModify" class="w-50">
          <wd-segmented
            :options="types"
            v-model:value="type"
            size="middle"
            @change="handleChangeType"
          />
        </view>
        <view class="my-2 ml-4">
          <wd-text
            mode="price"
            :color="isExpendString(type) ? '#80CBC4' : '#B82132'"
            size="35px"
            :text="amount"
            bold
          />
        </view>
      </view>

      <view class="mx-4 mt-5">
        <view class="flex justify-between">
          <view class="flex">
            <text class="inline-block w-12">{{ feeLabel }}:</text>
            <wd-input
              v-model="fee"
              no-border
              type="number"
              :placeholder="feePlaceholder"
              custom-style="display: inline-block;border-radius: 5px; width: 60px;text-align: center; background-color:#f8fafc;"
            />
            <text class="ml-1">{{ feeUnit }}</text>
          </view>

          <view class="flex">
            <text class="inline-block w-12">{{ ratesLabel }}:</text>
            <wd-input
              v-model="rates"
              no-border
              type="number"
              :placeholder="ratesPlaceholder"
              custom-style="display: inline-block;border-radius: 5px; width: 60px;text-align: center;background-color:#f8fafc;"
            />
            <text class="ml-1">{{ ratesUnit }}</text>
          </view>
        </view>
      </view>

      <view class="mt-1">
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

      <view class="mt-2">
        <view class="grid grid-cols-2 gap-2">
          <view v-for="(category, index) in billCategories" :key="index" class="relative">
            <view
              class="h-12 py-1 px-2 bg-slate-100 flex flex-col justify-between items-center rounded-md"
              @click="() => handleClickEditBillCategory(category, index)"
            >
              <wd-text color="#000" :text="category.name" size="35rpx" bold />
              <wd-text mode="price" size="13px" :text="category.total" />
            </view>
            <view
              class="flex items-center pr-3 absolute right-0 top-0 h-full"
              @click.stop="() => handleClickDeleteBillCategory(category, index)"
            >
              <wd-icon name="close" />
            </view>
          </view>

          <view
            class="h-12 border-dashed border-2 border-indigo-600 flex justify-center items-center rounded-md"
            @click="handleClickAddBillCategory"
          >
            <wd-icon name="add" size="40rpx" />
          </view>
        </view>
      </view>

      <CategoryPopup
        v-model="pickCategoryShow"
        :type="bill.type"
        :category="inputCategory"
        @confirm="handleConfirmBillCategory"
      />
      <view class="h-[128rpx]" />
    </view>
    <view class="w-full absolute bottom-5">
      <view class="mx-6">
        <wd-button block size="large" :loading="saveLoading" @click="handleClickSave">
          保存
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import CategoryPopup from './components/category/index.vue'
import { BillCategory, createBill, updateBill } from '@/service'
import { getBillType, isExpendString } from '@/utils/bill'
import { useConfigStore } from '@/store'

defineOptions({
  name: 'EditBill',
})

const { safeAreaInsets } = uni.getSystemInfoSync()

const bill = ref({
  type: 1,
  fee: 0,
  rates: 0,
  amount: 0,
  address: '',
  counter: '',
  sub_counter: '',
  remark: '',
  date: Date.now(),
  categorys: [],
})

const { configState } = useConfigStore()

const feeLabel = ref('加油')
const feePlaceholder = ref('加油量')
const feeUnit = ref('升')
const ratesLabel = ref('油价')
const ratesPlaceholder = ref('油价')
const ratesUnit = ref('元')

const oilPrices = configState.oilPrices === 0 ? '' : configState.oilPrices
const commission = configState.commission === 0 ? '' : configState.commission
const fee = ref<number | ''>('')
const rates = ref<number | ''>(oilPrices)
const expendFee = ref<number | ''>('')
const expendRates = ref<number | ''>(oilPrices)
const incomeFee = ref<number | ''>('')
const incomeRates = ref<number | ''>(commission)

const isModify = ref<boolean>(false)
const billId = ref()
const pickCategoryShow = ref<boolean>(false)
const types = ref(['支出', '收入'])
const type = ref('支出')
const saveLoading = ref<boolean>(false)

const billCategories = ref<BillCategory[]>([])
const expendCategories = ref<BillCategory[]>([])
const incomeCategories = ref<BillCategory[]>([])
const inputCategory = ref<BillCategory>()
const inputCategoryIndex = ref<number>(-1)

const amount = computed(() => {
  const categoryTotal = billCategories.value.map((item) => item.total).reduce((a, b) => a + b, 0)
  // console.log('总计', fee.value, rates.value)
  const feeNum = isNaN(Number(fee.value)) ? 0 : Number(fee.value)
  const ratesNum = isNaN(Number(rates.value)) ? 0 : Number(rates.value)
  return (categoryTotal + feeNum * ratesNum).toString()
})

watch(
  () => type.value,
  (newType) => {
    if (newType === '支出') {
      feeLabel.value = '加油'
      feePlaceholder.value = '总油量'
      feeUnit.value = '升'
      ratesLabel.value = '油价'
      ratesPlaceholder.value = '当前油价'
      ratesUnit.value = '元'
    } else {
      feeLabel.value = '产值'
      feePlaceholder.value = '总产值'
      feeUnit.value = '元'
      ratesLabel.value = '提成'
      ratesPlaceholder.value = '产值提成'
      ratesUnit.value = '%'
    }
  },
)

onLoad((option) => {
  if (option.id) {
    isModify.value = true
    billId.value = option.id
  }
})

const handleClickLeft = () => {
  uni.navigateBack({
    fail: () => {
      uni.navigateTo({ url: '/pages/index/index' })
    },
  })
}

const handleClickEditBillCategory = (category: BillCategory, index: number) => {
  pickCategoryShow.value = true
  inputCategory.value = category
  inputCategoryIndex.value = index
}

const handleClickDeleteBillCategory = (category: BillCategory, index: number) => {
  billCategories.value = billCategories.value.filter((item, i) => {
    return i !== index
  })
}

const handleClickAddBillCategory = () => {
  pickCategoryShow.value = true
  inputCategory.value = undefined
  inputCategoryIndex.value = -1
}

const handleConfirmBillCategory = (category: BillCategory) => {
  // console.log(category)
  // 如果是新增
  if (inputCategoryIndex.value < 0) {
    billCategories.value.push(category)
    return
  }
  // 编辑
  billCategories.value[inputCategoryIndex.value] = {
    ...category,
  }
}

const handleChangeType = ({ value }) => {
  const isExpend = isExpendString(value)

  // 支出: 1, 收入: 2
  bill.value.type = getBillType(value)

  // 备份已有分类，切换分类
  if (isExpend) {
    // 收入切换为支出，则备份收入
    incomeCategories.value = billCategories.value
    incomeFee.value = fee.value
    incomeRates.value = rates.value
  } else {
    expendCategories.value = billCategories.value
    expendFee.value = fee.value
    expendRates.value = rates.value
  }
  billCategories.value = isExpend ? expendCategories.value : incomeCategories.value
  fee.value = isExpend ? expendFee.value : incomeFee.value
  rates.value = isExpend ? expendRates.value : incomeRates.value
}

const handleClickSave = async () => {
  saveLoading.value = true

  try {
    if (isModify.value) {
      updateBill({
        fee: Number(fee.value),
        rates: Number(rates.value),
        amount: Number(amount.value),
        address: bill.value.address,
        counter: bill.value.counter,
        sub_counter: bill.value.sub_counter,
        remark: bill.value.remark,
        date: bill.value.date,
        categorys: billCategories.value,
      }).then((res) => {})
    } else {
      createBill({
        fee: Number(fee.value),
        rates: Number(rates.value),
        type: bill.value.type,
        amount: Number(amount.value),
        address: bill.value.address,
        counter: bill.value.counter,
        sub_counter: bill.value.sub_counter,
        remark: bill.value.remark,
        date: bill.value.date,
        categorys: billCategories.value,
      }).then((res) => {
        uni.showToast({ icon: 'none', title: '保存成功' })
        uni.navigateBack()
      })
    }
  } catch (err) {
    uni.showToast({ icon: 'error', title: '保存失败' + err.message })
  } finally {
    saveLoading.value = false
  }
}
</script>

<style lang="scss">
.page-class {
}
</style>
