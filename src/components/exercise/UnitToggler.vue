<script setup>
import { computed } from 'vue'

import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const isFahrenheit = computed(() => {
  return configStore.unit === 'fahrenheit'
})

const handleUnitChange = () => {
  configStore.toggleUnit()
}
</script>

<template>
  <div class="unit-control">
    <span class="unit-title"> 온도 단위 </span>

    <el-switch
      :model-value="isFahrenheit"
      inline-prompt
      active-text="℉"
      inactive-text="℃"
      @change="handleUnitChange"
    />
  </div>
</template>

<style scoped>
.unit-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.unit-title {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}
</style>
