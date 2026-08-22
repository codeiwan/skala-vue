import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')
  const activityScoreThreshold = ref(70)
  const hikingScoreThreshold = ref(70)

  const unitSymbol = computed(() => {
    if (unit.value === 'fahrenheit') return '℉'
    return '℃'
  })

  const activityThresholdLabel = computed(() => `${activityScoreThreshold.value}점 이상`)
  const hikingThresholdLabel = computed(() => `${hikingScoreThreshold.value}점 이상`)

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

  function setHikingScoreThreshold(score) {
    hikingScoreThreshold.value = score
  }

  return {
    unit,
    activityScoreThreshold,
    hikingScoreThreshold,
    unitSymbol,
    activityThresholdLabel,
    hikingThresholdLabel,
    toggleUnit,
    setActivityScoreThreshold,
    setHikingScoreThreshold,
  }
})
