import { HomeBillReport, HomeBillStore, HomeBillSummary } from '@/service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const initState: HomeBillStore = {
  summary: {
    expend: 0,
    income: 0,
    oilQuantity: 0,
    oilCost: 0,
    outputValue: 0,
  },
  reports: [],
}

export const useHomeStore = defineStore(
  'home',
  () => {
    const homeState = ref<HomeBillStore>({ ...initState })

    const setSummary = (summary: HomeBillSummary) => {
      homeState.value.summary = summary
    }

    const setReports = (reports: HomeBillReport[]) => {
      homeState.value.reports = [...reports]
    }

    return {
      homeState,
      setSummary,
      setReports,
    }
  },
  {
    persist: true,
  },
)
