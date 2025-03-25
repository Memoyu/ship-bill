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
      :title="navbarTitle"
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
            :color="isExpendString(type) ? expendColor : incomeColor"
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
              v-model="total"
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
          <wd-datetime-picker
            label="日期"
            size="large"
            type="date"
            v-model="bill.date"
            :maxDate="dayjs().valueOf()"
          />
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
            v-model="bill.subCounter"
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
      <view :class="['mx-4', 'flex', isModify ? 'justify-between' : 'justify-center']">
        <wd-button
          size="large"
          :loading="saveLoading"
          @click="handleClickSave"
          custom-style="width: 60%;"
        >
          保存
        </wd-button>
        <wd-button
          v-if="isModify"
          size="large"
          type="error"
          :loading="saveLoading"
          @click="handleClickDelete"
        >
          删除
        </wd-button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import CategoryPopup from './components/category/index.vue'
import {
  Bill,
  BillCategory,
  CreateBill,
  createBill,
  deleteBill,
  getBill,
  updateBill,
} from '@/service'
import { getBillType, isExpendString, isIncomeString, isIncomeType } from '@/utils/bill'
import { useConfigStore, useEditBillStore } from '@/store'
import { useMessage } from 'wot-design-uni'

defineOptions({
  name: 'EditBill',
})

const navbarTitle = ref('新增账单')

const expendColor = getCurrentInstance().appContext.config.globalProperties.expendColor
const incomeColor = getCurrentInstance().appContext.config.globalProperties.incomeColor
const { safeAreaInsets } = uni.getWindowInfo()
const { configState } = useConfigStore()
const { addBillAc, deleteBillAc, updateBillAc } = useEditBillStore()
const message = useMessage()

const feeLabel = ref('加油')
const feePlaceholder = ref('加油量')
const feeUnit = ref('升')
const ratesLabel = ref('油价')
const ratesPlaceholder = ref('油价')
const ratesUnit = ref('元')

const oilPrices = configState.oilPrices === 0 ? '' : configState.oilPrices
const commission = configState.commission === 0 ? '' : configState.commission
const expendFee = ref<number | ''>('')
const expendRates = ref<number | ''>(oilPrices)
const incomeFee = ref<number | ''>('')
const incomeRates = ref<number | ''>(commission)

const isModify = ref<boolean>(false)
const billId = ref()
const bill = ref<CreateBill>({
  type: 1,
  total: 0,
  rates: 0,
  amount: 0,
  address: '',
  counter: '',
  subCounter: '',
  remark: '',
  date: dayjs(dayjs().format('YYYY-MM-DD')).valueOf(),
  categories: [],
})
const sourceBill = ref<Bill>()
const pickCategoryShow = ref<boolean>(false)
const types = ref(['支出', '收入'])
const type = ref('支出')
const saveLoading = ref<boolean>(false)

const expendCategories = ref<BillCategory[]>([])
const incomeCategories = ref<BillCategory[]>([])
const inputCategory = ref<BillCategory>()
const inputCategoryIndex = ref<number>(-1)

const amount = computed(() => {
  return computedAmount(type.value).toString()
})

const total = computed<number | ''>({
  get() {
    return isIncomeString(type.value) ? incomeFee.value : expendFee.value
  },
  set(value: number | '') {
    if (isIncomeString(type.value)) {
      incomeFee.value = value
    } else {
      expendFee.value = value
    }
  },
})

const rates = computed<number | ''>({
  get() {
    return isIncomeString(type.value) ? incomeRates.value : expendRates.value
  },
  set(value: number | '') {
    if (isIncomeString(type.value)) {
      incomeRates.value = value
    } else {
      expendRates.value = value
    }
  },
})

const billCategories = computed<BillCategory[]>({
  get() {
    return isIncomeString(type.value) ? incomeCategories.value : expendCategories.value
  },
  set(value: BillCategory[]) {
    if (isIncomeString(type.value)) {
      incomeCategories.value = value
    } else {
      expendCategories.value = value
    }
  },
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
    getBillDetail(option.id)
    navbarTitle.value = '编辑账单'
  }
})

// 计算总额
const computedAmount = (type: string) => {
  const categoryTotal = isIncomeString(type)
    ? incomeCategories.value.map((item) => item.total).reduce((a, b) => a + b, 0)
    : expendCategories.value.map((item) => item.total).reduce((a, b) => a + b, 0)
  // console.log('总计', total.value, rates.value)
  let feeNum = 0
  let ratesNum = 0
  if (isIncomeString(type)) {
    feeNum = isNaN(Number(incomeFee.value)) ? 0 : Number(incomeFee.value)
    ratesNum = (isNaN(Number(incomeRates.value)) ? 0 : Number(incomeRates.value)) * 0.01 // 提成按百分比算
  } else {
    feeNum = isNaN(Number(expendFee.value)) ? 0 : Number(expendFee.value)
    ratesNum = isNaN(Number(expendRates.value)) ? 0 : Number(expendRates.value)
  }
  // console.log(ratesNum)
  return parseFloat((categoryTotal + feeNum * ratesNum).toFixed(2))
}

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
  // 支出: 1, 收入: 2
  bill.value.type = getBillType(value)
}

const handleClickSave = async () => {
  const amountNum = Number(amount.value)
  saveLoading.value = true

  try {
    if (isModify.value) {
      if (amountNum <= 0) {
        uni.showToast({ icon: 'none', title: '总金额不能为0' })
        return
      }

      updateBill({
        _id: billId.value,
        total: Number(total.value),
        rates: Number(rates.value),
        amount: amountNum,
        address: bill.value.address,
        counter: bill.value.counter,
        subCounter: bill.value.subCounter,
        remark: bill.value.remark,
        date: bill.value.date,
        categories: billCategories.value,
      }).then((res) => {
        updateBillAc(sourceBill.value, res)
        uni.showToast({ icon: 'none', title: '保存成功' })
      })
    } else {
      // 同时获取输入的支出，收入
      const bills = getCreateBills()
      if (bills.length <= 0) {
        uni.showToast({ icon: 'none', title: '账单收入或支出总金额不能0' })
        return
      }

      // 批量插入账单
      Promise.all(bills.map((bill) => createBill(bill))).then((res) => {
        // console.log('创建完成账单：', res)
        res.forEach((b, index) => {
          setTimeout(
            () => {
              addBillAc(b)
            },
            index === 0 ? 0 : 200,
          )
        })
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

const handleClickDelete = () => {
  message
    .confirm({
      msg: `是否删除该账单?`,
      title: '提示',
    })
    .then(() => {
      deleteBill(billId.value)
        .then((res) => {
          deleteBillAc(sourceBill.value)
          uni.showToast({ icon: 'none', title: '删除成功' })
          uni.navigateBack()
        })
        .catch((err) => {
          console.log(err)
        })
    })
}

const getBillDetail = (id: string) => {
  // console.log('获取账单详情')
  getBill(id).then((res) => {
    bill.value = res
    sourceBill.value = { ...res }
    type.value = res.type === 1 ? '支出' : '收入'
    total.value = res.total
    if (res.total !== 0) rates.value = res.rates
    billCategories.value = res.categories
  })
}

const getCreateBills = () => {
  const bills = []

  // 支出
  const expend = '支出'
  const expendAmount = computedAmount(expend)
  if (expendAmount > 0) {
    bills.push({
      total: Number(expendFee.value),
      rates: Number(expendRates.value),
      type: getBillType(expend),
      amount: expendAmount,
      address: bill.value.address,
      counter: bill.value.counter,
      subCounter: bill.value.subCounter,
      remark: bill.value.remark,
      date: bill.value.date,
      categories: expendCategories.value,
    })
  }

  // 收入
  const income = '收入'
  const incomeAmount = computedAmount(income)
  if (incomeAmount > 0) {
    bills.push({
      total: Number(incomeFee.value),
      rates: Number(incomeRates.value),
      type: getBillType(income),
      amount: incomeAmount,
      address: bill.value.address,
      counter: bill.value.counter,
      subCounter: bill.value.subCounter,
      remark: bill.value.remark,
      date: bill.value.date,
      categories: incomeCategories.value,
    })
  }

  // console.log('创建的账单：', bills)
  return bills
}
</script>

<style lang="scss">
.page-class {
}
</style>
