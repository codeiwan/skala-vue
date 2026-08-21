<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const { weatherList, liveCityCount } = storeToRefs(weatherStore)

const scoreOptions = [
  {
    label: '60점',
    value: 60,
  },
  {
    label: '70점',
    value: 70,
  },
  {
    label: '80점',
    value: 80,
  },
]

const scoreModel = computed({
  get() {
    return configStore.activityScoreThreshold
  },

  set(value) {
    configStore.setActivityScoreThreshold(value)
  },
})

const recommendedCities = computed(() => {
  return weatherList.value.filter(
    (city) => city.activityScore >= configStore.activityScoreThreshold,
  )
})

onMounted(async () => {
  if (liveCityCount.value === 0) {
    await weatherStore.fetchAllWeather()
  }
})
</script>

<template>
  <div class="guide-page">
    <main class="guide-container">
      <header class="guide-header">
        <div>
          <p class="eyebrow">ACTIVITY GUIDE</p>

          <h1>오늘 어디서 활동할까?</h1>

          <p class="description">실제 날씨 데이터를 기반으로 활동하기 좋은 도시를 확인합니다.</p>
        </div>

        <el-tag type="success" effect="dark" size="large" round>
          추천 {{ recommendedCities.length }}개
        </el-tag>
      </header>

      <el-card shadow="never" class="control-card">
        <div class="score-control">
          <div>
            <span class="control-label"> 전역 활동 추천 기준 </span>

            <strong>
              {{ configStore.activityThresholdLabel }}
            </strong>
          </div>

          <el-segmented v-model="scoreModel" :options="scoreOptions" size="large" />
        </div>
      </el-card>

      <section v-if="recommendedCities.length > 0" class="city-grid">
        <el-card v-for="city in recommendedCities" :key="city.id" shadow="hover" class="guide-card">
          <div class="city-heading">
            <div>
              <span class="region">
                {{ city.region }}
              </span>

              <h2>
                {{ city.name }}
              </h2>
            </div>

            <el-tag :type="city.source === 'live' ? 'success' : 'warning'" size="small">
              {{ city.source === 'live' ? 'LIVE' : 'MOCK' }}
            </el-tag>
          </div>

          <div class="score-heading">
            <strong>
              {{ city.activityScore }}
            </strong>

            <span>/ 100</span>
          </div>

          <el-progress
            :percentage="city.activityScore"
            :stroke-width="10"
            :show-text="false"
            status="success"
          />

          <p class="activity">
            {{ city.activity }}
          </p>

          <el-alert :title="city.recommendation" type="success" :closable="false" />
        </el-card>
      </section>

      <el-empty v-else description="현재 기준을 충족하는 도시가 없습니다." />
    </main>
  </div>
</template>

<style scoped>
.guide-page {
  min-height: 100vh;
  padding: 48px 24px;
  background: #f4f7fb;
  color: #1f2937;
}

.guide-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.guide-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
}

h1 {
  margin: 0;
  font-size: 40px;
}

.description {
  color: #64748b;
}

.control-card {
  margin-bottom: 20px;
  border-radius: 14px;
}

.score-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.score-control > div {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.control-label {
  font-size: 12px;
  color: #64748b;
}

.score-control strong {
  color: #2563eb;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 18px;
}

.guide-card {
  border-radius: 16px;
}

.city-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.region {
  font-size: 13px;
  color: #64748b;
}

.guide-card h2 {
  margin: 5px 0 18px;
}

.score-heading {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 10px;
}

.score-heading strong {
  font-size: 30px;
  color: #2563eb;
}

.score-heading span {
  color: #94a3b8;
}

.activity {
  margin: 16px 0;
  font-weight: 700;
}

@media (max-width: 700px) {
  .guide-header,
  .score-control {
    flex-direction: column;
  }
}
</style>
