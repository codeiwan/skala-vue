<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { weatherList } from '@/data/weatherData'

const route = useRoute()
const router = useRouter()

const city = ref(null)

onMounted(() => {
  const cityId = route.params.cityId

  city.value = weatherList.find((item) => item.id === cityId)

  console.log(`[WeatherDetailView] 전달받은 cityId: ${cityId}`)

  console.log('[WeatherDetailView] 선택된 도시:', city.value)
})

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="detail-page">
    <main class="detail-container">
      <template v-if="city">
        <header class="detail-header">
          <div>
            <p class="eyebrow">WEATHER DETAIL</p>

            <p class="region">
              {{ city.region }}
            </p>

            <h1>
              {{ city.name }}
            </h1>

            <p class="detail-description">
              {{ city.name }} 지역의 상세 기상관측 정보와 Activity Insight를 확인합니다.
            </p>
          </div>

          <span class="weather-badge">
            {{ city.status }}
          </span>
        </header>

        <section class="temperature-card">
          <div>
            <p class="metric-label">CURRENT TEMPERATURE</p>

            <p class="detail-temperature">{{ city.temp }}℃</p>
          </div>

          <div class="temperature-condition">
            <span v-if="city.temp >= 25"> 🔥 25℃ 이상의 더운 날씨 </span>

            <span v-else> ❄️ 25℃ 미만의 선선한 날씨 </span>
          </div>
        </section>

        <section class="detail-grid">
          <article class="detail-card">
            <p class="card-label">HUMIDITY</p>

            <strong> {{ city.humidity }}% </strong>

            <p>현재 지역의 상대 습도입니다.</p>
          </article>

          <article class="detail-card">
            <p class="card-label">RAIN PROBABILITY</p>

            <strong> {{ city.rainProbability }}% </strong>

            <p>외출 전 강수 가능성을 확인하세요.</p>
          </article>

          <article class="detail-card">
            <p class="card-label">ACTIVITY SCORE</p>

            <strong> {{ city.activityScore }} / 100 </strong>

            <p>
              {{ city.activity }}
            </p>
          </article>
        </section>

        <section class="insight-section">
          <p class="section-label">ACTIVITY INSIGHT</p>

          <h2>오늘의 활동 가이드</h2>

          <div class="insight-detail">
            <div class="insight-row">
              <span>추천 활동</span>
              <strong>{{ city.recommendation }}</strong>
            </div>

            <div class="insight-row">
              <span>주의 사항</span>
              <strong>{{ city.caution }}</strong>
            </div>
          </div>
        </section>

        <div class="detail-actions">
          <button class="secondary-button" @click="goBack">이전 화면</button>

          <button class="primary-button" @click="goHome">메인 대시보드</button>
        </div>
      </template>

      <section v-else class="city-not-found">
        <p class="eyebrow">WEATHER DETAIL</p>

        <h1>도시 정보를 찾을 수 없습니다.</h1>

        <p>요청한 도시 코드와 일치하는 Mock Data가 없습니다.</p>

        <button class="primary-button" @click="goHome">메인 대시보드로 돌아가기</button>
      </section>
    </main>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;

  padding: 48px 24px;

  background-color: #f4f7fb;

  color: #1f2937;
}

.detail-container {
  width: 100%;
  max-width: 1100px;

  margin: 0 auto;
}

.detail-header {
  display: flex;

  align-items: flex-start;
  justify-content: space-between;

  gap: 24px;

  padding: 32px;

  background-color: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 18px;
}

.eyebrow {
  margin: 0 0 12px;

  color: #2563eb;

  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
}

.region {
  margin: 0 0 4px;

  color: #6b7280;
}

.detail-header h1 {
  margin: 0;

  font-size: 42px;
}

.detail-description {
  margin: 12px 0 0;

  color: #6b7280;

  line-height: 1.6;
}

.weather-badge {
  flex-shrink: 0;

  padding: 8px 14px;

  background-color: #f3f4f6;

  border-radius: 999px;

  font-weight: 700;
}

.temperature-card {
  display: flex;

  align-items: flex-end;
  justify-content: space-between;

  gap: 24px;

  padding: 32px;
  margin-top: 20px;

  background-color: #0f172a;

  border-radius: 18px;

  color: #ffffff;
}

.metric-label,
.card-label,
.section-label {
  margin: 0;

  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.4px;

  color: #94a3b8;
}

.detail-temperature {
  margin: 8px 0 0;

  font-size: 64px;
  font-weight: 700;
}

.temperature-condition {
  font-weight: 700;
}

.detail-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 20px;

  margin-top: 20px;
}

.detail-card {
  padding: 24px;

  background-color: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.detail-card strong {
  display: block;

  margin-top: 12px;

  font-size: 28px;
}

.detail-card p:last-child {
  margin: 10px 0 0;

  color: #6b7280;

  line-height: 1.5;
}

.insight-section {
  padding: 28px;
  margin-top: 20px;

  background-color: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 18px;
}

.insight-section h2 {
  margin: 8px 0 20px;
}

.insight-detail {
  background-color: #f8fafc;

  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.insight-row {
  display: grid;

  grid-template-columns: 120px minmax(0, 1fr);

  gap: 20px;

  padding: 16px;
}

.insight-row + .insight-row {
  border-top: 1px solid #e5e7eb;
}

.insight-row span {
  color: #6b7280;
}

.detail-actions {
  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 24px;
}

.primary-button,
.secondary-button {
  padding: 12px 18px;

  border-radius: 8px;

  font-weight: 700;

  cursor: pointer;
}

.primary-button {
  border: none;

  background-color: #2563eb;
  color: #ffffff;
}

.secondary-button {
  border: 1px solid #d1d5db;

  background-color: #ffffff;
  color: #374151;
}

.city-not-found {
  padding: 48px;

  background-color: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 18px;

  text-align: center;
}

.city-not-found h1 {
  margin: 0 0 12px;
}

.city-not-found p {
  color: #6b7280;
}

.city-not-found .primary-button {
  margin-top: 16px;
}

@media (max-width: 760px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .temperature-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .detail-header {
    flex-direction: column;
  }
}
</style>
