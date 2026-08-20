<script setup>
defineProps({
  city: {
    type: Object,
    required: true,
  },

  minActivityScore: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['select-card', 'click-detail'])

const handleSelectCard = (city) => {
  emit('select-card', city)
}

const handleClickDetail = (city) => {
  emit('click-detail', city)
}
</script>

<template>
  <article class="weather-card" @click="handleSelectCard(city)">
    <div class="card-header">
      <div>
        <p class="region">{{ city.region }}</p>
        <h2>{{ city.name }}</h2>
      </div>

      <span class="weather-status">
        {{ city.status }}
      </span>
    </div>

    <section class="temperature-section">
      <p class="temperature">{{ city.temp }}℃</p>

      <p v-if="city.temp >= 25" class="temperature-label hot">🔥 더움 (25도 이상)</p>

      <p v-else class="temperature-label cool">❄️ 선선함 (25도 미만)</p>
    </section>

    <section class="basic-weather-info">
      <div class="info-item">
        <span>습도</span>
        <strong>{{ city.humidity }}%</strong>
      </div>

      <div class="info-item">
        <span>강수확률</span>
        <strong>{{ city.rainProbability }}%</strong>
      </div>
    </section>

    <section class="activity-info">
      <div class="activity-summary">
        <div class="info-item">
          <span>활동 적합도</span>
          <strong>{{ city.activityScore }} / 100</strong>
        </div>

        <div class="info-item">
          <span>판단</span>
          <strong>{{ city.activity }}</strong>
        </div>
      </div>

      <div class="insight-panel">
        <div class="insight-row">
          <span class="insight-label">추천</span>

          <strong class="insight-value">
            {{ city.recommendation }}
          </strong>
        </div>

        <div class="insight-row">
          <span class="insight-label">주의</span>

          <strong class="insight-value">
            {{ city.caution }}
          </strong>
        </div>
      </div>
    </section>

    <section class="recommendation-result">
      <p v-if="city.activityScore >= minActivityScore" class="recommendation-message recommended">
        👍 현재 기준의 추천 도시
      </p>

      <p v-else class="recommendation-message not-recommended">⚠️ 현재 활동 추천 기준 미달</p>
    </section>

    <button class="detail-button" @click.stop="handleClickDetail(city)">상세보기</button>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  flex-direction: column;

  min-width: 0;

  padding: 22px;

  box-sizing: border-box;

  background-color: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 16px;

  cursor: pointer;
}

.weather-card:hover {
  border-color: #93c5fd;
}

.card-header {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 12px;
}

.card-header h2 {
  margin: 3px 0 0;
  font-size: 24px;
}

.region {
  margin: 0;

  font-size: 13px;

  color: #6b7280;
}

.weather-status {
  flex-shrink: 0;

  padding: 6px 10px;

  background-color: #f3f4f6;

  border-radius: 999px;

  font-size: 13px;
}

.temperature-section {
  margin-top: 26px;
}

.temperature {
  margin: 0 0 12px;

  font-size: 42px;
  font-weight: 700;
}

.temperature-label {
  margin: 0;

  font-size: 14px;
  font-weight: 700;

  white-space: nowrap;
}

.hot {
  color: #dc2626;
}

.cool {
  color: #2563eb;
}

.basic-weather-info {
  padding: 16px 0;
  margin-top: 22px;

  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.info-item {
  display: grid;

  grid-template-columns: 86px minmax(0, 1fr);

  gap: 10px;

  align-items: start;

  margin: 7px 0;
}

.info-item span {
  color: #6b7280;

  white-space: nowrap;
}

.info-item strong {
  min-width: 0;

  text-align: right;

  line-height: 1.4;

  word-break: keep-all;
}

.activity-info {
  padding-top: 16px;
}

.activity-summary {
  padding-bottom: 14px;
}

.insight-panel {
  padding: 13px 14px;

  background-color: #f8fafc;

  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.insight-row {
  display: grid;

  grid-template-columns: 42px minmax(0, 1fr);

  gap: 10px;

  align-items: start;
}

.insight-row + .insight-row {
  margin-top: 10px;
  padding-top: 10px;

  border-top: 1px solid #e5e7eb;
}

.insight-label {
  color: #6b7280;

  white-space: nowrap;
}

.insight-value {
  min-width: 0;

  text-align: left;

  line-height: 1.4;

  word-break: keep-all;
}

.recommendation-result {
  margin-top: 14px;
}

.recommendation-message {
  margin: 0;

  font-size: 14px;
  font-weight: 700;

  white-space: nowrap;
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

  padding: 11px 14px;

  border: none;
  border-radius: 8px;

  background-color: #2563eb;
  color: #ffffff;

  font-weight: 700;

  cursor: pointer;
}

.recommendation-result + .detail-button {
  margin-top: 20px;
}

.detail-button:hover {
  background-color: #1d4ed8;
}
</style>
