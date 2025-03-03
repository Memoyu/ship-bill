<template>
  <wd-popup
    v-model="showPopup"
    custom-style="border-radius:25rpx;height: 60%;width: 95%;"
    @close="handleClosePopup"
  >
    <view class="pt-3 sticky top-0 bg-white">
      <view class="flex justify-center">
        <wd-text color="#000" :text="current.name" size="40rpx" bold />
      </view>
      <view v-if="showUnitPrice" class="flex">
        <wd-input
          :label="totalLable"
          :placeholder="totalPlace"
          type="number"
          v-model="amount.total"
        />
        <wd-input
          :label="unitPriceLable"
          :placeholder="unitPricePlace"
          type="number"
          v-model="amount.unitPrice"
        />
      </view>

      <view v-else class="flex">
        <wd-input
          :label="totalLable"
          :placeholder="totalPlace"
          type="number"
          v-model="amount.total"
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
              current._id === item._id ? 'current-item' : '',
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

const props = defineProps<{
  modelValue: boolean
  type: number
  category?: BillCategory
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', value: any): void
}>()

const { configState } = useConfigStore()
const showPopup = ref(false)
const filterCategories = ref<Category[]>([])

watch(
  () => props.modelValue,
  (nweShow) => {
    showPopup.value = nweShow

    initCurrentData(nweShow)
  },
)

const typeName = computed(() => {
  // console.log('账单类型变更', props.type)
  return props.type === 1 ? '支出' : '收入'
})

const current = ref<any>({})
const categories = ref<Category[]>([])
const amount = ref({ total: '', unitPrice: '' })

const showUnitPrice = ref(false)
const totalLable = ref('')
const totalPlace = ref('')
const unitPriceLable = ref('')
const unitPricePlace = ref('')

watch(
  () => [props.type, current.value.name],
  ([newType, newSelectName]) => {
    if (newType === 2) {
      showUnitPrice.value = true
      totalLable.value = '产值'
      totalPlace.value = '产值总额, 元'
      unitPriceLable.value = '提成'
      unitPricePlace.value = '提成点数, %'
      amount.value.unitPrice = configState.commission === 0 ? '' : configState.commission.toString()
      return
    }

    if (newSelectName === '加油') {
      showUnitPrice.value = true
      totalLable.value = '油量'
      totalPlace.value = '加油量, 升'
      unitPriceLable.value = '油价'
      unitPricePlace.value = '油价, 元'
      amount.value.unitPrice = configState.oilPrices === 0 ? '' : configState.oilPrices.toString()
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
  if (current.value._id === '' || current.value._id.length === 0) {
    uni.showToast({
      title: '请选择分类',
      icon: 'none',
    })
    return
  }

  const total = Number(amount.value.total)
  const unitPrice = Number(amount.value.unitPrice)

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
  emits('confirm', { ...current.value, total, unitPrice })
}

const handleClickCategoryItem = (item: any) => {
  current.value = item
}

const initCurrentData = (show) => {
  if (!show) return

  filterCategories.value = categories.value.filter((item) => {
    return item.type === props.type
  })
  // console.log('加载数据')

  const inputCategory = props.category
  if (!inputCategory) {
    current.value = filterCategories.value.length > 1 ? filterCategories.value[0] : {}
  } else {
    current.value = inputCategory
    amount.value = {
      total: inputCategory.total.toString(),
      unitPrice: inputCategory.unitPrice.toString(),
    }
  }
  amount.value = { total: '', unitPrice: '' }
}
</script>

<style lang="scss" scoped>
.current-item {
  @apply bg-slate-400;
}
</style>
