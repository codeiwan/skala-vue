<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useMountainStore } from '@/stores/mountainStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { fetchAirPollution, getWeatherErrorMessage } from '@/services/weatherApi'
import { createHikingInsight } from '@/utils/hikingInsight'
import { resolveMountainWeatherRegion } from '@/utils/mountainWeather'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
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

const meetsHikingThreshold = computed(() => {
  if (!hikingInsight.value) return false
  return hikingInsight.value.score >= configStore.hikingScoreThreshold
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

const mountainDetailSections = computed(() => {
  if (!mountain.value) return []

  return [
    {
      key: 'selectionReason',
      title: '100대 명산 선정 이유',
      content: mountain.value.selectionReason,
      tag: '100대 명산',
    },
    {
      key: 'courses',
      title: '추천 산행 코스',
      content: mountain.value.courses,
    },
    {
      key: 'transportation',
      title: '대중교통 안내',
      content: mountain.value.transportation,
    },
    {
      key: 'description',
      title: '산 소개',
      content: mountain.value.description,
    },
    {
      key: 'detail',
      title: '상세 이야기',
      content: mountain.value.detail,
    },
  ].filter((section) => section.content?.trim())
})

const formatSectionNumber = (index) => {
  return String(index + 2).padStart(2, '0')
}

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
          <span class="page-header-title">산 상세정보</span>
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
            <div class="mountain-heading">
              <p class="eyebrow">MOUNTAIN INFORMATION</p>
              <h1>{{ mountain.name }}</h1>
              <p v-if="mountain.subtitle" class="subtitle">{{ mountain.subtitle }}</p>

              <div class="hero-location">
                <span>LOCATION</span>
                <p>{{ mountain.location || '소재지 정보 없음' }}</p>
              </div>
            </div>

            <div class="hero-stat">
              <span>ALTITUDE</span>

              <div v-if="mountain.height">
                <strong>{{ mountain.height }}</strong>
                <small>m</small>
              </div>

              <p v-else>정보 없음</p>
            </div>
          </section>

          <el-card v-if="hikingInsight" shadow="never" class="condition-card">
            <div class="condition-header">
              <div>
                <p class="eyebrow">TODAY'S HIKING CONDITION</p>
                <h2>{{ hikingInsight.label }}</h2>
              </div>

              <el-tag :type="hikingInsight.type" effect="dark" size="large">
                {{ hikingInsight.label }}
              </el-tag>
            </div>

            <div class="condition-layout">
              <div class="condition-score">
                <el-progress
                  type="dashboard"
                  :percentage="hikingInsight.score"
                  :width="174"
                  :stroke-width="11"
                />

                <div class="score-label">
                  <strong>{{ hikingInsight.score }}</strong>
                  <span>/ 100</span>
                </div>

                <small>HIKING SCORE</small>
              </div>

              <div class="condition-content">
                <div class="recommendation">
                  <span>CONDITION GUIDE</span>
                  <p>{{ hikingInsight.recommendation }}</p>
                </div>

                <div
                  class="preference-box"
                  :class="{ success: meetsHikingThreshold, warning: !meetsHikingThreshold }"
                >
                  <div>
                    <span>MY HIKING PREFERENCE</span>
                    <strong>
                      {{ meetsHikingThreshold ? '내 추천 기준 충족' : '내 추천 기준 미달' }}
                    </strong>
                  </div>

                  <div class="preference-score">
                    <strong>{{ configStore.hikingScoreThreshold }}</strong>
                    <span>점 이상</span>
                  </div>
                </div>

                <div v-if="hikingInsight.warnings.length" class="warning-list">
                  <span class="warning-title">현재 주의사항</span>

                  <ul>
                    <li v-for="warning in hikingInsight.warnings" :key="warning">
                      {{ warning }}
                    </li>
                  </ul>
                </div>

                <el-alert
                  v-else
                  title="현재 환경 데이터에서 특별한 산행 주의요소가 감지되지 않았습니다."
                  type="success"
                  :closable="false"
                  show-icon
                />
              </div>
            </div>

            <p class="condition-note">
              대표 지역의 기온·습도·풍속·날씨 상태·가시거리·대기질을 이용한 참고용 지표입니다. 개인
              추천 기준은 점수 계산 자체에는 영향을 주지 않습니다.
            </p>
          </el-card>

          <section class="environment-section">
            <div class="section-title">
              <div>
                <p class="eyebrow">TODAY'S ENVIRONMENT</p>
                <h2>산행 전 확인할 환경</h2>
              </div>

              <el-tag v-if="weatherRegion" effect="plain">
                기준 지역 · {{ weatherRegion.label }}
              </el-tag>
            </div>

            <div class="environment-grid">
              <el-card shadow="never" class="environment-card">
                <template #header>
                  <div class="environment-card-header">
                    <div>
                      <span>WEATHER</span>
                      <strong>현재 기상</strong>
                    </div>

                    <span v-if="weather" class="weather-status">
                      {{ weather.status || '정보 없음' }}
                    </span>
                  </div>
                </template>

                <div v-loading="isWeatherLoading">
                  <el-empty
                    v-if="!weatherRegion"
                    description="기상 기준 지역을 찾을 수 없습니다."
                  />

                  <template v-else-if="weather">
                    <el-alert
                      v-if="weather.apiError"
                      :title="weather.apiError"
                      type="warning"
                      :closable="false"
                      show-icon
                      class="weather-alert"
                    />

                    <div class="temperature-hero">
                      <span>현재 기온</span>
                      <strong>{{ weather.temp.toFixed(1) }}°</strong>
                      <small>체감 {{ weather.feelsLike.toFixed(1) }}℃</small>
                    </div>

                    <div class="metric-grid">
                      <div>
                        <span>습도</span>
                        <strong>{{ weather.humidity }}%</strong>
                      </div>

                      <div>
                        <span>풍속</span>
                        <strong>{{ weather.windSpeed.toFixed(1) }} m/s</strong>
                      </div>

                      <div>
                        <span>가시거리</span>
                        <strong>
                          {{
                            weather.visibility != null
                              ? `${(weather.visibility / 1000).toFixed(1)} km`
                              : '-'
                          }}
                        </strong>
                      </div>

                      <div>
                        <span>기압</span>
                        <strong>
                          {{ weather.pressure ? `${weather.pressure} hPa` : '-' }}
                        </strong>
                      </div>
                    </div>
                  </template>
                </div>

                <p class="data-note">
                  산 정상의 정밀 예보가 아닌 소재지 기반 대표 지역 기상정보입니다.
                </p>
              </el-card>

              <el-card shadow="never" class="environment-card">
                <template #header>
                  <div class="environment-card-header">
                    <div>
                      <span>AIR QUALITY</span>
                      <strong>현재 대기질</strong>
                    </div>

                    <el-tag v-if="airQuality" :type="airQualityTagType" effect="light">
                      AQI {{ airQuality.aqi }} · {{ airQualityLabel }}
                    </el-tag>
                  </div>
                </template>

                <div v-loading="isAirQualityLoading">
                  <el-alert
                    v-if="airQualityError"
                    :title="airQualityError"
                    type="warning"
                    :closable="false"
                    show-icon
                  />

                  <template v-else-if="airQuality">
                    <div class="air-quality-hero">
                      <span>OPENWEATHER AQI</span>
                      <strong>{{ airQuality.aqi }}</strong>
                      <small>{{ airQualityLabel }}</small>
                    </div>

                    <div class="metric-grid">
                      <div>
                        <span>PM2.5</span>
                        <strong>{{ airQuality.pm25.toFixed(1) }}</strong>
                        <small>㎍/㎥</small>
                      </div>

                      <div>
                        <span>PM10</span>
                        <strong>{{ airQuality.pm10.toFixed(1) }}</strong>
                        <small>㎍/㎥</small>
                      </div>

                      <div>
                        <span>NO₂</span>
                        <strong>{{ airQuality.no2.toFixed(1) }}</strong>
                        <small>㎍/㎥</small>
                      </div>

                      <div>
                        <span>O₃</span>
                        <strong>{{ airQuality.o3.toFixed(1) }}</strong>
                        <small>㎍/㎥</small>
                      </div>
                    </div>
                  </template>

                  <el-empty
                    v-else-if="!isAirQualityLoading"
                    description="대기질 정보를 확인할 수 없습니다."
                  />
                </div>

                <p class="data-note">
                  산의 대표 기상 지역 좌표를 기준으로 조회한 참고용 대기질 정보입니다.
                </p>
              </el-card>
            </div>
          </section>

          <el-card shadow="never" class="detail-card">
            <template #header>
              <div class="detail-card-heading">
                <span>01</span>
                <strong>기본 정보</strong>
              </div>
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

          <el-card
            v-for="(section, index) in mountainDetailSections"
            :key="section.key"
            shadow="never"
            class="detail-card"
          >
            <template #header>
              <div class="detail-card-heading">
                <span>{{ formatSectionNumber(index) }}</span>
                <strong>{{ section.title }}</strong>

                <el-tag v-if="section.tag" type="success" size="small" effect="plain">
                  {{ section.tag }}
                </el-tag>
              </div>
            </template>

            <p class="content-text">{{ section.content }}</p>
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
  padding: 40px 24px 80px;
  background: var(--color-background);
  color: var(--color-text);
}
.detail-container {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
}
.detail-content {
  min-height: 420px;
  margin-top: 28px;
}
.detail-alert,
.weather-alert {
  margin-bottom: 18px;
}
.page-header-title {
  color: var(--color-text);
  font-weight: 700;
}

.mountain-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 26px;
  padding: 38px 42px;
  overflow: hidden;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-large);
  background: linear-gradient(135deg, #f8faf6 0%, #e7f0e9 100%);
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.8px;
}
.mountain-heading h1 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: clamp(42px, 6vw, 62px);
  line-height: 1.05;
  letter-spacing: -2.2px;
}
.subtitle {
  margin: 10px 0 0;
  color: var(--color-text-secondary);
  font-size: 17px;
}

.hero-location {
  margin-top: 24px;
}
.hero-location span,
.hero-stat > span {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.4px;
}
.hero-location p {
  max-width: 720px;
  margin: 5px 0 0;
  color: var(--color-text-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.hero-stat {
  min-width: 150px;
  text-align: right;
}
.hero-stat div {
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 2px;
  color: var(--color-primary);
}
.hero-stat strong {
  font-size: 44px;
  line-height: 1;
}
.hero-stat small {
  font-size: 14px;
  font-weight: 800;
}

.condition-card {
  margin-bottom: 42px;
  overflow: hidden;
  border: 1px solid rgba(47, 104, 79, 0.16);
  border-radius: var(--radius-large);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.condition-card :deep(.el-card__body) {
  padding: 34px 38px;
}

.condition-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--color-border-soft);
}
.condition-header h2 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: 28px;
  letter-spacing: -0.8px;
}

.condition-layout {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 42px;
  align-items: center;
}
.condition-score {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.score-label {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: -10px;
}
.score-label strong {
  color: var(--color-primary-deep);
  font-size: 28px;
}
.score-label span {
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 700;
}
.condition-score > small {
  margin-top: 3px;
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.4px;
}

.condition-content {
  min-width: 0;
}
.recommendation > span,
.preference-box span {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.2px;
}
.recommendation p {
  margin: 5px 0 18px;
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 1.7;
}

.preference-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 16px;
  padding: 15px 17px;
  border: 1px solid var(--color-border-soft);
  border-radius: 12px;
}
.preference-box > div:first-child {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.preference-box > div:first-child strong {
  font-size: 15px;
}
.preference-box.success {
  background: var(--color-primary-softer);
}
.preference-box.warning {
  background: var(--color-warning-soft);
}

.preference-score {
  display: flex;
  align-items: baseline;
  gap: 3px;
  white-space: nowrap;
}
.preference-score strong {
  color: var(--color-primary);
  font-size: 23px;
}
.preference-score span {
  color: var(--color-text-muted);
  font-size: 10px;
}

.warning-list {
  padding: 15px 17px;
  border-radius: 12px;
  background: var(--color-warning-soft);
}
.warning-title {
  color: #8a5a18;
  font-size: 12px;
  font-weight: 800;
}
.warning-list ul {
  margin: 8px 0 0;
  padding-left: 19px;
  color: #87551b;
  font-size: 13px;
  line-height: 1.75;
}

.condition-note,
.data-note {
  margin: 18px 0 0;
  color: var(--color-text-muted);
  font-size: 10px;
  line-height: 1.65;
}

.environment-section {
  margin-bottom: 38px;
}
.section-title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 15px;
}
.section-title h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 25px;
  letter-spacing: -0.7px;
}

.environment-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.environment-card {
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-card);
}

.environment-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.environment-card-header > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.environment-card-header span {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.1px;
}
.environment-card-header strong {
  color: var(--color-text);
  font-size: 17px;
}
.weather-status {
  color: var(--color-primary) !important;
  font-size: 12px !important;
  letter-spacing: 0 !important;
}

.temperature-hero,
.air-quality-hero {
  padding: 4px 0 22px;
  border-bottom: 1px solid var(--color-border-soft);
}
.temperature-hero > span,
.air-quality-hero > span {
  display: block;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 800;
}
.temperature-hero strong,
.air-quality-hero strong {
  display: inline-block;
  margin-top: 5px;
  color: var(--color-primary-deep);
  font-size: 44px;
  line-height: 1;
}
.temperature-hero small,
.air-quality-hero small {
  margin-left: 7px;
  color: var(--color-text-secondary);
  font-size: 12px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  margin-top: 6px;
}
.metric-grid > div {
  min-height: 72px;
  padding: 14px 12px 10px 0;
}
.metric-grid > div:nth-child(even) {
  padding-left: 16px;
  border-left: 1px solid var(--color-border-soft);
}
.metric-grid > div:nth-child(n + 3) {
  border-top: 1px solid var(--color-border-soft);
}
.metric-grid span {
  display: block;
  margin-bottom: 4px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
}
.metric-grid strong {
  color: var(--color-text);
  font-size: 16px;
}
.metric-grid small {
  margin-left: 3px;
  color: var(--color-text-muted);
  font-size: 9px;
}

.detail-card {
  margin-bottom: 16px;
  border-radius: var(--radius-medium);
}

.detail-card-heading {
  display: flex;
  align-items: center;
  gap: 10px;
}
.detail-card-heading > span {
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1px;
}
.detail-card-heading strong {
  font-size: 16px;
}
.detail-card-heading .el-tag {
  margin-left: auto;
}

.content-text {
  margin: 0;
  white-space: pre-line;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.9;
}

@media (max-width: 820px) {
  .condition-layout {
    grid-template-columns: 1fr;
  }
  .environment-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .detail-page {
    padding: 30px 16px 58px;
  }
  .mountain-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 30px 24px;
  }
  .mountain-heading h1 {
    font-size: 42px;
  }
  .hero-stat {
    text-align: left;
  }
  .hero-stat div {
    justify-content: flex-start;
  }
  .condition-card :deep(.el-card__body) {
    padding: 26px 20px;
  }
  .condition-header,
  .section-title {
    align-items: flex-start;
    flex-direction: column;
  }
  .preference-box {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
