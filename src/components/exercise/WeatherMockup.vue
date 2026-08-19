<script setup>
import { ref } from 'vue'

// 도시 검색어
const searchQuery = ref('')

// 현재 선택된 도시 안내 문구
const selectedMessage = ref('도시를 선택해 주세요.')

// 날씨 Mock Data
const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    region: '중부',
    temp: 28,
    status: '맑음',
    humidity: 48,
    rainProbability: 10,
  },
  {
    id: 'city_02',
    name: '수원',
    region: '경기',
    temp: 24,
    status: '비',
    humidity: 72,
    rainProbability: 80,
  },
  {
    id: 'city_03',
    name: '부산',
    region: '영남',
    temp: 26,
    status: '구름',
    humidity: 65,
    rainProbability: 30,
  },
  {
    id: 'city_04',
    name: '대전',
    region: '충청',
    temp: 23,
    status: '흐림',
    humidity: 58,
    rainProbability: 40,
  },
  {
    id: 'city_05',
    name: '제주',
    region: '제주',
    temp: 27,
    status: '맑음',
    humidity: 69,
    rainProbability: 20,
  },
])

// 날씨 카드 선택
const selectCity = (cityName) => {
  selectedMessage.value = `${cityName}이 선택되었습니다.`
}

// 상세 날씨 확인
const showDetail = (city) => {
  window.alert(
    `${city.name}의 현재 날씨는 [${city.status}] 상태입니다.\n` +
      `기온: ${city.temp}℃\n` +
      `습도: ${city.humidity}%\n` +
      `강수확률: ${city.rainProbability}%`,
  )
}
</script>

<template>
  <div class="weather-page">
    <section class="weather-dashboard">
      <header class="dashboard-header">
        <p class="eyebrow">SKALA WEATHER</p>
        <h1>과제 1: 지역별 날씨 현황</h1>
        <p class="description">Weather Mockup</p>
      </header>

      <section class="search-section">
        <label for="city-search">도시 검색</label>

        <input
          id="city-search"
          type="text"
          :value="searchQuery"
          @input="searchQuery = $event.target.value"
          placeholder="도시 이름을 한글로 입력하세요"
        />

        <p class="search-result">
          입력한 도시명: <strong>{{ searchQuery || '도시를 입력해 주세요.' }}</strong>
        </p>
      </section>

      <!-- 카드를 클릭하면 선택된 도시를 상태바에 표시 -->
      <div>
        {{ selectedMessage }}
      </div>

      <!-- v-for를 이용한 배열 렌더링
       :key에 city.id 바인딩 -->
      <section class="weather-grid">
        <article
          v-for="city in weatherList"
          :key="city.id"
          class="weather-card"
          @click="selectCity(city.name)"
        >
          <div class="card-header">
            <div>
              <p class="region">{{ city.region }}</p>
              <h2>{{ city.name }}</h2>
            </div>

            <span class="weather-status">
              {{ city.status }}
            </span>
          </div>

          <p class="temperature">{{ city.temp }}</p>

          <!-- 기온에 따른 조건부 렌더링-->
          <p v-if="city.temp >= 25" class="temperature-label hot">🔥 더움 (25도 이상)</p>

          <p v-else class="temperature-label cool">❄️ 선선함 (25도 미만)</p>

          <!-- 직접 추가한 데이터를 활용한 Mockup -->
          <div class="extra-weather-info">
            <div class="info-item">
              <span>습도</span>
              <strong>{{ city.humidity }}%</strong>
            </div>

            <div class="info-item">
              <span>강수확률</span>
              <strong>{{ city.rainProbability }}%</strong>
            </div>
          </div>

          <!-- .stop으로 카드의 클릭 이벤트까지 전달되는 것을 방지 -->
          <button class="detail-button" @click.stop="showDetail(city)">상세보기</button>
        </article>
      </section>
    </section>
  </div>
</template>

<style scoped>
@import '@/assets/exercise.css';
</style>
