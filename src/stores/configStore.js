import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')

  const activityScoreThreshold = ref(70)

  const unitSymbol = computed(() => {
    if (unit.value === 'fahrenheit') {
      return '℉'
    }
    return '℃'
  })

  const activityThresholdLabel = computed(() => {
    return `${activityScoreThreshold.value}점 이상`
  })

  function toggleUnit() {
    if (unit.value === 'celsius') {
      unit.value = 'fahrenheit'
      return
    }
    unit.value = 'celsius'
  }

  function setActivityScoreThreshold(score) {
    activityScoreThreshold.value = score
  }

  return {
    unit,
    activityScoreThreshold,

    unitSymbol,
    activityThresholdLabel,

    toggleUnit,
    setActivityScoreThreshold,
  }
})
