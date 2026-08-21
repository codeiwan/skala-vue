<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'

import ActivityScoreControl from '@/components/exercise/ActivityScoreControl.vue'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'

import { weatherList } from '@/data/weatherData'

const router = useRouter()

const searchQuery = ref('')
const selectedCityInfo = ref(null)
const selectedMessage = ref('도시를 선택해 주세요.')

const minActivityScore = ref(70)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (query === '') {
    return weatherList
  }

  return weatherList.filter((city) => city.name.includes(query))
})

const recommendedCityCount = computed(() => {
  return weatherList.filter((city) => city.activityScore >= minActivityScore.value).length
})

watch(selectedCityInfo, (newCity, oldCity) => {
  if (newCity === null) {
    return
  }

  selectedMessage.value = `${newCity.name}이 선택되었습니다.`

  console.log(`[watch] 선택 도시 변경: ${oldCity?.name || '없음'} → ${newCity.name}`)

  console.log(`[watch] 상태바 문구 업데이트: ${selectedMessage.value}`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

watch(minActivityScore, (newScore, oldScore) => {
  console.log(
    `[Activity Watcher] 활동 추천 기준이 ${oldScore}점에서 ${newScore}점으로 변경되었습니다.`,
  )
})

const updateSearchQuery = (query) => {
  searchQuery.value = query
}

const updateActivityScore = (score) => {
  minActivityScore.value = score
}

const selectCity = (city) => {
  selectedCityInfo.value = city
}

// ======================================================
// Router - Programmatic Navigation
// ======================================================

const showDetail = (city) => {
  router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="weather-page">
    <section class="weather-dashboard">
      <header class="dashboard-header">
        <p class="eyebrow">WEATHER SIGNAL</p>

        <h1>지역별 날씨 & 활동 인사이트</h1>

        <p class="description">
          날씨 정보를 기반으로 오늘의 활동 적합도와 추천 활동을 함께 확인합니다.
        </p>
      </header>

      <BaseDashboardCard>
        <SearchBar :query="searchQuery" @update-query="updateSearchQuery" />
      </BaseDashboardCard>

      <BaseDashboardCard>
        <ActivityScoreControl
          :min-activity-score="minActivityScore"
          :recommended-city-count="recommendedCityCount"
          @update-score="updateActivityScore"
        />
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
            :min-activity-score="minActivityScore"
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

.status-bar {
  padding: 14px 18px;
  margin-bottom: 24px;

  background-color: #e8f0ff;
  border-radius: 10px;

  color: #1d4ed8;
  font-weight: 700;
}

/*
  카드 최소 폭을 340px로 설정한다.

  weather-dashboard의 최대 폭 1400px에서
  340px 카드 3개 + gap 2개는 충분히 배치할 수 있으므로
  넓은 화면에서는 최대 3열이 안정적으로 표시된다.

  auto-fit을 사용하므로:
  - 검색 결과 1개 → 전체 영역 사용
  - 검색 결과 2개 → 2개가 균등하게 영역 사용
  - 검색 결과 3개 이상 → 최대 3열 중심
  - 화면이 좁으면 자동으로 2열 → 1열 감소
*/
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

  color: #1f2937;
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
}
</style>
