<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchAirPollution, getWeatherErrorMessage } from '@/services/weatherApi'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { createActivityInsight } from '@/utils/activityInsight'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const cityId = route.params.cityId
const airQuality = ref(null)
const isLoading = ref(false)
const airError = ref(null)

const city = computed(() => {
  return weatherStore.weatherList.find((item) => item.id === cityId)
})

function convertTemperature(celsius) {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32)
  }

  return celsius
}

const displayTemp = computed(() => {
  if (!city.value) {
    return null
  }

  return convertTemperature(city.value.temp)
})

const displayFeelsLike = computed(() => {
  if (!city.value) {
    return null
  }

  return convertTemperature(city.value.feelsLike)
})

const aqiLabel = computed(() => {
  const aqi = airQuality.value?.aqi

  if (aqi === 1) {
    return '좋음'
  }

  if (aqi === 2) {
    return '보통'
  }

  if (aqi === 3) {
    return '보통 이하'
  }

  if (aqi === 4) {
    return '나쁨'
  }

  if (aqi === 5) {
    return '매우 나쁨'
  }

  return '정보 없음'
})

const detailInsight = computed(() => {
  if (!city.value) {
    return null
  }

  return createActivityInsight(city.value, airQuality.value)
})

const loadDetailWeather = async () => {
  isLoading.value = true
  airError.value = null

  try {
    const updatedCity = await weatherStore.fetchCityWeather(cityId)

    if (updatedCity?.lat == null || updatedCity?.lon == null) {
      return
    }

    try {
      airQuality.value = await fetchAirPollution(updatedCity.lat, updatedCity.lon)
    } catch (error) {
      airError.value = getWeatherErrorMessage(error)

      console.error('[Air Pollution API] 조회 실패:', error)
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(loadDetailWeather)

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

            <div class="title-row">
              <div>
                <p class="region">
                  {{ city.region }}
                </p>

                <h1>
                  {{ city.name }}
                </h1>
              </div>

              <span :class="['source-badge', city.source === 'live' ? 'live' : 'mock']">
                {{ city.source === 'live' ? 'LIVE DATA' : 'MOCK FALLBACK' }}
              </span>
            </div>

            <p class="detail-description">
              OpenWeatherMap의 현재 날씨와 대기질 데이터를 기반으로 한 상세 기상 정보입니다.
            </p>
          </div>

          <span class="weather-badge">
            {{ city.status }}
          </span>
        </header>

        <section class="temperature-card">
          <div>
            <p class="metric-label">CURRENT TEMPERATURE</p>

            <p class="detail-temperature">{{ displayTemp }}{{ configStore.unitSymbol }}</p>

            <p class="feels-like">
              체감
              {{ displayFeelsLike }}{{ configStore.unitSymbol }}
            </p>
          </div>

          <div class="temperature-condition">
            <span v-if="city.temp >= 25"> 🔥 원본 섭씨 기준 더운 날씨 </span>

            <span v-else> ❄️ 원본 섭씨 기준 선선한 날씨 </span>
          </div>
        </section>

        <section class="detail-grid">
          <article class="detail-card">
            <p class="card-label">HUMIDITY</p>

            <strong> {{ city.humidity }}% </strong>

            <p>현재 상대 습도</p>
          </article>

          <article class="detail-card">
            <p class="card-label">WIND</p>

            <strong>
              {{ city.windSpeed }}
              m/s
            </strong>

            <p>현재 관측 풍속</p>
          </article>

          <article class="detail-card">
            <p class="card-label">PRESSURE</p>

            <strong>
              {{ city.pressure }}
              hPa
            </strong>

            <p>현재 기압</p>
          </article>

          <article class="detail-card">
            <p class="card-label">CLOUDS</p>

            <strong> {{ city.cloudiness }}% </strong>

            <p>현재 운량</p>
          </article>

          <article class="detail-card">
            <p class="card-label">VISIBILITY</p>

            <strong>
              {{ city.visibility ? (city.visibility / 1000).toFixed(1) : '-' }}
              km
            </strong>

            <p>현재 가시거리</p>
          </article>

          <article class="detail-card">
            <p class="card-label">ACTIVITY SCORE</p>

            <strong>
              {{ detailInsight?.activityScore }}
              / 100
            </strong>

            <p>
              {{ detailInsight?.activity }}
            </p>
          </article>
        </section>

        <!-- OpenWeatherMap 추가 API -->
        <section class="air-section">
          <div class="section-heading">
            <div>
              <p class="section-label">OPENWEATHER AIR POLLUTION</p>

              <h2>현재 대기질</h2>
            </div>

            <span class="aqi-badge">
              AQI
              {{ airQuality?.aqi ?? '-' }}
              ·
              {{ aqiLabel }}
            </span>
          </div>

          <div v-if="airQuality" class="air-grid">
            <div class="air-item">
              <span> PM2.5 </span>

              <strong>
                {{ airQuality.pm25 }}
              </strong>

              <small> μg/m³ </small>
            </div>

            <div class="air-item">
              <span> PM10 </span>

              <strong>
                {{ airQuality.pm10 }}
              </strong>

              <small> μg/m³ </small>
            </div>

            <div class="air-item">
              <span> NO₂ </span>

              <strong>
                {{ airQuality.no2 }}
              </strong>

              <small> μg/m³ </small>
            </div>

            <div class="air-item">
              <span> O₃ </span>

              <strong>
                {{ airQuality.o3 }}
              </strong>

              <small> μg/m³ </small>
            </div>
          </div>

          <p v-else-if="airError" class="air-error">
            대기질 데이터를 가져오지 못했습니다.
            {{ airError }}
          </p>

          <p v-else class="air-loading">
            {{ isLoading ? '대기질 데이터 로딩 중...' : '대기질 정보가 없습니다.' }}
          </p>
        </section>

        <section class="insight-section">
          <p class="section-label">ACTIVITY INSIGHT</p>

          <h2>실시간 활동 가이드</h2>

          <div v-if="detailInsight" class="insight-detail">
            <div class="insight-row">
              <span> 현재 판단 </span>

              <strong>
                {{ detailInsight.activity }}
              </strong>
            </div>

            <div class="insight-row">
              <span> 추천 활동 </span>

              <strong>
                {{ detailInsight.recommendation }}
              </strong>
            </div>

            <div class="insight-row">
              <span> 주의 사항 </span>

              <strong>
                {{ detailInsight.caution }}
              </strong>
            </div>
          </div>
        </section>

        <div class="detail-actions">
          <button class="secondary-button" @click="goBack">이전 화면</button>

          <button class="primary-button" @click="goHome">메인 대시보드</button>
        </div>
      </template>

      <section v-else class="city-not-found">
        <h1>도시 정보를 찾을 수 없습니다.</h1>

        <button class="primary-button" @click="goHome">메인으로 돌아가기</button>
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

.eyebrow,
.metric-label,
.card-label,
.section-label {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.4px;
}

.eyebrow {
  margin-bottom: 14px;
  color: #2563eb;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.region {
  margin: 0 0 4px;
  color: #6b7280;
}

.detail-header h1 {
  margin: 0;
  font-size: 42px;
}

.source-badge {
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
}

.source-badge.live {
  background-color: #dcfce7;
  color: #15803d;
}

.source-badge.mock {
  background-color: #fef3c7;
  color: #a16207;
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

.detail-temperature {
  margin: 8px 0 0;
  font-size: 64px;
  font-weight: 700;
}

.feels-like {
  margin: 8px 0 0;
  color: #cbd5e1;
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
}

.air-section,
.insight-section {
  padding: 28px;
  margin-top: 20px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.section-heading h2,
.insight-section h2 {
  margin: 8px 0 0;
}

.aqi-badge {
  padding: 8px 12px;
  background-color: #eff6ff;
  border-radius: 999px;
  color: #1d4ed8;
  font-weight: 700;
}

.air-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 22px;
}

.air-item {
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 10px;
}

.air-item span {
  display: block;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.air-item strong {
  display: inline-block;
  margin-top: 8px;
  font-size: 24px;
}

.air-item small {
  margin-left: 4px;
  color: #94a3b8;
}

.air-error {
  color: #dc2626;
}

.air-loading {
  color: #64748b;
}

.insight-detail {
  margin-top: 20px;
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
  border-radius: 18px;
  text-align: center;
}

@media (max-width: 760px) {
  .detail-header,
  .temperature-card {
    align-items: flex-start;
    flex-direction: column;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .air-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
