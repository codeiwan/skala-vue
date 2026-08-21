<script setup>
import { computed, ref } from 'vue'

import { weatherList } from '@/data/weatherData'

const selectedScore = ref(70)

const recommendedCities = computed(() => {
  return weatherList.filter((city) => city.activityScore >= selectedScore.value)
})
</script>

<template>
  <div class="guide-page">
    <main class="guide-container">
      <header>
        <p class="eyebrow">ACTIVITY GUIDE</p>

        <h1>오늘 어디서 활동할까?</h1>

        <p class="description">
          Weather Signal의 활동 적합도를 기준으로 야외 활동에 적합한 도시를 확인합니다.
        </p>
      </header>

      <section class="score-control">
        <span> 최소 활동 적합도 </span>

        <div class="buttons">
          <button @click="selectedScore = 60">60점</button>

          <button @click="selectedScore = 70">70점</button>

          <button @click="selectedScore = 80">80점</button>
        </div>

        <strong> {{ selectedScore }}점 이상 </strong>
      </section>

      <section class="city-grid">
        <article v-for="city in recommendedCities" :key="city.id" class="guide-card">
          <p class="region">
            {{ city.region }}
          </p>

          <h2>
            {{ city.name }}
          </h2>

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
  display: flex;

  align-items: center;

  gap: 16px;

  padding: 20px;
  margin: 28px 0;

  background-color: #ffffff;

  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.buttons {
  display: flex;

  gap: 8px;
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

.region {
  margin: 0;

  color: #6b7280;

  font-size: 13px;
}

.guide-card h2 {
  margin: 5px 0 20px;
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
