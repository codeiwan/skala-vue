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
  if (props.city.activityScore >= 80) {
    return 'success'
  }

  if (props.city.activityScore >= 60) {
    return 'warning'
  }

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
          <span class="region">
            {{ city.region }}
          </span>

          <el-tag
            :type="city.source === 'live' ? 'success' : 'warning'"
            size="small"
            effect="light"
            round
          >
            {{ city.isLoading ? 'LOADING' : city.source === 'live' ? 'LIVE' : 'MOCK' }}
          </el-tag>
        </div>

        <h2>
          {{ city.name }}
        </h2>
      </div>

      <el-tag type="info" effect="plain" round>
        {{ city.status }}
      </el-tag>
    </div>

    <section class="temperature-section">
      <p class="temperature">{{ displayTemp }}{{ configStore.unitSymbol }}</p>

      <el-tag v-if="city.temp >= 25" type="danger" effect="light"> 🔥 더움 (25℃ 이상) </el-tag>

      <el-tag v-else type="primary" effect="light"> ❄️ 선선함 (25℃ 미만) </el-tag>
    </section>

    <el-divider />

    <section class="weather-info">
      <div class="info-item">
        <span>체감온도</span>

        <strong> {{ displayFeelsLike }}{{ configStore.unitSymbol }} </strong>
      </div>

      <div class="info-item">
        <span>습도</span>

        <strong> {{ city.humidity }}% </strong>
      </div>

      <div class="info-item">
        <span>풍속</span>

        <strong> {{ city.windSpeed }} m/s </strong>
      </div>
    </section>

    <el-divider />

    <section class="activity-section">
      <div class="activity-heading">
        <div>
          <span class="section-label"> ACTIVITY SCORE </span>

          <strong> {{ city.activityScore }} / 100 </strong>
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
        <span> 현재 추천 기준 </span>

        <strong> {{ configStore.activityScoreThreshold }}점 </strong>
      </div>

      <p class="activity-judgement">
        {{ city.activity }}
      </p>

      <div class="insight-box">
        <div class="insight-row">
          <span> 추천 </span>

          <strong>
            {{ city.recommendation }}
          </strong>
        </div>

        <div class="insight-row">
          <span> 주의 </span>

          <strong>
            {{ city.caution }}
          </strong>
        </div>
      </div>
    </section>

    <el-alert
      v-if="city.apiError"
      title="실시간 API 조회에 실패하여 Mock Data를 표시하고 있습니다."
      type="warning"
      :closable="false"
      show-icon
      class="api-alert"
    />

    <div class="recommendation-state">
      <span :class="['recommendation-text', isRecommended ? 'recommended' : 'not-recommended']">
        {{ isRecommended ? '👍 현재 기준의 추천 도시' : '⚠️ 현재 활동 추천 기준 미달' }}
      </span>
    </div>

    <el-button type="primary" size="large" class="detail-button" @click.stop="handleClickDetail">
      상세 날씨 보기
    </el-button>
  </el-card>
</template>

<style scoped>
.weather-card {
  height: 100%;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.18s ease;
}

.weather-card:hover {
  transform: translateY(-2px);
}

:deep(.el-card__body) {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 22px;
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
  font-size: 13px;
  color: #64748b;
}

.card-header h2 {
  margin: 7px 0 0;
  font-size: 26px;
  color: #1f2937;
}

.temperature-section {
  margin-top: 28px;
}

.temperature {
  margin: 0 0 14px;
  font-size: 44px;
  font-weight: 750;
  letter-spacing: -1px;
  color: #111827;
}

:deep(.el-divider--horizontal) {
  margin: 20px 0;
}

.weather-info {
  display: grid;
  gap: 10px;
}

.info-item {
  display: grid;
  grid-template-columns: 90px minmax(0, 1fr);
  gap: 12px;
}

.info-item span {
  color: #64748b;
}

.info-item strong {
  text-align: right;
  color: #1f2937;
}

.activity-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.activity-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.activity-heading > div {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.section-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #94a3b8;
}

.threshold-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 11px;
  background: #f8fafc;
  border-radius: 8px;
}

.threshold-row span {
  font-size: 12px;
  color: #64748b;
}

.threshold-row strong {
  color: #2563eb;
}

.activity-judgement {
  margin: 0;
  font-weight: 700;
  color: #334155;
}

.insight-box {
  padding: 14px;
  background: #f8fafc;
  border-radius: 10px;
}

.insight-row {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr);
  gap: 10px;
}

.insight-row + .insight-row {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
}

.insight-row span {
  color: #64748b;
}

.insight-row strong {
  line-height: 1.45;
  word-break: keep-all;
}

.api-alert {
  margin-top: 16px;
}

.recommendation-state {
  margin: 16px 0;
}

.recommendation-text {
  font-size: 14px;
  font-weight: 700;
}

.recommended {
  color: #2563eb;
}

.not-recommended {
  color: #dc2626;
}

.detail-button {
  width: 100%;
  margin-top: auto;
}
</style>
