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
  <div
    v-loading="isLoading"
    element-loading-text="상세 날씨와 대기질을 불러오는 중입니다..."
    class="detail-page"
  >
    <main class="detail-container">
      <template v-if="city">
        <el-page-header content="날씨 상세 정보" class="page-header" @back="goBack" />

        <el-card shadow="never" class="hero-card">
          <div class="detail-header">
            <div>
              <p class="eyebrow">WEATHER DETAIL</p>

              <div class="city-heading">
                <div>
                  <p class="region">
                    {{ city.region }}
                  </p>

                  <h1>
                    {{ city.name }}
                  </h1>
                </div>

                <el-tag :type="city.source === 'live' ? 'success' : 'warning'" effect="dark" round>
                  {{ city.source === 'live' ? 'LIVE DATA' : 'MOCK FALLBACK' }}
                </el-tag>
              </div>

              <p class="detail-description">
                OpenWeatherMap의 현재 날씨와 대기질 데이터를 기반으로 한 상세 기상 정보입니다.
              </p>
            </div>

            <el-tag type="info" effect="plain" size="large" round>
              {{ city.status }}
            </el-tag>
          </div>
        </el-card>

        <el-card shadow="never" class="temperature-card">
          <div class="temperature-content">
            <div>
              <span class="metric-label"> CURRENT TEMPERATURE </span>

              <p class="detail-temperature">{{ displayTemp }}{{ configStore.unitSymbol }}</p>

              <p class="feels-like">
                체감온도
                {{ displayFeelsLike }}{{ configStore.unitSymbol }}
              </p>
            </div>

            <el-tag :type="city.temp >= 25 ? 'danger' : 'primary'" size="large" effect="dark">
              {{ city.temp >= 25 ? '🔥 더운 날씨' : '❄️ 선선한 날씨' }}
            </el-tag>
          </div>
        </el-card>

        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="section-header">
              <div>
                <span class="section-label"> CURRENT CONDITIONS </span>

                <strong> 현재 기상 관측 </strong>
              </div>

              <el-tag type="success" effect="plain"> OpenWeatherMap </el-tag>
            </div>
          </template>

          <el-descriptions :column="3" border direction="vertical">
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
                <span class="section-label"> OPENWEATHER AIR POLLUTION </span>

                <strong> 현재 대기질 </strong>
              </div>

              <el-tag :type="aqiType" effect="dark" round>
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

        <el-card v-if="detailInsight" shadow="never" class="section-card">
          <template #header>
            <div class="section-header">
              <div>
                <span class="section-label"> ACTIVITY INSIGHT </span>

                <strong> 실시간 활동 가이드 </strong>
              </div>

              <el-tag
                :type="
                  detailInsight.activityScore >= configStore.activityScoreThreshold
                    ? 'success'
                    : 'danger'
                "
              >
                {{ detailInsight.activityScore }} / 100
              </el-tag>
            </div>
          </template>

          <el-progress
            :percentage="detailInsight.activityScore"
            :stroke-width="14"
            :status="
              detailInsight.activityScore >= 80
                ? 'success'
                : detailInsight.activityScore >= 60
                  ? 'warning'
                  : 'exception'
            "
          />

          <el-descriptions :column="1" border class="insight-descriptions">
            <el-descriptions-item label="현재 판단">
              {{ detailInsight.activity }}
            </el-descriptions-item>

            <el-descriptions-item label="추천 활동">
              {{ detailInsight.recommendation }}
            </el-descriptions-item>

            <el-descriptions-item label="주의 사항">
              {{ detailInsight.caution }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <div class="detail-actions">
          <el-button size="large" @click="goBack"> 이전 화면 </el-button>

          <el-button type="primary" size="large" @click="goHome"> 메인 대시보드 </el-button>
        </div>
      </template>

      <el-result
        v-else
        icon="warning"
        title="도시 정보를 찾을 수 없습니다."
        sub-title="요청한 도시 코드와 일치하는 날씨 데이터가 없습니다."
      >
        <template #extra>
          <el-button type="primary" @click="goHome"> 메인 대시보드 </el-button>
        </template>
      </el-result>
    </main>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 40px 24px 56px;
  background: #f4f7fb;
  color: #1f2937;
}

.detail-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.hero-card,
.temperature-card,
.section-card {
  margin-bottom: 20px;
  border-radius: 16px;
}

.detail-header,
.temperature-content,
.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.eyebrow,
.metric-label,
.section-label {
  display: block;
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
  color: #64748b;
}

.eyebrow {
  color: #2563eb;
}

.city-heading {
  display: flex;
  align-items: center;
  gap: 14px;
}

.region {
  margin: 0;
  color: #64748b;
}

.detail-header h1 {
  margin: 4px 0 0;
  font-size: 42px;
}

.detail-description {
  margin: 12px 0 0;
  color: #64748b;
  line-height: 1.6;
}

.temperature-card {
  background: #0f172a;
  border: none;
}

:deep(.temperature-card .el-card__body) {
  padding: 30px;
}

.temperature-content {
  align-items: flex-end;
  color: #fff;
}

.detail-temperature {
  margin: 6px 0;
  font-size: 62px;
  font-weight: 750;
}

.feels-like {
  margin: 0;
  color: #cbd5e1;
}

.section-header {
  align-items: center;
}

.section-header strong {
  display: block;
  font-size: 18px;
}

.air-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.statistic-box {
  padding: 18px;
  background: #f8fafc;
  border-radius: 10px;
}

.statistic-box > span {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #94a3b8;
}

.insight-descriptions {
  margin-top: 20px;
}

.detail-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 760px) {
  .detail-header,
  .temperature-content,
  .section-header {
    flex-direction: column;
  }

  .air-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  :deep(.el-descriptions__body .el-descriptions__table) {
    table-layout: auto;
  }
}
</style>
