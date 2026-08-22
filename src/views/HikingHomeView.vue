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
      <section class="search-hero">
        <div class="hero-copy">
          <p class="eyebrow">FIND YOUR MOUNTAIN</p>
          <h1>
            오늘은 어느 산으로<br />
            가볼까요?
          </h1>

          <p class="hero-description">
            산 정보를 검색하고 현재 기상과 대기질, 산행 환경 점수까지 한 번에 확인하세요.
          </p>

          <div class="hero-features">
            <span>산림청 공공데이터</span>
            <span>현재 기상</span>
            <span>대기질</span>
            <span>Hiking Condition</span>
          </div>
        </div>

        <div class="hero-decoration" aria-hidden="true">
          <div class="sun"></div>
          <div class="mountain mountain-back"></div>
          <div class="mountain mountain-front"></div>
          <div class="ground"></div>
        </div>
      </section>

      <el-card shadow="never" class="search-panel">
        <div class="search-heading">
          <div>
            <strong>산 이름으로 검색</strong>
          </div>

          <div class="source-badge">
            <span>DATA SOURCE</span>
            <strong>산림청 산 정보 조회_GW</strong>
          </div>
        </div>

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

        <div class="quick-search">
          <span class="quick-label">빠른 검색</span>

          <el-button
            v-for="mountainName in quickSearches"
            :key="mountainName"
            size="small"
            plain
            round
            @click="handleQuickSearch(mountainName)"
          >
            {{ mountainName }}
          </el-button>
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

      <section v-loading="mountainStore.isLoading" class="result-section">
        <div v-if="mountainStore.hasResults" class="result-heading">
          <div>
            <p class="eyebrow">SEARCH RESULT</p>
            <h2>
              <strong>{{ mountainStore.lastSearchedKeyword }}</strong>
              검색 결과
            </h2>
          </div>

          <span class="result-count">
            {{ mountainStore.resultCount }}
            <small>RESULTS</small>
          </span>
        </div>

        <div v-if="mountainStore.hasResults" class="mountain-grid">
          <el-card
            v-for="mountain in mountainStore.mountains"
            :key="mountain.id"
            shadow="hover"
            class="mountain-card"
          >
            <div class="card-top">
              <div class="mountain-meta">
                <span class="mountain-id"># {{ mountain.id }}</span>

                <el-tag v-if="isExactMatch(mountain)" type="success" size="small" effect="light">
                  정확히 일치
                </el-tag>
              </div>

              <div v-if="mountain.height" class="height-badge">
                <strong>{{ mountain.height }}</strong>
                <span>m</span>
              </div>
            </div>

            <div class="mountain-title">
              <h3>{{ mountain.name }}</h3>
              <p v-if="mountain.subtitle">{{ mountain.subtitle }}</p>
            </div>

            <div class="mountain-information">
              <div class="information-block">
                <span class="info-label">LOCATION</span>
                <p>{{ mountain.location || '소재지 정보 없음' }}</p>
              </div>

              <div v-if="mountain.selectionReason" class="information-block famous-info">
                <span class="info-label">100대 명산</span>
                <p>{{ mountain.selectionReason }}</p>
              </div>
            </div>

            <div class="card-footer">
              <span>산행 정보 확인</span>

              <el-button type="primary" plain @click="handleDetail(mountain)">
                자세히 보기 →
              </el-button>
            </div>
          </el-card>
        </div>

        <el-empty
          v-else-if="!mountainStore.isLoading && !mountainStore.errorMessage"
          description="산 이름을 검색하면 결과가 여기에 표시됩니다."
          class="search-empty"
        />
      </section>
    </main>
  </div>
</template>

<style scoped>
.hiking-page {
  min-height: 100vh;
  padding: 54px 24px 80px;
  background: var(--color-background);
  color: var(--color-text);
}
.hiking-container {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
}

.search-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  min-height: 390px;
  overflow: hidden;
  margin-bottom: 28px;
  border: 1px solid var(--color-border-soft);
  border-radius: var(--radius-large);
  background: linear-gradient(135deg, #f8faf6 0%, #edf4ef 58%, #e4eee7 100%);
  box-shadow: var(--shadow-card);
}

.hero-copy {
  position: relative;
  z-index: 2;
  padding: 58px 56px;
}
.eyebrow {
  margin: 0 0 10px;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 2px;
}

.hero-copy h1 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: clamp(40px, 5vw, 58px);
  line-height: 1.12;
  letter-spacing: -2.2px;
}

.hero-description {
  max-width: 580px;
  margin: 20px 0 0;
  color: var(--color-text-secondary);
  font-size: 16px;
  line-height: 1.8;
}

.hero-features {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 28px;
}
.hero-features span {
  padding: 7px 11px;
  border: 1px solid rgba(47, 104, 79, 0.15);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.62);
  color: var(--color-primary-dark);
  font-size: 11px;
  font-weight: 700;
}

.hero-decoration {
  position: relative;
  min-height: 390px;
  overflow: hidden;
}

.sun {
  position: absolute;
  top: 58px;
  right: 78px;
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background: rgba(196, 135, 49, 0.2);
}

.mountain {
  position: absolute;
  right: -30px;
  bottom: -115px;
  transform: rotate(45deg);
  border-radius: 30px 8px 30px 8px;
}

.mountain-back {
  width: 310px;
  height: 310px;
  right: -34px;
  bottom: -157px;
  background: #9ab3a2;
}
.mountain-front {
  width: 355px;
  height: 355px;
  right: 128px;
  bottom: -194px;
  background: var(--color-primary-dark);
}

.ground {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: linear-gradient(180deg, transparent, rgba(23, 58, 45, 0.06));
}

.search-panel {
  margin-bottom: 22px;
  border-radius: var(--radius-medium);
  box-shadow: var(--shadow-card);
}

.search-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}
.search-heading > div:first-child {
  display: flex;
  align-items: center;
  gap: 10px;
}
.search-heading strong {
  color: var(--color-text);
  font-size: 17px;
}

.source-badge {
  display: flex;
  align-items: flex-end;
  flex-direction: column;
  gap: 1px;
}
.source-badge span {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}
.source-badge strong {
  color: var(--color-text-secondary);
  font-size: 11px;
}

.search-area {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}
.search-area :deep(.el-input__wrapper) {
  min-height: 48px;
  padding: 0 16px;
  border-radius: 12px;
}
.search-area .el-button {
  min-width: 112px;
  min-height: 48px;
  border-radius: 12px;
  font-weight: 800;
}

.quick-search {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 15px;
}
.quick-label {
  margin-right: 3px;
  color: var(--color-text-muted);
  font-size: 11px;
  font-weight: 800;
}
.status-alert {
  margin: 20px 0;
}

.result-section {
  min-height: 260px;
  margin-top: 38px;
}

.result-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}
.result-heading h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 26px;
  letter-spacing: -0.7px;
}
.result-heading h2 strong {
  color: var(--color-primary);
}

.result-count {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  color: var(--color-primary);
  font-size: 30px;
  font-weight: 900;
  line-height: 1;
}
.result-count small {
  padding-bottom: 3px;
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.mountain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 18px;
}
.mountain-card {
  border-radius: var(--radius-medium);
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}
.mountain-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
}
.mountain-id {
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.4px;
}

.height-badge {
  display: flex;
  align-items: baseline;
  gap: 2px;
  color: var(--color-primary);
}
.height-badge strong {
  font-size: 23px;
}
.height-badge span {
  font-size: 11px;
  font-weight: 800;
}

.mountain-title {
  min-height: 92px;
  padding: 18px 0;
}
.mountain-title h3 {
  margin: 0;
  color: var(--color-primary-deep);
  font-size: 27px;
  letter-spacing: -0.8px;
}
.mountain-title p {
  margin: 7px 0 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.mountain-information {
  border-top: 1px solid var(--color-border-soft);
}
.information-block {
  padding: 15px 0;
}
.information-block + .information-block {
  border-top: 1px solid var(--color-border-soft);
}
.info-label {
  display: block;
  margin-bottom: 6px;
  color: var(--color-primary);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 1.1px;
}
.information-block p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.65;
}

.famous-info p {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 15px;
  border-top: 1px solid var(--color-border-soft);
}
.card-footer > span {
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
}
.card-footer .el-button {
  border-radius: 9px;
  font-weight: 700;
}
.search-empty {
  padding: 50px 0;
}

@media (max-width: 900px) {
  .search-hero {
    grid-template-columns: 1fr;
    min-height: auto;
  }
  .hero-decoration {
    min-height: 230px;
  }
  .hero-copy {
    padding: 44px 38px 18px;
  }
  .mountain-front {
    right: 30%;
  }
}

@media (max-width: 650px) {
  .hiking-page {
    padding: 34px 16px 58px;
  }
  .search-hero {
    border-radius: 18px;
  }
  .hero-copy {
    padding: 34px 24px 10px;
  }
  .hero-copy h1 {
    font-size: 38px;
  }
  .hero-decoration {
    min-height: 180px;
  }
  .hero-features {
    gap: 6px;
  }
  .search-heading,
  .result-heading {
    align-items: flex-start;
    flex-direction: column;
  }
  .source-badge {
    align-items: flex-start;
  }
  .search-area,
  .mountain-grid {
    grid-template-columns: 1fr;
  }
  .search-area .el-button {
    width: 100%;
  }
}
</style>
