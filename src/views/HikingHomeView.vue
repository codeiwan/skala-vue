<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMountainStore } from '@/stores/mountainStore'

const router = useRouter()
const mountainStore = useMountainStore()
const keyword = ref(mountainStore.searchKeyword || '북한산')

const quickSearches = ['북한산', '설악산', '한라산', '지리산', '무등산']

const handleSearch = async () => {
  await mountainStore.search(keyword.value)
}

const handleQuickSearch = async (mountainName) => {
  keyword.value = mountainName
  await mountainStore.search(mountainName)
}

const handleDetail = (mountain) => {
  mountainStore.selectMountain(mountain)

  router.push({
    name: 'MountainDetail',
    params: {
      mountainName: mountain.name,
    },
  })
}

const isExactMatch = (mountain) => {
  return mountainStore.exactMatch?.id === mountain.id
}
</script>

<template>
  <div class="hiking-page">
    <main class="hiking-container">
      <header class="hero">
        <p class="eyebrow">HIKING SIGNAL</p>
        <h1>오늘은 어느 산으로 가볼까요?</h1>
        <p class="hero-description">
          산림청 공공데이터에서 산 정보를 검색하고, 산행에 필요한 기본 정보와 현재 환경을
          확인합니다.
        </p>
      </header>

      <el-card shadow="never" class="search-card">
        <div class="search-area">
          <el-input
            v-model="keyword"
            size="large"
            clearable
            placeholder="산 이름을 입력하세요. 예: 북한산"
            @keyup.enter="handleSearch"
          />

          <el-button
            type="primary"
            size="large"
            :loading="mountainStore.isLoading"
            @click="handleSearch"
          >
            산 검색
          </el-button>
        </div>

        <div class="search-footer">
          <div class="data-source">
            <span>산림청 산 정보 조회_GW</span>
            <el-tag type="success" effect="plain" size="small">공공데이터</el-tag>
          </div>

          <div class="quick-search">
            <span>빠른 검색</span>

            <el-button
              v-for="mountainName in quickSearches"
              :key="mountainName"
              size="small"
              text
              @click="handleQuickSearch(mountainName)"
            >
              {{ mountainName }}
            </el-button>
          </div>
        </div>
      </el-card>

      <el-alert
        v-if="mountainStore.errorMessage"
        :title="mountainStore.errorMessage"
        type="warning"
        :closable="false"
        show-icon
        class="status-alert"
      />

      <el-alert
        v-else-if="mountainStore.hasResults"
        :title="`'${mountainStore.lastSearchedKeyword}' 검색 결과 · ${mountainStore.resultCount}개`"
        type="success"
        :closable="false"
        show-icon
        class="status-alert"
      />

      <section v-loading="mountainStore.isLoading" class="result-section">
        <div v-if="mountainStore.hasResults" class="mountain-grid">
          <el-card
            v-for="mountain in mountainStore.mountains"
            :key="mountain.id"
            shadow="hover"
            class="mountain-card"
          >
            <div class="card-header">
              <div>
                <div class="mountain-meta">
                  <span class="mountain-id">{{ mountain.id }}</span>

                  <el-tag v-if="isExactMatch(mountain)" type="primary" size="small" effect="plain">
                    정확히 일치
                  </el-tag>
                </div>

                <h2>{{ mountain.name }}</h2>
              </div>

              <el-tag v-if="mountain.height" type="success" effect="plain">
                {{ mountain.height }}m
              </el-tag>
            </div>

            <p v-if="mountain.subtitle" class="subtitle">
              {{ mountain.subtitle }}
            </p>

            <div class="location">
              <span class="info-label">소재지</span>
              <p>{{ mountain.location || '정보 없음' }}</p>
            </div>

            <div v-if="mountain.selectionReason" class="summary">
              <span class="info-label">100대 명산 정보</span>
              <p>{{ mountain.selectionReason }}</p>
            </div>

            <div class="card-footer">
              <el-button type="primary" plain @click="handleDetail(mountain)">
                산 정보 자세히 보기
              </el-button>
            </div>
          </el-card>
        </div>

        <el-empty
          v-else-if="!mountainStore.isLoading && !mountainStore.errorMessage"
          description="산 이름을 검색하면 결과가 여기에 표시됩니다."
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.hiking-page {
  min-height: 100vh;
  padding: 52px 24px 72px;
  background: #f4f7fb;
  color: #1f2937;
}
.hiking-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}
.hero {
  margin-bottom: 26px;
}
.eyebrow {
  margin: 0 0 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1.8px;
}
.hero h1 {
  margin: 0;
  font-size: 38px;
  letter-spacing: -1px;
}
.hero-description {
  max-width: 720px;
  margin: 10px 0 0;
  color: #64748b;
  line-height: 1.7;
}

.search-card {
  border-radius: 16px;
}
.search-area {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}
.search-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 14px;
}
.data-source,
.quick-search,
.mountain-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}
.data-source,
.quick-search {
  color: #94a3b8;
  font-size: 13px;
}
.quick-search {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.status-alert {
  margin-top: 18px;
}
.result-section {
  min-height: 260px;
  margin-top: 20px;
}
.mountain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 18px;
}
.mountain-card {
  border-radius: 16px;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.mountain-id {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
}
.card-header h2 {
  margin: 6px 0 0;
  font-size: 26px;
}
.subtitle {
  margin: 10px 0 18px;
  color: #64748b;
  font-size: 15px;
}

.location,
.summary {
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}
.summary {
  margin-top: 16px;
}
.info-label {
  display: block;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
}
.location p,
.summary p {
  margin: 0;
  color: #475569;
  line-height: 1.65;
}
.summary p {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

@media (max-width: 800px) {
  .search-footer {
    align-items: flex-start;
    flex-direction: column;
  }
  .quick-search {
    justify-content: flex-start;
  }
}

@media (max-width: 600px) {
  .hiking-page {
    padding: 34px 16px 52px;
  }
  .hero h1 {
    font-size: 30px;
  }
  .search-area,
  .mountain-grid {
    grid-template-columns: 1fr;
  }
}
</style>
