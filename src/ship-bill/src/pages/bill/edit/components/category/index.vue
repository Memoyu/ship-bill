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

      <wd-input label="金额" placeholder="分类金额" type="number" v-model="total" />
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

const props = defineProps<{
  modelValue: boolean
  type: number
  category?: BillCategory
}>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', value: any): void
}>()

const initBillCategory: BillCategory = { categoryId: '', name: '', total: 0 }

const showPopup = ref(false)
const filterCategories = ref<Category[]>([])
const billCategory = ref<BillCategory>(initBillCategory)
const categories = ref<Category[]>([])

const total = computed({
  get() {
    return billCategory.value.total === 0 ? '' : billCategory.value.total.toString()
  },
  set(value: string) {
    billCategory.value.total = Number(value)
  },
})

watch(
  () => props.modelValue,
  (nweShow) => {
    showPopup.value = nweShow
    initData(nweShow)
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

  if (isNaN(total) || total === 0) {
    uni.showToast({
      title: '请输入金额',
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
    total: billCategory.value.total,
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
    billCategory.value =
      filterCategories.value.length > 1
        ? {
            categoryId: filterCategories.value[0]._id,
            name: filterCategories.value[0].name,
            total: 0,
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
