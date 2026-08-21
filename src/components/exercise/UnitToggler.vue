<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label"> 온도 단위 </span>

    <button class="unit-button" type="button" @click="configStore.toggleUnit">
      <span :class="['unit-option', { active: configStore.unit === 'celsius' }]"> ℃ </span>

      <span class="unit-divider"> / </span>

      <span :class="['unit-option', { active: configStore.unit === 'fahrenheit' }]"> ℉ </span>
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 8px;
}

.unit-label {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.unit-button {
  display: flex;
  align-items: center;
  gap: 5px;

  padding: 7px 10px;

  border: 1px solid #dbe4ee;
  border-radius: 8px;

  background-color: #ffffff;

  font: inherit;

  cursor: pointer;
}

.unit-button:hover {
  border-color: #93c5fd;
}

.unit-option {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 700;
}

.unit-option.active {
  color: #2563eb;
}

.unit-divider {
  color: #cbd5e1;
}
</style>
