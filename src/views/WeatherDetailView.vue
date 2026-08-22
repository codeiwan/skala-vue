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
  if (!city.value) return null
  return convertTemperature(city.value.temp)
})

const displayFeelsLike = computed(() => {
  if (!city.value) return null
  return convertTemperature(city.value.feelsLike)
})

const aqiLabel = computed(() => {
  const aqi = airQuality.value?.aqi

  if (aqi === 1) return '좋음'
  if (aqi === 2) return '보통'
  if (aqi === 3) return '보통 이하'
  if (aqi === 4) return '나쁨'
  if (aqi === 5) return '매우 나쁨'

  return '정보 없음'
})

const aqiType = computed(() => {
  const aqi = airQuality.value?.aqi

  if (!aqi) return 'info'
  if (aqi <= 2) return 'success'
  if (aqi === 3) return 'warning'

  return 'danger'
})

const detailInsight = computed(() => {
  if (!city.value) return null
  return createActivityInsight(city.value, airQuality.value)
})

const loadDetailWeather = async () => {
  isLoading.value = true
  airError.value = null

  try {
    const updatedCity = await weatherStore.fetchCityWeather(cityId)

    if (updatedCity?.lat == null || updatedCity?.lon == null) return

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

const goWeatherHome = () => {
  router.push({ name: 'WeatherHome' })
}
</script>

<template>
  <div
    v-loading="isLoading"
    element-loading-text="상세 날씨와 대기질을 불러오는 중입니다..."
    class="detail-page"
  >
    <main class="detail-container">
      <template v-if="city">
        <el-page-header
          title="날씨 대시보드"
          content="날씨 상세 정보"
          class="page-header"
          @back="goBack"
        />

        <section class="weather-hero">
          <div>
            <p class="eyebrow">WEATHER DETAIL</p>
            <p class="region">{{ city.region }}</p>

            <div class="city-heading">
              <h1>{{ city.name }}</h1>

              <el-tag :type="city.source === 'live' ? 'success' : 'warning'" effect="dark" round>
                {{ city.source === 'live' ? 'LIVE DATA' : 'MOCK FALLBACK' }}
              </el-tag>
            </div>

            <p class="detail-description">
              현재 날씨와 대기질, 야외활동 환경을 한 화면에서 확인해 보세요.
            </p>
          </div>

          <div class="hero-weather">
            <span>CURRENT</span>
            <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
            <small>체감 {{ displayFeelsLike }}{{ configStore.unitSymbol }}</small>

            <el-tag type="info" effect="plain" round>
              {{ city.status }}
            </el-tag>
          </div>
        </section>

        <div class="detail-grid">
          <el-card shadow="never" class="section-card">
            <template #header>
              <div class="section-header">
                <div>
                  <span class="section-label">CURRENT CONDITIONS</span>
                  <strong>현재 기상 관측</strong>
                </div>

                <el-tag type="success" effect="plain"> OpenWeatherMap </el-tag>
              </div>
            </template>

            <el-descriptions :column="2" border direction="vertical">
              <el-descriptions-item label="습도"> {{ city.humidity }}% </el-descriptions-item>

              <el-descriptions-item label="풍속"> {{ city.windSpeed }} m/s </el-descriptions-item>

              <el-descriptions-item label="기압"> {{ city.pressure }} hPa </el-descriptions-item>

              <el-descriptions-item label="운량"> {{ city.cloudiness }}% </el-descriptions-item>

              <el-descriptions-item label="가시거리">
                {{ city.visibility ? `${(city.visibility / 1000).toFixed(1)} km` : '정보 없음' }}
              </el-descriptions-item>

              <el-descriptions-item label="날씨 상태">
                {{ city.status }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card shadow="never" class="section-card">
            <template #header>
              <div class="section-header">
                <div>
                  <span class="section-label">AIR QUALITY</span>
                  <strong>현재 대기질</strong>
                </div>

                <el-tag :type="aqiType" effect="light" round>
                  AQI {{ airQuality?.aqi ?? '-' }} · {{ aqiLabel }}
                </el-tag>
              </div>
            </template>

            <div v-if="airQuality" class="air-grid">
              <div class="statistic-box">
                <el-statistic title="PM2.5" :value="airQuality.pm25" :precision="1" />
                <span>μg/m³</span>
              </div>

              <div class="statistic-box">
                <el-statistic title="PM10" :value="airQuality.pm10" :precision="1" />
                <span>μg/m³</span>
              </div>

              <div class="statistic-box">
                <el-statistic title="NO₂" :value="airQuality.no2" :precision="1" />
                <span>μg/m³</span>
              </div>

              <div class="statistic-box">
                <el-statistic title="O₃" :value="airQuality.o3" :precision="1" />
                <span>μg/m³</span>
              </div>
            </div>

            <el-alert
              v-else-if="airError"
              :title="airError"
              type="warning"
              :closable="false"
              show-icon
            />

            <el-empty v-else description="대기질 정보가 없습니다." />
          </el-card>
        </div>

        <el-card v-if="detailInsight" shadow="never" class="insight-card">
          <div class="insight-layout">
            <div class="insight-score">
              <span>ACTIVITY SCORE</span>
              <strong>{{ detailInsight.activityScore }}</strong>
              <small>/ 100</small>
            </div>

            <div class="insight-content">
              <div class="section-header">
                <div>
                  <span class="section-label">ACTIVITY INSIGHT</span>
                  <strong>{{ detailInsight.activity }}</strong>
                </div>

                <el-tag
                  :type="
                    detailInsight.activityScore >= configStore.activityScoreThreshold
                      ? 'success'
                      : 'danger'
                  "
                >
                  {{
                    detailInsight.activityScore >= configStore.activityScoreThreshold
                      ? '내 기준 충족'
                      : '내 기준 미달'
                  }}
                </el-tag>
              </div>

              <el-progress
                :percentage="detailInsight.activityScore"
                :stroke-width="12"
                :status="
                  detailInsight.activityScore >= 80
                    ? 'success'
                    : detailInsight.activityScore >= 60
                      ? 'warning'
                      : 'exception'
                "
              />

              <div class="insight-list">
                <div>
                  <span>추천 활동</span>
                  <p>{{ detailInsight.recommendation }}</p>
                </div>

                <div>
                  <span>주의 사항</span>
                  <p>{{ detailInsight.caution }}</p>
                </div>

                <div>
                  <span>내 추천 기준</span>
                  <p>{{ configStore.activityScoreThreshold }}점 이상</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <div class="detail-actions">
          <el-button size="large" @click="goBack"> 이전 화면 </el-button>

          <el-button type="primary" size="large" @click="goWeatherHome"> 날씨 대시보드 </el-button>
        </div>
      </template>

      <el-result
        v-else
        icon="warning"
        title="도시 정보를 찾을 수 없습니다."
        sub-title="요청한 도시 코드와 일치하는 날씨 데이터가 없습니다."
      >
        <template #extra>
          <el-button type="primary" @click="goWeatherHome"> 날씨 대시보드 </el-button>
        </template>
      </el-result>
    </main>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 40px 24px 70px;
  background: var(--color-background);
  color: var(--color-text);
}

.detail-container {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.weather-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 38px;
  margin-bottom: 20px;
  padding: 40px 44px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-large);
  background: linear-gradient(135deg, #f8faf6 0%, #e5eee7 100%);
}

.eyebrow,
.section-label {
  display: block;
  margin: 0 0 7px;
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.4px;
}

.region {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.city-heading {
  display: flex;
  align-items: center;
  gap: 14px;
}

.city-heading h1 {
  margin: 3px 0 0;
  color: var(--color-primary-deep);
  font-size: 48px;
  letter-spacing: -1.5px;
}

.detail-description {
  max-width: 620px;
  margin: 12px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.65;
}

.hero-weather {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  min-width: 175px;
}

.hero-weather > span {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.2px;
}

.hero-weather > strong {
  margin-top: 4px;
  color: var(--color-primary);
  font-size: 52px;
  line-height: 1;
}

.hero-weather > small {
  margin: 5px 0 12px;
  color: var(--color-text-secondary);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.section-card,
.insight-card {
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-card);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
}

.section-header strong {
  display: block;
  color: var(--color-text);
  font-size: 17px;
}

.air-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.statistic-box {
  padding: 17px;
  border-radius: 10px;
  background: var(--color-surface-soft);
}

.statistic-box > span {
  display: block;
  margin-top: 4px;
  color: var(--color-text-muted);
  font-size: 10px;
}

.insight-card {
  margin-top: 16px;
}

.insight-card :deep(.el-card__body) {
  padding: 30px 34px;
}

.insight-layout {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  align-items: center;
  gap: 34px;
}

.insight-score {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-right: 34px;
  border-right: 1px solid var(--color-border-soft);
}

.insight-score > span {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.2px;
}

.insight-score > strong {
  margin-top: 6px;
  color: var(--color-primary);
  font-size: 52px;
  line-height: 1;
}

.insight-score > small {
  color: var(--color-text-muted);
  font-size: 11px;
}

.insight-content .el-progress {
  margin-top: 18px;
}

.insight-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 20px;
  border-top: 1px solid var(--color-border-soft);
}

.insight-list > div {
  padding: 16px 15px 0 0;
}

.insight-list > div + div {
  padding-left: 15px;
  border-left: 1px solid var(--color-border-soft);
}

.insight-list span {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 800;
}

.insight-list p {
  margin: 5px 0 0;
  color: var(--color-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 20px;
}

.detail-actions .el-button {
  border-radius: 10px;
  font-weight: 700;
}

@media (max-width: 800px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .insight-layout {
    grid-template-columns: 1fr;
  }

  .insight-score {
    padding-right: 0;
    padding-bottom: 24px;
    border-right: none;
    border-bottom: 1px solid var(--color-border-soft);
  }
}

@media (max-width: 650px) {
  .detail-page {
    padding: 30px 16px 58px;
  }

  .weather-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 32px 25px;
  }

  .hero-weather {
    align-items: flex-start;
  }

  .city-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .city-heading h1 {
    font-size: 40px;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .air-grid,
  .insight-list {
    grid-template-columns: 1fr;
  }

  .insight-list > div + div {
    padding-left: 0;
    border-left: none;
  }

  .detail-actions {
    flex-direction: column;
  }

  .detail-actions .el-button {
    width: 100%;
    margin-left: 0;
  }
}
</style>
