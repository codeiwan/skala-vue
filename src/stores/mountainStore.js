import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { getMountainErrorMessage, searchMountains } from '@/services/mountainApi'

function normalizeMountainName(value) {
  return value.replace(/\s+/g, '').toLowerCase()
}

function getMountainSearchPriority(mountainName, keyword) {
  const normalizedName = normalizeMountainName(mountainName)
  const normalizedKeyword = normalizeMountainName(keyword)

  if (normalizedName === normalizedKeyword) return 0
  if (normalizedName.startsWith(normalizedKeyword)) return 1
  if (normalizedName.includes(normalizedKeyword)) return 2
  return 3
}

function sortMountainResults(mountains, keyword) {
  return [...mountains].sort((first, second) => {
    const firstPriority = getMountainSearchPriority(first.name, keyword)
    const secondPriority = getMountainSearchPriority(second.name, keyword)

    if (firstPriority !== secondPriority) {
      return firstPriority - secondPriority
    }

    return first.name.localeCompare(second.name, 'ko')
  })
}

export const useMountainStore = defineStore('mountain', () => {
  const mountains = ref([])
  const searchKeyword = ref('')
  const lastSearchedKeyword = ref('')
  const selectedMountain = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const lastSearchedAt = ref(null)

  const resultCount = computed(() => mountains.value.length)
  const hasResults = computed(() => resultCount.value > 0)

  const exactMatch = computed(() => {
    const normalizedKeyword = normalizeMountainName(lastSearchedKeyword.value)

    return (
      mountains.value.find(
        (mountain) => normalizeMountainName(mountain.name) === normalizedKeyword,
      ) || null
    )
  })

  async function search(keyword) {
    const normalizedKeyword = keyword.trim()

    if (!normalizedKeyword) {
      errorMessage.value = '검색할 산 이름을 입력하세요.'
      mountains.value = []
      return []
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
      const result = await searchMountains(normalizedKeyword)
      const sortedMountains = sortMountainResults(result.mountains, normalizedKeyword)

      mountains.value = sortedMountains
      searchKeyword.value = normalizedKeyword
      lastSearchedKeyword.value = normalizedKeyword
      lastSearchedAt.value = new Date()

      if (sortedMountains.length === 0) {
        errorMessage.value = `'${normalizedKeyword}'에 해당하는 산 정보를 찾지 못했습니다.`
      }

      return sortedMountains
    } catch (error) {
      console.error('[Mountain Store] 산 검색 실패:', error)

      mountains.value = []
      errorMessage.value = getMountainErrorMessage(error)
      return []
    } finally {
      isLoading.value = false
    }
  }

  function selectMountain(mountain) {
    selectedMountain.value = mountain
  }

  async function getMountainByName(mountainName) {
    const normalizedName = mountainName.trim()

    const cachedMountain = mountains.value.find((mountain) => mountain.name === normalizedName)

    if (cachedMountain) {
      selectedMountain.value = cachedMountain
      return cachedMountain
    }

    const results = await search(normalizedName)
    const exactMountain = results.find((mountain) => mountain.name === normalizedName)

    selectedMountain.value = exactMountain || results[0] || null
    return selectedMountain.value
  }

  function clearError() {
    errorMessage.value = ''
  }

  function clearSearch() {
    mountains.value = []
    searchKeyword.value = ''
    lastSearchedKeyword.value = ''
    selectedMountain.value = null
    errorMessage.value = ''
    lastSearchedAt.value = null
  }

  return {
    mountains,
    searchKeyword,
    lastSearchedKeyword,
    selectedMountain,
    isLoading,
    errorMessage,
    lastSearchedAt,
    resultCount,
    hasResults,
    exactMatch,
    search,
    selectMountain,
    getMountainByName,
    clearError,
    clearSearch,
  }
})
