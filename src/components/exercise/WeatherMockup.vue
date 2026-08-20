<script setup>
import { computed, ref, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const selectedCityInfo = ref(null)

const weatherList = ref([
  {
    id: 'city_01',
    name: '서울',
    region: '수도권',
    temp: 28,
    status: '맑음',
    humidity: 48,
    rainProbability: 10,

    activity: '야외 활동에 적합',
    activityScore: 88,
    recommendation: '저녁 시간대 러닝 추천',
    caution: '낮 시간대 강한 더위 주의',
  },
  {
    id: 'city_02',
    name: '수원',
    region: '수도권',
    temp: 24,
    status: '비',
    humidity: 72,
    rainProbability: 80,

    activity: '실내 활동을 권장',
    activityScore: 42,
    recommendation: '실내 운동이나 가벼운 활동',
    caution: '외출 시 우산 준비 권장',
  },
  {
    id: 'city_03',
    name: '인천',
    region: '수도권',
    temp: 25,
    status: '구름',
    humidity: 67,
    rainProbability: 35,

    activity: '가벼운 야외 활동 가능',
    activityScore: 71,
    recommendation: '송도 주변 산책 추천',
    caution: '해안 지역의 강한 바람 주의',
  },
  {
    id: 'city_04',
    name: '춘천',
    region: '강원',
    temp: 23,
    status: '맑음',
    humidity: 55,
    rainProbability: 15,

    activity: '야외 활동에 적합',
    activityScore: 86,
    recommendation: '호수 산책이나 자전거 추천',
    caution: '아침저녁 일교차에 주의',
  },
  {
    id: 'city_05',
    name: '강릉',
    region: '강원',
    temp: 25,
    status: '맑음',
    humidity: 64,
    rainProbability: 20,

    activity: '야외 활동에 적합',
    activityScore: 84,
    recommendation: '해변 산책이나 가벼운 러닝',
    caution: '강한 자외선에 주의',
  },
  {
    id: 'city_06',
    name: '대전',
    region: '충청',
    temp: 23,
    status: '흐림',
    humidity: 58,
    rainProbability: 40,

    activity: '야외 활동 가능',
    activityScore: 68,
    recommendation: '가벼운 산책 정도 추천',
    caution: '외출 전 강수 여부 확인',
  },
  {
    id: 'city_07',
    name: '청주',
    region: '충청',
    temp: 26,
    status: '맑음',
    humidity: 52,
    rainProbability: 15,

    activity: '야외 활동에 적합',
    activityScore: 81,
    recommendation: '공원 러닝이나 산책 추천',
    caution: '한낮의 높은 기온 주의',
  },
  {
    id: 'city_08',
    name: '광주',
    region: '호남',
    temp: 29,
    status: '맑음',
    humidity: 61,
    rainProbability: 10,

    activity: '야외 활동 시 주의',
    activityScore: 64,
    recommendation: '해가 진 뒤 야외 활동 추천',
    caution: '고온과 강한 자외선 주의',
  },
  {
    id: 'city_09',
    name: '전주',
    region: '호남',
    temp: 27,
    status: '구름',
    humidity: 63,
    rainProbability: 30,

    activity: '가벼운 야외 활동 가능',
    activityScore: 75,
    recommendation: '한옥마을 산책 추천',
    caution: '높은 습도에 수분 보충 권장',
  },
  {
    id: 'city_10',
    name: '여수',
    region: '호남',
    temp: 26,
    status: '비',
    humidity: 78,
    rainProbability: 70,

    activity: '실내 활동을 권장',
    activityScore: 46,
    recommendation: '실내 관광이나 카페 활동',
    caution: '해안 강수와 강풍에 주의',
  },
  {
    id: 'city_11',
    name: '대구',
    region: '영남',
    temp: 31,
    status: '맑음',
    humidity: 46,
    rainProbability: 5,

    activity: '야외 활동 시 주의',
    activityScore: 55,
    recommendation: '저녁 시간대 활동 추천',
    caution: '폭염과 탈수 위험에 주의',
  },
  {
    id: 'city_12',
    name: '부산',
    region: '영남',
    temp: 26,
    status: '구름',
    humidity: 65,
    rainProbability: 30,

    activity: '가벼운 야외 활동 가능',
    activityScore: 76,
    recommendation: '해안 산책이나 가벼운 운동',
    caution: '높은 습도에 수분 보충 권장',
  },
  {
    id: 'city_13',
    name: '울산',
    region: '영남',
    temp: 27,
    status: '맑음',
    humidity: 60,
    rainProbability: 15,

    activity: '야외 활동에 적합',
    activityScore: 80,
    recommendation: '공원이나 해안 산책 추천',
    caution: '강한 햇빛과 자외선 주의',
  },
  {
    id: 'city_14',
    name: '창원',
    region: '영남',
    temp: 26,
    status: '흐림',
    humidity: 66,
    rainProbability: 35,

    activity: '가벼운 야외 활동 가능',
    activityScore: 72,
    recommendation: '공원 산책이나 가벼운 운동',
    caution: '갑작스러운 비에 대비',
  },
  {
    id: 'city_15',
    name: '제주',
    region: '제주',
    temp: 27,
    status: '맑음',
    humidity: 69,
    rainProbability: 20,

    activity: '야외 활동에 적합',
    activityScore: 82,
    recommendation: '해안 산책이나 야외 활동',
    caution: '강한 햇빛과 높은 습도 주의',
  },
])

const selectedMessage = ref('도시를 선택해 주세요.')

// computed
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()

  if (query === '') {
    return weatherList.value
  }

  return weatherList.value.filter((city) => city.name.includes(query))
})

// watch
watch(selectedCityInfo, (newCity, oldCity) => {
  if (newCity === null) {
    return
  }

  selectedMessage.value = `${newCity.name}이 선택되었습니다.`

  console.log(`[watch] 선택 도시 변경: ${oldCity?.name || '없음'} → ${newCity.name}`)

  console.log(`[watch] 상태바 문구 업데이트: ${selectedMessage.value}`)
})

// watchEffect
watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어: "${searchQuery.value}"`)
})

// Composition API 확장
const minActivityScore = ref(70)

const recommendedCityCount = computed(() => {
  return weatherList.value.filter((city) => city.activityScore >= minActivityScore.value).length
})

watch(minActivityScore, (newScore, oldScore) => {
  console.log(
    `[Activity Watcher] 활동 추천 기준이 ${oldScore}점에서 ${newScore}점으로 변경되었습니다.`,
  )
})

// Event Handler
const selectCity = (city) => {
  selectedCityInfo.value = city
}

const showDetail = (city) => {
  window.alert(
    `${city.name}의 현재 날씨는 [${city.status}] 상태입니다.\n\n` +
      `기온: ${city.temp}℃\n` +
      `습도: ${city.humidity}%\n` +
      `강수확률: ${city.rainProbability}%\n\n` +
      `[활동 인사이트]\n` +
      `활동 적합도: ${city.activityScore}점\n` +
      `판단: ${city.activity}\n` +
      `추천: ${city.recommendation}\n` +
      `주의: ${city.caution}`,
  )
}
</script>

<template>
  <div class="weather-page">
    <section class="weather-dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <p class="eyebrow">WEATHER SIGNAL</p>

        <h1>과제 2: 날씨 Composition</h1>

        <p class="description">
          날씨 정보를 기반으로 오늘의 활동 적합도와 추천 활동을 함께 보여주는 Weather Mockup
        </p>
      </header>

      <!-- 도시 검색 -->
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
          검색 중인 도시:
          <strong>
            {{ searchQuery || '전체 도시' }}
          </strong>
        </p>
      </section>

      <!-- Activity Insight 추천 기준 -->
      <section class="search-section">
        <label>Activity Insight 추천 기준</label>

        <p class="search-result">
          활동 적합도
          <strong>{{ minActivityScore }}점 이상</strong>인 도시를 추천 도시로 판단합니다.
        </p>

        <div class="score-buttons">
          <button class="score-button" @click="minActivityScore = 60">60점</button>

          <button class="score-button" @click="minActivityScore = 70">70점</button>

          <button class="score-button" @click="minActivityScore = 80">80점</button>
        </div>

        <p class="search-result">
          현재 기준을 만족하는 추천 도시:
          <strong>{{ recommendedCityCount }}개</strong>
        </p>
      </section>

      <!-- 카드를 클릭하면 선택된 도시를 상태바에 표시 -->
      <div class="status-bar">
        {{ selectedMessage }}
      </div>

      <!-- 검색 결과 -->
      <section v-if="filteredWeatherList.length > 0" class="weather-grid">
        <article
          v-for="city in filteredWeatherList"
          :key="city.id"
          class="weather-card"
          @click="selectCity(city)"
        >
          <!-- 도시 정보 -->
          <div class="card-header">
            <div>
              <p class="region">{{ city.region }}</p>
              <h2>{{ city.name }}</h2>
            </div>

            <span class="weather-status">
              {{ city.status }}
            </span>
          </div>

          <!-- 기온 -->
          <section class="temperature-section">
            <p class="temperature">{{ city.temp }}℃</p>

            <p v-if="city.temp >= 25" class="temperature-label hot">🔥 더움 (25도 이상)</p>

            <p v-else class="temperature-label cool">❄️ 선선함 (25도 미만)</p>
          </section>

          <!-- 기본 날씨 정보 -->
          <section class="basic-weather-info">
            <div class="info-item">
              <span>습도</span>
              <strong>{{ city.humidity }}%</strong>
            </div>

            <div class="info-item">
              <span>강수확률</span>
              <strong>{{ city.rainProbability }}%</strong>
            </div>
          </section>

          <!-- Activity Insight -->
          <section class="activity-info">
            <div class="activity-summary">
              <div class="info-item">
                <span>활동 적합도</span>
                <strong>{{ city.activityScore }} / 100</strong>
              </div>

              <div class="info-item">
                <span>판단</span>
                <strong>{{ city.activity }}</strong>
              </div>
            </div>

            <div class="insight-panel">
              <div class="insight-row">
                <span class="insight-label">추천</span>

                <strong class="insight-value">
                  {{ city.recommendation }}
                </strong>
              </div>

              <div class="insight-row">
                <span class="insight-label">주의</span>

                <strong class="insight-value">
                  {{ city.caution }}
                </strong>
              </div>
            </div>
          </section>

          <!-- 추천 여부 -->
          <section class="recommendation-result">
            <p
              v-if="city.activityScore >= minActivityScore"
              class="recommendation-message recommended"
            >
              👍 현재 기준의 추천 도시
            </p>

            <p v-else class="recommendation-message not-recommended">⚠️ 현재 활동 추천 기준 미달</p>
          </section>

          <button class="detail-button" @click.stop="showDetail(city)">상세보기</button>
        </article>
      </section>

      <!-- 검색 결과 없음 -->
      <section v-else class="empty-result">
        <p class="empty-title">검색 결과가 없습니다.</p>

        <p class="empty-description">"{{ searchQuery }}"와 일치하는 도시를 찾을 수 없습니다.</p>
      </section>
    </section>
  </div>
</template>

<style scoped>
@import '@/assets/exercise.css';
</style>
