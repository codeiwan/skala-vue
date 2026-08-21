<script setup>
import { useConfigStore } from '@/stores/configStore'

defineProps({
  recommendedCityCount: {
    type: Number,
    required: true,
  },
})

const configStore = useConfigStore()
</script>

<template>
  <section class="activity-score-control">
    <div>
      <p class="control-label">Activity Insight 추천 기준</p>

      <p class="control-description">
        활동 적합도
        <strong>
          {{ configStore.activityThresholdLabel }}
        </strong>
        인 도시를 추천 도시로 판단합니다.
      </p>
    </div>

    <div class="score-buttons">
      <button
        :class="[
          'score-button',
          {
            active: configStore.activityScoreThreshold === 60,
          },
        ]"
        @click="configStore.setActivityScoreThreshold(60)"
      >
        60점
      </button>

      <button
        :class="[
          'score-button',
          {
            active: configStore.activityScoreThreshold === 70,
          },
        ]"
        @click="configStore.setActivityScoreThreshold(70)"
      >
        70점
      </button>

      <button
        :class="[
          'score-button',
          {
            active: configStore.activityScoreThreshold === 80,
          },
        ]"
        @click="configStore.setActivityScoreThreshold(80)"
      >
        80점
      </button>
    </div>

    <p class="result-text">
      현재 기준을 만족하는 추천 도시:
      <strong> {{ recommendedCityCount }}개 </strong>
    </p>
  </section>
</template>

<style scoped>
.activity-score-control {
  width: 100%;
}

.control-label {
  margin: 0;

  font-weight: 700;
}

.control-description {
  margin: 10px 0 0;

  color: #4b5563;
}

.score-buttons {
  display: flex;

  gap: 8px;

  margin-top: 16px;
}

.score-button {
  padding: 9px 16px;

  border: 1px solid #bfdbfe;
  border-radius: 8px;

  background-color: #eff6ff;
  color: #1d4ed8;

  font-weight: 700;

  cursor: pointer;
}

.score-button:hover {
  background-color: #dbeafe;
}

.score-button.active {
  border-color: #2563eb;

  background-color: #2563eb;
  color: #ffffff;
}

.result-text {
  margin: 14px 0 0;

  color: #4b5563;
}
</style>
