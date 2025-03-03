<template>
  <wd-popup
    v-model="showPopup"
    custom-style="border-radius:25rpx;height: 60%;width: 95%;"
    @close="handleClosePopup"
  >
    <view class="pt-3 sticky top-0 bg-white">
      <view class="flex justify-center">
        <wd-text color="#000" :text="billCategory.name" size="40rpx" bold />
      </view>
      <view v-if="showUnitPrice" class="flex">
        <wd-input
          :label="totalLable"
          :placeholder="totalPlace"
          type="number"
          v-model="computedTotal"
        />
        <wd-input
          :label="unitPriceLable"
          :placeholder="unitPricePlace"
          type="number"
          v-model="computedUnitPrice"
        />
      </view>

      <view v-else class="flex">
        <wd-input
          :label="totalLable"
          :placeholder="totalPlace"
          type="number"
          v-model="computedTotal"
        />
      </view>
    </view>

    <view class="m-3">
      <view class="grid grid-cols-3 gap-2">
        <view v-for="item in filterCategories" :key="item._id">
          <view
            :class="[
              'py-1',
              'px-2',
              'h-8',
              'bg-slate-100',
              'flex',
              'justify-between',
              'items-center',
              'rounded-md',
              billCategory.categoryId === item._id ? 'current-item' : '',
            ]"
            @click="() => handleClickCategoryItem(item)"
          >
            <wd-text color="#000" :text="item.name" size="35rpx" />
          </view>
        </view>
      </view>
    </view>

    <view class="py-3 sticky bottom-0 bg-white w-full flex justify-between">
      <wd-button type="info" @click="handleClosePopup">取消</wd-button>
      <wd-button @click="handleClickConfirm">确定</wd-button>
    </view>
  </wd-popup>
</template>

<script lang="ts" setup>
import { Category, BillCategory, getCategories } from '@/service'
import { useConfigStore } from '@/store'
import { isExpendType } from '@/utils/bill'

const props = defineProps<{
  modelValue: boolean
  type: number
  category?: BillCategory
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', value: any): void
}>()

const initBillCategory: BillCategory = { categoryId: '', name: '', total: 0, unitPrice: 0 }

const { configState } = useConfigStore()
const showPopup = ref(false)
const filterCategories = ref<Category[]>([])
const billCategory = ref<BillCategory>(initBillCategory)
const categories = ref<Category[]>([])

const showUnitPrice = ref(false)
const totalLable = ref('')
const totalPlace = ref('')
const unitPriceLable = ref('')
const unitPricePlace = ref('')

const computedTotal = computed({
  get: () => {
    return billCategory.value.total === 0 ? '' : billCategory.value.total
  },
  set: (value) => {
    if (value && isNaN(value)) billCategory.value.total = 0
    else billCategory.value.total = Number(value)
  },
})

const computedUnitPrice = computed({
  get: () => {
    return billCategory.value.unitPrice === 0 ? '' : billCategory.value.unitPrice
  },
  set: (value) => {
    if (value && isNaN(value)) billCategory.value.unitPrice = 0
    else billCategory.value.unitPrice = Number(value)
  },
})

watch(
  () => props.modelValue,
  (nweShow) => {
    showPopup.value = nweShow

    initData(nweShow)
  },
)

watch(
  () => [props.type, billCategory.value.name],
  ([newType, newName]) => {
    // console.log('类型、名称变更', newType, newName)
    if (newType === 2) {
      showUnitPrice.value = true
      totalLable.value = '产值'
      totalPlace.value = '产值总额, 元'
      unitPriceLable.value = '提成'
      unitPricePlace.value = '提成点数, %'
      // billCategory.value.unitPrice = configState.commission
      return
    }

    if (newName === '加油') {
      showUnitPrice.value = true
      totalLable.value = '油量'
      totalPlace.value = '加油量, 升'
      unitPriceLable.value = '油价'
      unitPricePlace.value = '油价, 元'
      // billCategory.value.unitPrice = configState.oilPrices
      return
    }

    showUnitPrice.value = false
    totalLable.value = '总额'
    totalPlace.value = '总额, 元'
  },
)

onLoad(() => {
  // 获取分类数据
  getCategories().then((res) => {
    categories.value = res
  })
})

const handleClosePopup = () => {
  emits('update:modelValue', false)
}

const handleClickConfirm = () => {
  if (billCategory.value.categoryId === '' || billCategory.value.categoryId.length < 1) {
    uni.showToast({
      title: '请选择分类',
      icon: 'none',
    })
    return
  }

  const total = billCategory.value.total
  const unitPrice = billCategory.value.unitPrice

  if (isNaN(total) || total === 0) {
    uni.showToast({
      title: '请输入' + totalLable.value,
      icon: 'none',
    })
    return
  }

  if (showUnitPrice.value && (isNaN(unitPrice) || unitPrice === 0)) {
    uni.showToast({
      title: '请输入' + unitPriceLable.value,
      icon: 'none',
    })
    return
  }

  emits('update:modelValue', false)
  emits('confirm', billCategory.value)
}

const handleClickCategoryItem = (item: Category) => {
  billCategory.value = {
    categoryId: item._id,
    name: item.name,
    total: 0,
    unitPrice: 0,
  }
}

const initData = (show) => {
  if (!show) return

  filterCategories.value = categories.value.filter((item) => {
    return item.type === props.type
  })
  // console.log('加载数据', props.category)

  const inputCategory = props.category
  if (!inputCategory) {
    const unitPrice = isExpendType(props.type) ? configState.commission : configState.oilPrices

    billCategory.value =
      filterCategories.value.length > 1
        ? {
            categoryId: filterCategories.value[0]._id,
            name: filterCategories.value[0].name,
            total: 0,
            unitPrice,
          }
        : initBillCategory
  } else {
    billCategory.value = inputCategory
  }
}
</script>

<style lang="scss" scoped>
.current-item {
  @apply bg-slate-400;
}
</style>
