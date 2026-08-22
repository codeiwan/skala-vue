<script setup>
import { useConfigStore } from '@/stores/configStore'

defineProps({
  recommendedCityCount: {
    type: Number,
    required: true,
  },
})

const configStore = useConfigStore()

const scoreOptions = [
  {
    label: '60점',
    value: 60,
  },
  {
    label: '70점',
    value: 70,
  },
  {
    label: '80점',
    value: 80,
  },
]

const handleScoreChange = (value) => {
  configStore.setActivityScoreThreshold(Number(value))
}
</script>

<template>
  <section class="activity-control">
    <div class="control-heading">
      <div>
        <p class="control-label">ACTIVITY PREFERENCE</p>
        <h3>활동 추천 기준</h3>

        <p class="control-description">
          활동 적합도가
          <strong>{{ configStore.activityThresholdLabel }}</strong>
          인 도시를 추천 대상으로 보고 있어요.
        </p>
      </div>

      <div class="recommended-count">
        <strong>{{ recommendedCityCount }}</strong>
        <span>추천 도시</span>
      </div>
    </div>

    <el-segmented
      :model-value="configStore.activityScoreThreshold"
      :options="scoreOptions"
      size="large"
      class="score-segmented"
      @change="handleScoreChange"
    />

    <div class="threshold-guide">
      <span>현재 추천 기준</span>
      <strong>{{ configStore.activityScoreThreshold }} / 100</strong>
    </div>
  </section>
</template>

<style scoped>
.activity-control {
  width: 100%;
}

.control-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.control-label {
  margin: 0 0 5px;
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.3px;
}

.control-heading h3 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: 18px;
}

.control-description {
  margin: 8px 0 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.control-description strong {
  color: var(--color-primary);
}

.recommended-count {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  flex-shrink: 0;
}

.recommended-count strong {
  color: var(--color-primary);
  font-size: 30px;
  line-height: 1;
}

.recommended-count span {
  margin-top: 3px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
}

.score-segmented {
  width: 100%;
}

.threshold-guide {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
  padding: 11px 14px;
  border-radius: 9px;
  background: var(--color-primary-softer);
}

.threshold-guide span {
  color: var(--color-text-secondary);
  font-size: 13px;
}

.threshold-guide strong {
  color: var(--color-primary);
}

@media (max-width: 600px) {
  .control-heading {
    flex-direction: column;
    gap: 12px;
  }

  .recommended-count {
    align-items: flex-start;
  }
}
</style>
