import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { weatherCities } from '@/data/weatherData'
import { fetchCurrentWeather, getWeatherErrorMessage } from '@/services/weatherApi'
import { createActivityInsight } from '@/utils/activityInsight'

export const useWeatherStore = defineStore('weather', () => {
  // ======================================================
  // State
  // ======================================================

  const weatherList = ref(
    weatherCities.map((city) => ({
      ...city,

      source: 'mock',
      isLoading: false,
      apiError: null,

      lat: null,
      lon: null,
      observedAt: null,
      weatherIcon: null,
    })),
  )

  const isLoading = ref(false)

  const lastUpdatedAt = ref(null)

  // ======================================================
  // Getters
  // ======================================================

  const liveCityCount = computed(() => {
    return weatherList.value.filter((city) => city.source === 'live').length
  })

  const totalCityCount = computed(() => {
    return weatherList.value.length
  })

  // ======================================================
  // Internal Helper
  // ======================================================

  function replaceCity(cityId, newCityData) {
    const index = weatherList.value.findIndex((city) => city.id === cityId)

    if (index === -1) {
      return
    }

    weatherList.value[index] = newCityData
  }

  // ======================================================
  // Actions
  // ======================================================

  async function fetchCityWeather(cityId) {
    const currentCity = weatherList.value.find((city) => city.id === cityId)

    if (!currentCity) {
      return null
    }

    replaceCity(cityId, {
      ...currentCity,
      isLoading: true,
      apiError: null,
    })

    try {
      const liveWeather = await fetchCurrentWeather(currentCity)

      const activityInsight = createActivityInsight(liveWeather)

      const updatedCity = {
        ...currentCity,
        ...liveWeather,
        ...activityInsight,

        isLoading: false,
        apiError: null,
      }

      replaceCity(cityId, updatedCity)

      return updatedCity
    } catch (error) {
      const errorMessage = getWeatherErrorMessage(error)

      console.error(`[Weather API] ${currentCity.name} 조회 실패:`, error)

      const fallbackCity = {
        ...currentCity,

        source: 'mock',
        isLoading: false,
        apiError: errorMessage,
      }

      replaceCity(cityId, fallbackCity)

      return fallbackCity
    }
  }

  async function fetchAllWeather() {
    isLoading.value = true

    try {
      const requests = weatherCities.map((city) => fetchCityWeather(city.id))

      await Promise.allSettled(requests)

      lastUpdatedAt.value = Date.now()
    } finally {
      isLoading.value = false
    }
  }

  function getCityById(cityId) {
    return weatherList.value.find((city) => city.id === cityId)
  }

  return {
    weatherList,
    isLoading,
    lastUpdatedAt,

    liveCityCount,
    totalCityCount,

    fetchCityWeather,
    fetchAllWeather,
    getCityById,
  }
})
