<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMountainStore } from '@/stores/mountainStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { fetchAirPollution, getWeatherErrorMessage } from '@/services/weatherApi'
import { createHikingInsight } from '@/utils/hikingInsight'
import { resolveMountainWeatherRegion } from '@/utils/mountainWeather'

const route = useRoute()
const router = useRouter()
const mountainStore = useMountainStore()
const weatherStore = useWeatherStore()

const mountainName = computed(() => String(route.params.mountainName || ''))
const mountain = computed(() => mountainStore.selectedMountain)

const weatherRegion = computed(() => {
  return resolveMountainWeatherRegion(mountain.value?.location || '')
})

const weather = computed(() => {
  if (!weatherRegion.value) return null
  return weatherStore.getCityById(weatherRegion.value.cityId)
})

const airQuality = ref(null)
const airQualityError = ref('')
const isWeatherLoading = ref(false)
const isAirQualityLoading = ref(false)

const hikingInsight = computed(() => {
  if (!weather.value || weather.value.apiError) return null
  return createHikingInsight(weather.value, airQuality.value)
})

const airQualityLabel = computed(() => {
  const aqi = airQuality.value?.aqi

  if (aqi === 1) return '좋음'
  if (aqi === 2) return '양호'
  if (aqi === 3) return '보통'
  if (aqi === 4) return '나쁨'
  if (aqi === 5) return '매우 나쁨'
  return '정보 없음'
})

const airQualityTagType = computed(() => {
  const aqi = airQuality.value?.aqi

  if (aqi <= 2) return 'success'
  if (aqi === 3) return 'warning'
  if (aqi >= 4) return 'danger'
  return 'info'
})

const loadMountain = async () => {
  if (!mountainName.value) return

  await mountainStore.getMountainByName(mountainName.value)

  if (mountain.value) {
    await loadWeather()
  }
}

const loadWeather = async () => {
  if (!weatherRegion.value) return

  isWeatherLoading.value = true
  airQuality.value = null
  airQualityError.value = ''

  try {
    await weatherStore.fetchCityWeather(weatherRegion.value.cityId)

    const currentWeather = weatherStore.getCityById(weatherRegion.value.cityId)

    if (
      currentWeather &&
      !currentWeather.apiError &&
      currentWeather.lat != null &&
      currentWeather.lon != null
    ) {
      await loadAirQuality(currentWeather.lat, currentWeather.lon)
    }
  } finally {
    isWeatherLoading.value = false
  }
}

const loadAirQuality = async (lat, lon) => {
  isAirQualityLoading.value = true
  airQualityError.value = ''

  try {
    airQuality.value = await fetchAirPollution(lat, lon)
  } catch (error) {
    console.error('[Mountain Detail] 대기질 조회 실패:', error)
    airQuality.value = null
    airQualityError.value = getWeatherErrorMessage(error)
  } finally {
    isAirQualityLoading.value = false
  }
}

const goBack = () => {
  router.push({ name: 'HikingHome' })
}

onMounted(loadMountain)
</script>

<template>
  <div class="detail-page">
    <main class="detail-container">
      <el-page-header title="산 검색으로 돌아가기" @back="goBack">
        <template #content>
          <span>산 상세정보</span>
        </template>
      </el-page-header>

      <div v-loading="mountainStore.isLoading" class="detail-content">
        <el-alert
          v-if="mountainStore.errorMessage"
          :title="mountainStore.errorMessage"
          type="error"
          :closable="false"
          show-icon
          class="detail-alert"
        />

        <template v-if="mountain">
          <section class="mountain-hero">
            <div>
              <p class="eyebrow">MOUNTAIN INFORMATION</p>
              <h1>{{ mountain.name }}</h1>
              <p v-if="mountain.subtitle" class="subtitle">{{ mountain.subtitle }}</p>
            </div>

            <div class="hero-tags">
              <el-tag v-if="mountain.height" type="success" size="large" effect="plain">
                해발 {{ mountain.height }}m
              </el-tag>
              <el-tag effect="plain">산림청 공공데이터</el-tag>
            </div>
          </section>

          <el-card shadow="never" class="detail-card">
            <template #header>
              <strong>기본 정보</strong>
            </template>

            <el-descriptions :column="1" border>
              <el-descriptions-item label="산 코드">
                {{ mountain.id || '정보 없음' }}
              </el-descriptions-item>
              <el-descriptions-item label="높이">
                {{ mountain.height ? `${mountain.height}m` : '정보 없음' }}
              </el-descriptions-item>
              <el-descriptions-item label="소재지">
                {{ mountain.location || '정보 없음' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <el-card shadow="never" class="detail-card">
            <template #header>
              <div class="section-heading">
                <strong>오늘의 산행 기상</strong>
                <el-tag v-if="weatherRegion" type="primary" effect="plain">
                  기준 지역 · {{ weatherRegion.label }}
                </el-tag>
              </div>
            </template>

            <div v-loading="isWeatherLoading">
              <el-empty
                v-if="!weatherRegion"
                description="이 산의 소재지와 연결할 수 있는 기상 기준 지역이 없습니다."
              />

              <template v-else-if="weather">
                <el-alert
                  v-if="weather.apiError"
                  :title="`실시간 기상정보를 가져오지 못해 기본 데이터를 표시합니다. ${weather.apiError}`"
                  type="warning"
                  :closable="false"
                  show-icon
                  class="weather-alert"
                />

                <div class="weather-summary">
                  <el-statistic title="현재 기온" :value="weather.temp" :precision="1">
                    <template #suffix>℃</template>
                  </el-statistic>
                  <el-statistic title="체감 온도" :value="weather.feelsLike" :precision="1">
                    <template #suffix>℃</template>
                  </el-statistic>
                  <el-statistic title="습도" :value="weather.humidity">
                    <template #suffix>%</template>
                  </el-statistic>
                  <el-statistic title="풍속" :value="weather.windSpeed" :precision="1">
                    <template #suffix>m/s</template>
                  </el-statistic>
                </div>

                <el-descriptions :column="2" border class="weather-details">
                  <el-descriptions-item label="날씨">
                    {{ weather.status || '정보 없음' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="기압">
                    {{ weather.pressure ? `${weather.pressure} hPa` : '정보 없음' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="구름량">
                    {{ weather.cloudiness != null ? `${weather.cloudiness}%` : '정보 없음' }}
                  </el-descriptions-item>
                  <el-descriptions-item label="가시거리">
                    {{
                      weather.visibility != null
                        ? `${(weather.visibility / 1000).toFixed(1)} km`
                        : '정보 없음'
                    }}
                  </el-descriptions-item>
                </el-descriptions>

                <p class="weather-note">
                  산 정상의 정밀 기상정보가 아니라 소재지를 기준으로 연결한 대표 지역
                  기상정보입니다.
                </p>
              </template>
            </div>
          </el-card>

          <el-card shadow="never" class="detail-card">
            <template #header>
              <div class="section-heading">
                <strong>대기질</strong>
                <el-tag v-if="airQuality" :type="airQualityTagType" effect="plain">
                  AQI {{ airQuality.aqi }} · {{ airQualityLabel }}
                </el-tag>
              </div>
            </template>

            <div v-loading="isAirQualityLoading">
              <el-alert
                v-if="airQualityError"
                :title="`대기질 정보를 불러오지 못했습니다. ${airQualityError}`"
                type="warning"
                :closable="false"
                show-icon
              />

              <div v-else-if="airQuality" class="air-summary">
                <el-statistic title="PM2.5" :value="airQuality.pm25" :precision="1">
                  <template #suffix>㎍/㎥</template>
                </el-statistic>
                <el-statistic title="PM10" :value="airQuality.pm10" :precision="1">
                  <template #suffix>㎍/㎥</template>
                </el-statistic>
                <el-statistic title="NO₂" :value="airQuality.no2" :precision="1">
                  <template #suffix>㎍/㎥</template>
                </el-statistic>
                <el-statistic title="O₃" :value="airQuality.o3" :precision="1">
                  <template #suffix>㎍/㎥</template>
                </el-statistic>
              </div>

              <el-empty
                v-else-if="!isAirQualityLoading"
                description="현재 대기질 정보를 확인할 수 없습니다."
              />
            </div>

            <p class="weather-note">
              대기질 정보 역시 선택한 산의 대표 기상 지역 좌표를 기준으로 제공되는 참고 정보입니다.
            </p>
          </el-card>

          <el-card v-if="hikingInsight" shadow="never" class="detail-card hiking-condition-card">
            <template #header>
              <div class="section-heading">
                <strong>Hiking Condition</strong>
                <el-tag :type="hikingInsight.type" effect="dark">
                  {{ hikingInsight.label }}
                </el-tag>
              </div>
            </template>

            <div class="condition-layout">
              <div class="condition-score">
                <el-progress type="dashboard" :percentage="hikingInsight.score" :width="150" />
                <strong>{{ hikingInsight.score }} / 100</strong>
                <span>산행 환경 점수</span>
              </div>

              <div class="condition-content">
                <h3>{{ hikingInsight.label }}</h3>
                <p>{{ hikingInsight.recommendation }}</p>

                <div v-if="hikingInsight.warnings.length" class="warning-list">
                  <strong>현재 주의사항</strong>
                  <ul>
                    <li v-for="warning in hikingInsight.warnings" :key="warning">
                      {{ warning }}
                    </li>
                  </ul>
                </div>

                <el-alert
                  v-else
                  title="현재 기상 및 대기질 데이터에서 특별한 산행 주의요소가 감지되지 않았습니다."
                  type="success"
                  :closable="false"
                  show-icon
                />
              </div>
            </div>

            <p class="condition-note">
              이 점수는 대표 지역의 기온·습도·풍속·날씨 상태·가시거리와 대기질을 조합해 계산한
              참고용 지표입니다.
            </p>
          </el-card>

          <el-card v-if="mountain.selectionReason" shadow="never" class="detail-card">
            <template #header>
              <div class="section-heading">
                <strong>100대 명산 선정 이유</strong>
                <el-tag type="success" size="small">100대 명산</el-tag>
              </div>
            </template>
            <p class="content-text">{{ mountain.selectionReason }}</p>
          </el-card>

          <el-card v-if="mountain.courses" shadow="never" class="detail-card">
            <template #header>
              <strong>추천 산행 코스</strong>
            </template>
            <p class="content-text">{{ mountain.courses }}</p>
          </el-card>

          <el-card v-if="mountain.transportation" shadow="never" class="detail-card">
            <template #header>
              <strong>대중교통 안내</strong>
            </template>
            <p class="content-text">{{ mountain.transportation }}</p>
          </el-card>

          <el-card v-if="mountain.description" shadow="never" class="detail-card">
            <template #header>
              <strong>산 소개</strong>
            </template>
            <p class="content-text">{{ mountain.description }}</p>
          </el-card>

          <el-card v-if="mountain.detail" shadow="never" class="detail-card">
            <template #header>
              <strong>상세 이야기</strong>
            </template>
            <p class="content-text">{{ mountain.detail }}</p>
          </el-card>
        </template>

        <el-result
          v-else-if="!mountainStore.isLoading && !mountainStore.errorMessage"
          icon="warning"
          title="산 정보를 찾을 수 없습니다."
          sub-title="요청한 산 이름과 일치하는 공공데이터가 없습니다."
        >
          <template #extra>
            <el-button type="primary" @click="goBack"> 산 검색으로 돌아가기 </el-button>
          </template>
        </el-result>
      </div>
    </main>
  </div>
</template>

<style scoped>
.detail-page {
  min-height: 100vh;
  padding: 42px 24px 70px;
  background: #f4f7fb;
  color: #1f2937;
}
.detail-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}
.detail-content {
  min-height: 420px;
  margin-top: 26px;
}
.detail-alert,
.weather-alert {
  margin-bottom: 18px;
}

.mountain-hero {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}
.eyebrow {
  margin: 0 0 7px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.7px;
}
.mountain-hero h1 {
  margin: 0;
  font-size: 40px;
  letter-spacing: -1px;
}
.subtitle {
  margin: 8px 0 0;
  color: #64748b;
  font-size: 17px;
}
.hero-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.detail-card {
  margin-bottom: 18px;
  border-radius: 16px;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.content-text {
  margin: 0;
  white-space: pre-line;
  color: #475569;
  line-height: 1.85;
}

.weather-summary,
.air-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 22px;
}
.weather-details {
  margin-top: 8px;
}
.weather-note,
.condition-note {
  margin: 14px 0 0;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.6;
}

.condition-layout {
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 32px;
  align-items: center;
}
.condition-score {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 5px;
}
.condition-score strong {
  margin-top: 4px;
  font-size: 18px;
}
.condition-score span {
  color: #94a3b8;
  font-size: 12px;
}
.condition-content h3 {
  margin: 0;
  font-size: 23px;
}
.condition-content > p {
  margin: 8px 0 18px;
  color: #64748b;
  line-height: 1.7;
}
.warning-list {
  padding: 16px 18px;
  border-radius: 10px;
  background: #fff7ed;
}
.warning-list strong {
  font-size: 14px;
}
.warning-list ul {
  margin: 9px 0 0;
  padding-left: 20px;
  color: #9a3412;
  line-height: 1.8;
}

@media (max-width: 800px) {
  .weather-summary,
  .air-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .condition-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {
  .detail-page {
    padding: 32px 16px 52px;
  }
  .mountain-hero {
    flex-direction: column;
  }
  .mountain-hero h1 {
    font-size: 32px;
  }
  .hero-tags {
    justify-content: flex-start;
  }
}

@media (max-width: 520px) {
  .weather-summary,
  .air-summary {
    grid-template-columns: 1fr;
  }
  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
