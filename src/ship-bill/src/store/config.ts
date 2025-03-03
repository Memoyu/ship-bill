import { Config, ConfigStore } from '@/service'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const initState: ConfigStore = { commission: 0, oilPrices: 0 }

export const useConfigStore = defineStore(
  'config',
  () => {
    const configState = ref<ConfigStore>({ ...initState })

    const setConfig = (config: Config) => {
      configState.value.commission = config.commission
      configState.value.oilPrices = config.oilPrices
    }

    return {
      configState,
      setConfig,
    }
  },
  {
    persist: true,
  },
)
