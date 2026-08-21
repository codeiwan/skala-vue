<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import ActivityScoreControl from '@/components/exercise/ActivityScoreControl.vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'

import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const router = useRouter()

const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const { weatherList, isLoading, lastUpdatedAt, liveCityCount, totalCityCount } =
  storeToRefs(weatherStore)

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const selectedMessage = ref('도시를 선택해 주세요.')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (query === '') {
    return weatherList.value
  }

  return weatherList.value.filter((city) => city.name.includes(query))
})

const recommendedCityCount = computed(() => {
  return weatherList.value.filter(
    (city) => city.activityScore >= configStore.activityScoreThreshold,
  ).length
})

const lastUpdatedLabel = computed(() => {
  if (!lastUpdatedAt.value) {
    return '아직 동기화하지 않음'
  }

  return new Date(lastUpdatedAt.value).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})

onMounted(async () => {
  if (weatherStore.liveCityCount === 0) {
    await weatherStore.fetchAllWeather()
  }
})

watch(selectedCityInfo, (newCity, oldCity) => {
  if (!newCity) {
    return
  }

  selectedMessage.value = `${newCity.name}이 선택되었습니다.`

  console.log(`[watch] 선택 도시 변경: ${oldCity?.name || '없음'} → ${newCity.name}`)
})

watch(
  () => configStore.activityScoreThreshold,
  (newScore, oldScore) => {
    console.log(`[Pinia] Activity 추천 기준 변경: ${oldScore}점 → ${newScore}점`)
  },
)

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

const updateSearchQuery = (query) => {
  searchQuery.value = query
}

const selectCity = (city) => {
  selectedCityInfo.value = city
}

const showDetail = (city) => {
  router.push(`/weather/${city.id}`)
}

const refreshWeather = async () => {
  await weatherStore.fetchAllWeather()

  if (liveCityCount.value === totalCityCount.value) {
    ElMessage.success(`${liveCityCount.value}개 도시의 실시간 날씨를 모두 갱신했습니다.`)

    return
  }

  ElMessage.warning(
    `${liveCityCount.value}/${totalCityCount.value}개 도시의 실시간 날씨를 갱신했습니다.`,
  )
}
</script>

<template>
  <div class="weather-page">
    <section class="weather-dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div>
          <p class="eyebrow">WEATHER SIGNAL</p>

          <h1>지역별 실시간 날씨 & 활동 인사이트</h1>

          <p class="description">
            OpenWeatherMap의 실제 날씨 데이터를 기반으로 활동 적합도와 추천 활동을 분석합니다.
          </p>
        </div>

        <el-tag type="success" effect="dark" round size="large"> LIVE WEATHER </el-tag>
      </header>

      <!-- API Summary -->
      <BaseDashboardCard>
        <section class="api-summary">
          <div class="statistics">
            <el-statistic title="실시간 데이터" :value="liveCityCount" />

            <el-statistic title="전체 도시" :value="totalCityCount" />

            <div class="updated-info">
              <span> 마지막 동기화 </span>

              <strong>
                {{ lastUpdatedLabel }}
              </strong>
            </div>
          </div>

          <el-button type="primary" :loading="isLoading" @click="refreshWeather">
            {{ isLoading ? '날씨 동기화 중' : '실시간 날씨 새로고침' }}
          </el-button>
        </section>
      </BaseDashboardCard>

      <!-- Search -->
      <BaseDashboardCard>
        <SearchBar :query="searchQuery" @update-query="updateSearchQuery" />
      </BaseDashboardCard>

      <!-- Activity Threshold -->
      <BaseDashboardCard>
        <ActivityScoreControl :recommended-city-count="recommendedCityCount" />
      </BaseDashboardCard>

      <!-- Pinia Activity Insight -->
      <el-alert
        :title="`${configStore.activityScoreThreshold}점 이상을 추천 기준으로 적용 중 · 현재 ${recommendedCityCount}개 도시 추천`"
        type="success"
        :closable="false"
        show-icon
        class="activity-threshold-alert"
      />

      <!-- Selected City -->
      <el-alert
        :title="selectedMessage"
        type="info"
        :closable="false"
        show-icon
        class="selected-alert"
      />

      <!-- Weather List -->
      <BaseDashboardCard>
        <div
          v-loading="isLoading"
          element-loading-text="OpenWeatherMap의 최신 날씨를 불러오는 중입니다..."
          class="weather-content"
        >
          <section v-if="filteredWeatherList.length > 0" class="weather-grid">
            <WeatherCard
              v-for="city in filteredWeatherList"
              :key="city.id"
              :city="city"
              @select-card="selectCity"
              @click-detail="showDetail"
            />
          </section>

          <el-empty v-else :description="`'${searchQuery}'와 일치하는 도시를 찾을 수 없습니다.`" />
        </div>
      </BaseDashboardCard>
    </section>
  </div>
</template>

<style scoped>
.weather-page {
  min-height: 100vh;
  padding: 48px 24px;
  background: #f4f7fb;
  color: #1f2937;
}

.weather-dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}

.eyebrow {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #2563eb;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 36px;
  letter-spacing: -0.6px;
}

.description {
  margin: 10px 0 0;
  color: #64748b;
}

.api-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.statistics {
  display: flex;
  align-items: center;
  gap: 42px;
}

.updated-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.updated-info span {
  font-size: 12px;
  color: #94a3b8;
}

.updated-info strong {
  font-size: 14px;
  color: #334155;
}

.activity-threshold-alert {
  margin-bottom: 12px;
}

.selected-alert {
  margin-bottom: 20px;
}

.weather-content {
  min-height: 220px;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 20px;
  align-items: stretch;
}

@media (max-width: 760px) {
  .dashboard-header,
  .api-summary {
    flex-direction: column;
  }

  .statistics {
    flex-wrap: wrap;
    gap: 24px;
  }
}

@media (max-width: 560px) {
  .weather-page {
    padding: 32px 16px;
  }

  .dashboard-header h1 {
    font-size: 30px;
  }

  .weather-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}
</style>
