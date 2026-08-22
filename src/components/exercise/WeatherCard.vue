<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])
const configStore = useConfigStore()

function convertTemperature(celsius) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32)
  }

  return celsius
}

const displayTemp = computed(() => {
  return convertTemperature(props.city.temp)
})

const displayFeelsLike = computed(() => {
  return convertTemperature(props.city.feelsLike)
})

const isRecommended = computed(() => {
  return props.city.activityScore >= configStore.activityScoreThreshold
})

const activityProgressStatus = computed(() => {
  if (props.city.activityScore >= 80) return 'success'
  if (props.city.activityScore >= 60) return 'warning'
  return 'exception'
})

const handleSelectCard = () => {
  emit('select-card', props.city)
}

const handleClickDetail = () => {
  emit('click-detail', props.city)
}
</script>

<template>
  <el-card class="weather-card" shadow="hover" @click="handleSelectCard">
    <div class="card-header">
      <div>
        <div class="region-row">
          <span class="region">{{ city.region }}</span>

          <el-tag
            :type="city.source === 'live' ? 'success' : 'warning'"
            size="small"
            effect="light"
            round
          >
            {{ city.isLoading ? 'LOADING' : city.source === 'live' ? 'LIVE' : 'MOCK' }}
          </el-tag>
        </div>

        <h2>{{ city.name }}</h2>
      </div>

      <el-tag type="info" effect="plain" round>
        {{ city.status }}
      </el-tag>
    </div>

    <section class="temperature-section">
      <span class="section-label">CURRENT TEMPERATURE</span>

      <div class="temperature-row">
        <p class="temperature">{{ displayTemp }}{{ configStore.unitSymbol }}</p>

        <el-tag v-if="city.temp >= 25" type="danger" effect="light"> 더운 날씨 </el-tag>

        <el-tag v-else type="primary" effect="light"> 선선한 날씨 </el-tag>
      </div>
    </section>

    <section class="weather-info">
      <div class="info-item">
        <span>체감온도</span>
        <strong>{{ displayFeelsLike }}{{ configStore.unitSymbol }}</strong>
      </div>

      <div class="info-item">
        <span>습도</span>
        <strong>{{ city.humidity }}%</strong>
      </div>

      <div class="info-item">
        <span>풍속</span>
        <strong>{{ city.windSpeed }} m/s</strong>
      </div>
    </section>

    <section class="activity-section">
      <div class="activity-heading">
        <div>
          <span class="section-label">ACTIVITY SCORE</span>
          <strong>{{ city.activityScore }} / 100</strong>
        </div>

        <el-tag :type="isRecommended ? 'success' : 'danger'" effect="plain">
          {{ isRecommended ? '추천' : '기준 미달' }}
        </el-tag>
      </div>

      <el-progress
        :percentage="city.activityScore"
        :stroke-width="10"
        :show-text="false"
        :status="activityProgressStatus"
      />

      <div class="threshold-row">
        <span>내 활동 추천 기준</span>
        <strong>{{ configStore.activityScoreThreshold }}점</strong>
      </div>

      <p class="activity-judgement">{{ city.activity }}</p>

      <div class="insight-box">
        <div class="insight-row">
          <span>추천</span>
          <strong>{{ city.recommendation }}</strong>
        </div>

        <div class="insight-row">
          <span>주의</span>
          <strong>{{ city.caution }}</strong>
        </div>
      </div>
    </section>

    <el-alert
      v-if="city.apiError"
      title="실시간 API 조회에 실패하여 기본 데이터를 표시하고 있어요."
      type="warning"
      :closable="false"
      show-icon
      class="api-alert"
    />

    <div class="recommendation-state">
      <span :class="['recommendation-text', isRecommended ? 'recommended' : 'not-recommended']">
        {{ isRecommended ? '현재 기준의 추천 도시' : '현재 활동 추천 기준 미달' }}
      </span>
    </div>

    <el-button type="primary" size="large" class="detail-button" @click.stop="handleClickDetail">
      상세 날씨 보기 →
    </el-button>
  </el-card>
</template>

<style scoped>
.weather-card {
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-medium);
  cursor: pointer;
}

:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 23px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.region-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.region {
  color: var(--color-text-secondary);
  font-size: 12px;
}

.card-header h2 {
  margin: 6px 0 0;
  color: var(--color-primary-deep);
  font-size: 27px;
  letter-spacing: -0.7px;
}

.section-label {
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.1px;
}

.temperature-section {
  margin-top: 26px;
  padding: 20px 0;
  border-top: 1px solid var(--color-border-soft);
  border-bottom: 1px solid var(--color-border-soft);
}

.temperature-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-top: 5px;
}

.temperature {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: 44px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -1.5px;
}

.weather-info {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 18px 0;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 2px 12px;
  border-right: 1px solid var(--color-border-soft);
}

.info-item:first-child {
  padding-left: 0;
}
.info-item:last-child {
  padding-right: 0;
  border-right: none;
}

.info-item span {
  color: var(--color-text-muted);
  font-size: 10px;
}

.info-item strong {
  color: var(--color-text);
  font-size: 14px;
}

.activity-section {
  display: flex;
  flex-direction: column;
  gap: 13px;
  padding-top: 18px;
  border-top: 1px solid var(--color-border-soft);
}

.activity-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.activity-heading > div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.activity-heading strong {
  color: var(--color-primary-deep);
  font-size: 18px;
}

.threshold-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 11px;
  border-radius: 8px;
  background: var(--color-primary-softer);
}

.threshold-row span {
  color: var(--color-text-secondary);
  font-size: 11px;
}

.threshold-row strong {
  color: var(--color-primary);
  font-size: 12px;
}

.activity-judgement {
  margin: 0;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 800;
}

.insight-box {
  padding: 14px;
  border-radius: 10px;
  background: var(--color-surface-soft);
}

.insight-row {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr);
  gap: 10px;
}

.insight-row + .insight-row {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--color-border-soft);
}

.insight-row span {
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 700;
}

.insight-row strong {
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.55;
  word-break: keep-all;
}

.api-alert {
  margin-top: 16px;
}

.recommendation-state {
  margin-top: auto;
  padding-top: 17px;
}

.recommendation-text {
  font-size: 11px;
  font-weight: 800;
}

.recommended {
  color: var(--color-success);
}
.not-recommended {
  color: var(--color-warning);
}

.detail-button {
  width: 100%;
  margin-top: 12px;
  border-radius: 10px;
  font-weight: 800;
}

@media (max-width: 420px) {
  .weather-info {
    grid-template-columns: 1fr;
  }

  .info-item {
    padding: 8px 0;
    border-right: none;
    border-bottom: 1px solid var(--color-border-soft);
  }

  .info-item:last-child {
    border-bottom: none;
  }
}
</style>
