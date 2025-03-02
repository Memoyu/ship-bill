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
        <view v-for="item in categories" :key="item._id">
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
const props = defineProps<{ modelValue: boolean; type: number; category?: any }>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', value: any): void
}>()

const showPopup = ref(false)
watch(
  () => props.modelValue,
  (nweShow) => {
    showPopup.value = nweShow
  },
)

const categories = ref([
  { _id: '111111', name: '磅费', base: true },
  { _id: '222222', name: '超时费', base: true },
  { _id: '2222221', name: '加油', base: true },
  { _id: '333333', name: '提空', base: true },
  { _id: '444444', name: '封柜费', base: true },
  { _id: '555555', name: '补贴', base: false },
  { _id: '666666', name: '提重', base: false },
  { _id: '777771', name: '自定义来', base: false },
  { _id: '777772', name: '自定义来', base: false },
  { _id: '777773', name: '自定义来', base: false },
  { _id: '777774', name: '自定义来', base: false },
  { _id: '777775', name: '自定义来', base: false },
  { _id: '777776', name: '自定义来', base: false },
  { _id: '7777777', name: '自定义来', base: false },
  { _id: '777778', name: '自定义来', base: false },
  { _id: '777779', name: '自定义来', base: false },
  { _id: '177771', name: '自定义来', base: false },
  { _id: '277772', name: '自定义来', base: false },
  { _id: '377773', name: '自定义来', base: false },
  { _id: '477774', name: '自定义来', base: false },
  { _id: '577775', name: '自定义来', base: false },
  { _id: '677776', name: '自定义来', base: false },
  { _id: '77777777', name: '自定义来', base: false },
  { _id: '877778', name: '自定义来', base: false },
  { _id: '977779', name: '自定义来', base: false },
])
const typeName = computed(() => {
  // console.log('账单类型变更', props.type)
  return props.type === 1 ? '支出' : '收入'
})

const current = ref<any>({})
const amount = ref({ total: '', unitPrice: '' })

const showUnitPrice = ref(false)
const totalLable = ref('')
const totalPlace = ref('')
const unitPriceLable = ref('')
const unitPricePlace = ref('')

const incomeCategories = ref<any[]>([])
const expendCategories = ref<any[]>([])

watch(
  () => [props.type, current.value.name],
  ([newType, newSelectName]) => {
    if (newType === 2) {
      showUnitPrice.value = true
      totalLable.value = '产值'
      totalPlace.value = '产值总额, 元'
      unitPriceLable.value = '提成'
      unitPricePlace.value = '提成点数, %'
      return
    }

    if (newSelectName === '加油') {
      showUnitPrice.value = true
      totalLable.value = '油量'
      totalPlace.value = '加油量, 升'
      unitPriceLable.value = '油价'
      unitPricePlace.value = '油价, 元'
      return
    }

    showUnitPrice.value = false
    totalLable.value = '总额'
    totalPlace.value = '总额, 元'
  },
)

watch(
  () => props.category,
  (nweCategory) => {
    initCurrentData(nweCategory)
    if (nweCategory) {
      current.value = nweCategory
      amount.value = { total: nweCategory.total, unitPrice: nweCategory.unitPrice }
    }
  },
)

onLoad(() => {
  current.value = categories.value[0]
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

const initCurrentData = (category: any) => {
  // TODO: 加载分类数据

  if (!category) current.value = categories.value.length > 1 ? categories.value[0] : {}
  amount.value = { total: '', unitPrice: '' }
}
</script>

<style lang="scss" scoped>
.current-item {
  @apply bg-slate-400;
}
</style>
