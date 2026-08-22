<script setup>
import { computed, ref } from 'vue'
import { getMountainErrorMessage, searchMountains } from '@/services/mountainApi'

const searchKeyword = ref('북한산')
const mountains = ref([])
const totalCount = ref(0)
const isLoading = ref(false)
const errorMessage = ref('')

const hasResult = computed(() => mountains.value.length > 0)

const handleSearch = async () => {
  const keyword = searchKeyword.value.trim()

  if (!keyword) {
    errorMessage.value = '검색할 산 이름을 입력하세요.'
    mountains.value = []
    totalCount.value = 0
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const result = await searchMountains(keyword)

    mountains.value = result.mountains
    totalCount.value = result.totalCount

    console.log('[Mountain API] 조회 결과:', result)
  } catch (error) {
    console.error('[Mountain API] 조회 실패:', error)

    errorMessage.value = getMountainErrorMessage(error)
    mountains.value = []
    totalCount.value = 0
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="mountain-test-page">
    <main class="mountain-test-container">
      <header class="page-header">
        <p class="eyebrow">API CONNECTION TEST</p>
        <h1>산림청 산 정보 API</h1>
        <p>
          산림청 공공데이터 XML API를 Axios로 호출하고 Vue에서 정상적으로 사용할 수 있는지 확인하는
          테스트 화면입니다.
        </p>
      </header>

      <el-card shadow="never" class="search-card">
        <div class="search-area">
          <el-input
            v-model="searchKeyword"
            placeholder="산 이름 입력"
            clearable
            size="large"
            @keyup.enter="handleSearch"
          />
          <el-button type="primary" size="large" :loading="isLoading" @click="handleSearch">
            산 검색
          </el-button>
        </div>
      </el-card>

      <el-alert
        v-if="errorMessage"
        :title="errorMessage"
        type="error"
        :closable="false"
        show-icon
        class="result-alert"
      />
      <el-alert
        v-if="hasResult"
        :title="`${totalCount}개의 산 정보를 찾았습니다.`"
        type="success"
        :closable="false"
        show-icon
        class="result-alert"
      />

      <div v-loading="isLoading" class="result-area">
        <el-empty
          v-if="!isLoading && !hasResult && !errorMessage"
          description="산 이름을 검색해 API 통신을 확인하세요."
        />

        <el-card
          v-for="mountain in mountains"
          :key="mountain.id"
          shadow="never"
          class="mountain-card"
        >
          <div class="mountain-title">
            <div>
              <span class="mountain-id">{{ mountain.id }}</span>
              <h2>{{ mountain.name }}</h2>
              <p v-if="mountain.subtitle" class="subtitle">
                {{ mountain.subtitle }}
              </p>
            </div>

            <el-tag v-if="mountain.height" type="success" effect="plain" size="large">
              {{ mountain.height }}m
            </el-tag>
          </div>

          <el-descriptions :column="1" border class="mountain-info">
            <el-descriptions-item label="소재지">
              {{ mountain.location || '정보 없음' }}
            </el-descriptions-item>
            <el-descriptions-item label="100대 명산 선정 이유">
              {{ mountain.selectionReason || '정보 없음' }}
            </el-descriptions-item>
            <el-descriptions-item label="대중교통">
              <div class="multiline-text">
                {{ mountain.transportation || '정보 없음' }}
              </div>
            </el-descriptions-item>
          </el-descriptions>

          <section v-if="mountain.courses" class="content-section">
            <h3>추천 산행 코스</h3>
            <p class="multiline-text">
              {{ mountain.courses }}
            </p>
          </section>

          <section v-if="mountain.description" class="content-section">
            <h3>산 소개</h3>
            <p class="multiline-text">
              {{ mountain.description }}
            </p>
          </section>
        </el-card>
      </div>
    </main>
  </div>
</template>

<style scoped>
.mountain-test-page {
  min-height: 100vh;
  padding: 48px 24px 64px;
  background: #f4f7fb;
  color: #1f2937;
}

.mountain-test-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 34px;
  letter-spacing: -0.7px;
}

.page-header p:last-child {
  max-width: 700px;
  margin: 10px 0 0;
  color: #64748b;
  line-height: 1.7;
}

.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
}

.search-card {
  border-radius: 14px;
}

.search-area {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}

.result-alert {
  margin-top: 18px;
}

.result-area {
  min-height: 220px;
  margin-top: 18px;
}

.mountain-card {
  margin-bottom: 18px;
  border-radius: 14px;
}

.mountain-title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.mountain-id {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
}

.mountain-title h2 {
  margin: 4px 0 0;
  font-size: 28px;
}

.subtitle {
  margin: 7px 0 0;
  color: #64748b;
}

.mountain-info {
  margin-bottom: 22px;
}

.content-section {
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.content-section + .content-section {
  margin-top: 20px;
}

.content-section h3 {
  margin: 0 0 10px;
  font-size: 17px;
}

.multiline-text {
  margin: 0;
  white-space: pre-line;
  line-height: 1.75;
  color: #475569;
}

@media (max-width: 600px) {
  .mountain-test-page {
    padding: 32px 16px 48px;
  }

  .search-area {
    grid-template-columns: 1fr;
  }

  .mountain-title {
    flex-direction: column;
  }
}
</style>
