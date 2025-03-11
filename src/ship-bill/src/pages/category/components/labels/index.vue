<template>
  <view class="mt3">
    <wd-message-box />
    <view class="grid grid-cols-3 gap-2">
      <view
        v-for="category in filterCategories"
        :key="category._id"
        @click="() => handleClickEditCategory(category)"
      >
        <view class="py-1 px-2 h-8 bg-slate-100 flex justify-between items-center rounded-md">
          <wd-text color="#000" :text="category.name" :lines="1" size="35rpx"></wd-text>
          <view v-if="!category.base" @click.stop="() => handleClickDeleteCategory(category)">
            <wd-icon name="close-outline" size="40rpx" />
          </view>
        </view>
      </view>

      <view
        class="h-8 border-dashed border-2 border-indigo-600 flex justify-center items-center rounded-md"
        @click="handleClickAddCategory"
      >
        <wd-icon name="add" size="40rpx" />
      </view>
    </view>

    <wd-popup
      v-model="show"
      custom-style="border-radius:25rpx;height: 300rpx;width: 90%;"
      @close="handleClosePopup"
    >
      <view class="mt-2">
        <wd-input
          label="分类名称"
          label-width="70px"
          no-border
          size="large"
          type="text"
          v-model="categoryName"
          placeholder="请输入分类名称"
        />
      </view>
      <view class="w-full flex justify-between absolute bottom-2">
        <wd-button type="info" @click="handleClosePopup">取消</wd-button>
        <wd-button :loading="saveLoading" @click="handleClickSaveCategory">保存</wd-button>
      </view>
    </wd-popup>
  </view>
</template>

<script lang="ts" setup>
import { Category, createCategory, deleteCategory, updateCategory } from '@/service'
import { useMessage } from 'wot-design-uni'

const props = defineProps<{ type: number; categories: Category[] }>()
const emits = defineEmits<{
  (e: 'update:categories', values: Category[]): void
}>()

const message = useMessage()
const show = ref<boolean>(false)
const categoryName = ref<string>('')
const current = ref<Category>()
const saveLoading = ref<boolean>(false)

const filterCategories = computed(() => {
  // console.log('账单类型变更', props.type)
  return props.categories.filter((c) => c.type === props.type)
})

const handleClosePopup = () => {
  show.value = false
}

const handleClickAddCategory = () => {
  show.value = true
  categoryName.value = ''
  current.value = undefined
}

const handleClickEditCategory = (category) => {
  console.log(category)
  if (category.base === true) {
    uni.showToast({ icon: 'none', title: '预设分类无法编辑' })
    return
  }
  show.value = true
  categoryName.value = category.name
  current.value = category
}

const handleClickDeleteCategory = (category) => {
  message
    .confirm({
      msg: `是否删除 ${category.name} ?`,
      title: '提示',
    })
    .then(() => {
      deleteCategory(category._id)
        .then((res) => {
          const categories = [...props.categories]
          const filters = categories.filter((c) => c._id !== res._id)
          emits('update:categories', filters)
        })
        .catch((e) => {
          console.log(e)
        })
    })
}

const handleClickSaveCategory = () => {
  if (!categoryName.value || categoryName.value.length < 1) {
    uni.showToast({
      title: '分类名称不能为空',
      icon: 'none',
    })
    return
  }

  if (categoryName.value.length > 4) {
    uni.showToast({
      title: '分类名称不能超过四个字',
      icon: 'none',
    })
    return
  }

  saveLoading.value = true
  try {
    if (current.value) {
      updateCategory({ _id: current.value._id, name: categoryName.value })
        .then((res) => {
          const categories = [...props.categories]
          const filters = categories.filter((c) => c._id === current.value._id)
          filters[0].name = res.name
          emits('update:categories', categories)
          show.value = false
        })
        .catch((e) => {
          console.log(e)
        })
    } else {
      createCategory({ type: props.type, name: categoryName.value })
        .then((res) => {
          const categories = [...props.categories]
          categories.push(res)
          emits('update:categories', categories)
          show.value = false
        })
        .catch((e) => {
          console.log(e)
        })
    }
  } catch (error) {
    console.log(error)
  } finally {
    saveLoading.value = false
  }
}
</script>
