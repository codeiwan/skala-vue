<script setup>
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const configStore = useConfigStore()
const weatherStore = useWeatherStore()
const { weatherList, liveCityCount } = storeToRefs(weatherStore)
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
      <header>
        <p class="eyebrow">ACTIVITY GUIDE</p>

        <h1>오늘 어디서 활동할까?</h1>

        <p class="description">
          OpenWeatherMap의 현재 날씨를 기반으로 계산된 활동 적합도를 활용합니다.
        </p>
      </header>

      <section class="score-control">
        <div class="score-description">
          <span> 전역 활동 추천 기준 </span>

          <strong>
            {{ configStore.activityThresholdLabel }}
          </strong>
        </div>

        <div class="buttons">
          <button
            :class="{
              active: configStore.activityScoreThreshold === 60,
            }"
            @click="configStore.setActivityScoreThreshold(60)"
          >
            60점
          </button>

          <button
            :class="{
              active: configStore.activityScoreThreshold === 70,
            }"
            @click="configStore.setActivityScoreThreshold(70)"
          >
            70점
          </button>

          <button
            :class="{
              active: configStore.activityScoreThreshold === 80,
            }"
            @click="configStore.setActivityScoreThreshold(80)"
          >
            80점
          </button>
        </div>
      </section>

      <p class="result-summary">
        현재 추천 도시
        <strong> {{ recommendedCities.length }}개 </strong>
      </p>

      <section class="city-grid">
        <article v-for="city in recommendedCities" :key="city.id" class="guide-card">
          <div class="city-heading">
            <div>
              <p class="region">
                {{ city.region }}
              </p>

              <h2>
                {{ city.name }}
              </h2>
            </div>

            <span :class="['source', city.source]">
              {{ city.source === 'live' ? 'LIVE' : 'MOCK' }}
            </span>
          </div>

          <p class="score">{{ city.activityScore }}점</p>

          <p>
            {{ city.activity }}
          </p>

          <div class="recommendation">
            {{ city.recommendation }}
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<style scoped>
.guide-page {
  min-height: 100vh;
  padding: 48px 24px;
  background-color: #f4f7fb;
  color: #1f2937;
}

.guide-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
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
  color: #6b7280;
}

.score-control {
  padding: 20px;
  margin: 28px 0 20px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.score-description {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.score-description span {
  color: #64748b;
}

.score-description strong {
  color: #2563eb;
}

.buttons {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.buttons button {
  padding: 8px 14px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  background-color: #eff6ff;
  color: #1d4ed8;
  font-weight: 700;
  cursor: pointer;
}

.buttons button.active {
  border-color: #2563eb;
  background-color: #2563eb;
  color: #ffffff;
}

.result-summary {
  margin: 0 0 16px;
  color: #475569;
}

.result-summary strong {
  color: #2563eb;
}

.city-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

.guide-card {
  padding: 22px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
}

.city-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.region {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}

.guide-card h2 {
  margin: 5px 0 20px;
}

.source {
  height: fit-content;
  padding: 4px 7px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 800;
}

.source.live {
  background-color: #dcfce7;
  color: #15803d;
}

.source.mock {
  background-color: #fef3c7;
  color: #a16207;
}

.score {
  font-size: 28px;
  font-weight: 700;
  color: #2563eb;
}

.recommendation {
  padding: 12px;
  margin-top: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  font-weight: 700;
}
</style>
