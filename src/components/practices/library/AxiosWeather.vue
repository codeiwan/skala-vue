<script setup>
import { ref } from 'vue'
import axios from 'axios'

const weatherData = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const handleFetchWeather = async () => {
  if (!API_KEY) {
    errorMessage.value =
      'OpenWeatherMap API Key가 설정되지 않았습니다. .env.local 파일을 확인하세요.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  const URL = 'https://api.openweathermap.org/data/2.5/weather'

  try {
    const response = await axios.get(URL, {
      params: {
        lat: 35.158582,
        lon: 126.804975,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    console.log('Axios 통신 응답 전체 객체:', response)

    console.log('백엔드가 준 핵심 날씨 데이터(JSON):', response.data)

    weatherData.value = response.data
  } catch (error) {
    console.error('통신 중 에러가 발생했습니다:', error)

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        errorMessage.value = 'API Key 인증에 실패했습니다.'
      } else if (error.response) {
        errorMessage.value = `날씨 API 요청에 실패했습니다. (${error.response.status})`
      } else {
        errorMessage.value = '날씨 서버에서 응답을 받지 못했습니다.'
      }
    } else {
      errorMessage.value = '알 수 없는 오류가 발생했습니다.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>⚡ Axios 통신 검증</h2>

    <p class="practice-description">
      Axios를 사용해 OpenWeatherMap의 실제 날씨 데이터를 비동기로 요청하고 응답 결과를 확인합니다.
    </p>

    <button :disabled="isLoading" @click="handleFetchWeather">
      {{ isLoading ? '데이터 로딩 중...' : '실시간 날씨 데이터 당겨오기' }}
    </button>

    <p v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </p>

    <div v-if="weatherData" class="result-card">
      <p>
        📍 위치:
        <strong>
          {{ weatherData.name }}
        </strong>
      </p>

      <p>
        🌡️ 현재 기온:
        <strong> {{ weatherData.main.temp }}°C </strong>
        (정상 섭씨 변환 완료)
      </p>

      <p>
        ☁️ 날씨 상태:
        <strong>
          {{ weatherData.weather[0].description }}
        </strong>
      </p>

      <p>
        💧 습도:
        <strong> {{ weatherData.main.humidity }}% </strong>
      </p>

      <p>
        🌬️ 풍속:
        <strong> {{ weatherData.wind.speed }} m/s </strong>
      </p>
    </div>

    <div v-else-if="!errorMessage">
      <p>아직 가져온 데이터가 없습니다. 버튼을 눌러 통신을 가동하세요.</p>
    </div>
  </div>
</template>

<style scoped>
.practice-description {
  margin-bottom: 16px;
  color: #64748b;
  line-height: 1.6;
}

button {
  padding: 10px 16px;
  border: 0;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

button:disabled {
  background: #94a3b8;
  cursor: wait;
}

.result-card {
  margin-top: 18px;
  padding: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.result-card p {
  margin: 8px 0;
}

.error-message {
  margin-top: 16px;
  padding: 12px 14px;
  background: #fef2f2;
  border-radius: 8px;
  color: #dc2626;
  font-weight: 700;
}
</style>
