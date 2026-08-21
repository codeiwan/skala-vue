<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

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
    return '아직 API 동기화 전'
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
}
</script>

<template>
  <div class="weather-page">
    <section class="weather-dashboard">
      <header class="dashboard-header">
        <p class="eyebrow">WEATHER SIGNAL</p>

        <h1>지역별 실시간 날씨 & 활동 인사이트</h1>

        <p class="description">
          OpenWeatherMap의 실제 날씨 데이터를 기반으로 활동 적합도와 추천 활동을 계산합니다.
        </p>
      </header>

      <!-- API 상태 -->
      <BaseDashboardCard>
        <section class="live-status">
          <div>
            <p class="live-label">OPENWEATHERMAP LIVE</p>

            <p class="live-description">
              실시간 데이터
              <strong>
                {{ liveCityCount }}
              </strong>
              /
              {{ totalCityCount }}
              도시
            </p>

            <p class="updated-at">
              마지막 동기화:
              {{ lastUpdatedLabel }}
            </p>
          </div>

          <button class="refresh-button" :disabled="isLoading" @click="refreshWeather">
            {{ isLoading ? '날씨 갱신 중...' : '실시간 날씨 새로고침' }}
          </button>
        </section>
      </BaseDashboardCard>

      <BaseDashboardCard>
        <SearchBar :query="searchQuery" @update-query="updateSearchQuery" />
      </BaseDashboardCard>

      <BaseDashboardCard>
        <ActivityScoreControl :recommended-city-count="recommendedCityCount" />
      </BaseDashboardCard>

      <div class="status-bar">
        {{ selectedMessage }}
      </div>

      <BaseDashboardCard>
        <section v-if="filteredWeatherList.length > 0" class="weather-grid">
          <WeatherCard
            v-for="city in filteredWeatherList"
            :key="city.id"
            :city="city"
            @select-card="selectCity"
            @click-detail="showDetail"
          />
        </section>

        <section v-else class="empty-result">
          <p class="empty-title">검색 결과가 없습니다.</p>

          <p class="empty-description">"{{ searchQuery }}"와 일치하는 도시를 찾을 수 없습니다.</p>
        </section>
      </BaseDashboardCard>
    </section>
  </div>
</template>

<style scoped>
.weather-page {
  min-height: 100vh;
  padding: 48px 24px;
  background-color: #f4f7fb;
  color: #1f2937;
}

.weather-dashboard {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
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
}

.description {
  margin-top: 10px;
  color: #6b7280;
}

.live-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.live-label {
  margin: 0 0 6px;
  color: #16a34a;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.live-description {
  margin: 0;
  color: #334155;
}

.updated-at {
  margin: 6px 0 0;
  color: #94a3b8;
  font-size: 12px;
}

.refresh-button {
  flex-shrink: 0;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.refresh-button:disabled {
  background-color: #94a3b8;
  cursor: wait;
}

.status-bar {
  padding: 14px 18px;
  margin-bottom: 24px;
  background-color: #e8f0ff;
  border-radius: 10px;
  color: #1d4ed8;
  font-weight: 700;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 20px;
  align-items: stretch;
}

.empty-result {
  padding: 48px 24px;
  background-color: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  text-align: center;
}

.empty-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.empty-description {
  margin: 10px 0 0;
  color: #6b7280;
}

@media (max-width: 560px) {
  .weather-page {
    padding: 32px 16px;
  }

  .weather-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }

  .dashboard-header h1 {
    font-size: 30px;
  }

  .live-status {
    align-items: stretch;
    flex-direction: column;
  }

  .refresh-button {
    width: 100%;
  }
}
</style>
