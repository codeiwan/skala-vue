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

  if (query === '') return weatherList.value

  return weatherList.value.filter((city) => city.name.includes(query))
})

const recommendedCityCount = computed(() => {
  return weatherList.value.filter(
    (city) => city.activityScore >= configStore.activityScoreThreshold,
  ).length
})

const lastUpdatedLabel = computed(() => {
  if (!lastUpdatedAt.value) return '아직 동기화하지 않음'

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
  if (!newCity) return

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
    <main class="weather-dashboard">
      <header class="dashboard-hero">
        <div>
          <p class="eyebrow">WEATHER DASHBOARD</p>

          <h1>
            산행 전, 주변 도시의<br />
            날씨도 함께 살펴보세요.
          </h1>

          <p class="description">
            OpenWeatherMap의 현재 날씨를 확인하고, 도시별 야외활동 적합도도 비교해 볼 수 있어요.
          </p>
        </div>

        <div class="live-status">
          <span>LIVE WEATHER</span>
          <strong>{{ liveCityCount }} / {{ totalCityCount }}</strong>
          <small>실시간 데이터</small>
        </div>
      </header>

      <BaseDashboardCard>
        <section class="api-summary">
          <div class="statistics">
            <el-statistic title="실시간 데이터" :value="liveCityCount" />
            <el-statistic title="전체 도시" :value="totalCityCount" />

            <div class="updated-info">
              <span>LAST SYNC</span>
              <strong>{{ lastUpdatedLabel }}</strong>
            </div>
          </div>

          <el-button type="primary" :loading="isLoading" @click="refreshWeather">
            {{ isLoading ? '날씨 동기화 중' : '날씨 새로고침' }}
          </el-button>
        </section>
      </BaseDashboardCard>

      <div class="control-grid">
        <BaseDashboardCard>
          <SearchBar :query="searchQuery" @update-query="updateSearchQuery" />
        </BaseDashboardCard>

        <BaseDashboardCard>
          <ActivityScoreControl :recommended-city-count="recommendedCityCount" />
        </BaseDashboardCard>
      </div>

      <div class="status-row">
        <el-alert
          :title="`${configStore.activityScoreThreshold}점 이상을 추천 기준으로 적용 중 · 현재 ${recommendedCityCount}개 도시 추천`"
          type="success"
          :closable="false"
          show-icon
        />

        <el-alert :title="selectedMessage" type="info" :closable="false" show-icon />
      </div>

      <section class="weather-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">CITY WEATHER</p>
            <h2>지역별 현재 날씨</h2>
          </div>

          <span>
            {{ filteredWeatherList.length }}
            <small>CITIES</small>
          </span>
        </div>

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
      </section>
    </main>
  </div>
</template>

<style scoped>
.weather-page {
  min-height: 100vh;
  padding: 46px 24px 80px;
  background: var(--color-background);
  color: var(--color-text);
}

.weather-dashboard {
  width: 100%;
  max-width: var(--content-width-wide);
  margin: 0 auto;
}

.dashboard-hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 42px;
  margin-bottom: 24px;
  padding: 44px 48px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-large);
  background: linear-gradient(135deg, #f8faf6 0%, #e6eee7 100%);
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--color-primary);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 1.8px;
}

.dashboard-hero h1 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: clamp(38px, 5vw, 52px);
  line-height: 1.18;
  letter-spacing: -1.8px;
}

.description {
  max-width: 720px;
  margin: 15px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.75;
}

.live-status {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  min-width: 150px;
}

.live-status > span,
.live-status > small {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.2px;
}

.live-status strong {
  margin: 3px 0;
  color: var(--color-primary);
  font-size: 42px;
  line-height: 1;
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
  gap: 4px;
}

.updated-info span {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.1px;
}

.updated-info strong {
  color: var(--color-text);
  font-size: 13px;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.control-grid :deep(.dashboard-card) {
  height: calc(100% - 16px);
}

.status-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 36px;
}

.weather-section {
  margin-top: 14px;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.section-heading h2 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: 28px;
  letter-spacing: -0.8px;
}

.section-heading > span {
  display: flex;
  align-items: baseline;
  gap: 4px;
  color: var(--color-primary);
  font-size: 28px;
  font-weight: 900;
}

.section-heading small {
  color: var(--color-text-muted);
  font-size: 9px;
  letter-spacing: 1px;
}

.weather-content {
  min-height: 220px;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 18px;
  align-items: stretch;
}

@media (max-width: 850px) {
  .control-grid,
  .status-row {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .dashboard-hero,
  .api-summary {
    align-items: flex-start;
    flex-direction: column;
  }

  .live-status {
    align-items: flex-start;
  }

  .statistics {
    flex-wrap: wrap;
    gap: 24px;
  }
}

@media (max-width: 560px) {
  .weather-page {
    padding: 30px 16px 58px;
  }
  .dashboard-hero {
    padding: 34px 25px;
  }
  .dashboard-hero h1 {
    font-size: 36px;
  }
  .weather-grid {
    grid-template-columns: 1fr;
  }
}
</style>
