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
        <p class="control-title">Activity Insight 추천 기준</p>

        <p class="control-description">
          활동 적합도가
          <strong>
            {{ configStore.activityThresholdLabel }}
          </strong>
          인 도시를 추천 대상으로 판단합니다.
        </p>
      </div>

      <el-tag type="success" effect="light" round size="large">
        추천 {{ recommendedCityCount }}개
      </el-tag>
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

      <strong> {{ configStore.activityScoreThreshold }} / 100 </strong>
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
  margin-bottom: 18px;
}

.control-title {
  margin: 0;
  font-weight: 700;
  color: #1f2937;
}

.control-description {
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.5;
}

.control-description strong {
  color: #2563eb;
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
  background: #f8fafc;
  border-radius: 9px;
}

.threshold-guide span {
  font-size: 13px;
  color: #64748b;
}

.threshold-guide strong {
  color: #2563eb;
}

@media (max-width: 600px) {
  .control-heading {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
