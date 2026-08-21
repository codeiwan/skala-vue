import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

const openWeatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
})

function validateApiKey() {
  if (!API_KEY) {
    throw new Error('OpenWeatherMap API Key가 설정되지 않았습니다. .env.local을 확인하세요.')
  }
}

// ======================================================
// Current Weather API
// ======================================================

export async function fetchCurrentWeather(targetCity) {
  validateApiKey()

  const response = await openWeatherApi.get('/weather', {
    params: {
      q: targetCity.english,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  const data = response.data

  return {
    temp: Number(data.main.temp.toFixed(1)),

    feelsLike: Number(data.main.feels_like.toFixed(1)),

    humidity: data.main.humidity,
    pressure: data.main.pressure,

    status: data.weather?.[0]?.description || '정보 없음',

    weatherMain: data.weather?.[0]?.main || '',

    weatherIcon: data.weather?.[0]?.icon || null,

    windSpeed: data.wind?.speed ?? 0,

    windDeg: data.wind?.deg ?? null,

    cloudiness: data.clouds?.all ?? 0,

    visibility: data.visibility ?? null,

    lat: data.coord?.lat ?? null,

    lon: data.coord?.lon ?? null,

    observedAt: data.dt ?? null,

    sunrise: data.sys?.sunrise ?? null,

    sunset: data.sys?.sunset ?? null,

    source: 'live',
  }
}

// ======================================================
// Air Pollution API
// OpenWeatherMap 추가 API
// ======================================================

export async function fetchAirPollution(lat, lon) {
  validateApiKey()

  const response = await openWeatherApi.get('/air_pollution', {
    params: {
      lat,
      lon,
      appid: API_KEY,
    },
  })

  const airData = response.data.list?.[0]

  if (!airData) {
    return null
  }

  return {
    aqi: airData.main?.aqi ?? null,

    pm25: airData.components?.pm2_5 ?? null,

    pm10: airData.components?.pm10 ?? null,

    no2: airData.components?.no2 ?? null,

    o3: airData.components?.o3 ?? null,
  }
}

// ======================================================
// Axios Error → 화면용 메시지
// ======================================================

export function getWeatherErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      return 'API Key 인증에 실패했습니다.'
    }

    if (error.response?.status === 404) {
      return '도시 정보를 찾을 수 없습니다.'
    }

    if (error.response) {
      return `날씨 서버 오류 (${error.response.status})`
    }

    if (error.request) {
      return '날씨 서버에서 응답을 받지 못했습니다.'
    }
  }

  return error.message || '알 수 없는 오류가 발생했습니다.'
}
